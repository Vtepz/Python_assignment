from datetime import datetime
from decimal import Decimal, InvalidOperation

from flask import Blueprint, jsonify, request
from sqlalchemy import or_

from models import Employee, db

employee_bp = Blueprint("employees", __name__, url_prefix="/api/employees")


def parse_employee_payload(data, partial=False):
    required_fields = ["employee_id", "full_name", "position", "department", "salary", "date_hired"]
    errors = []

    if not partial:
        for field in required_fields:
            if field not in data or str(data.get(field, "")).strip() == "":
                errors.append(f"{field} is required")

    cleaned = {}
    text_fields = ["employee_id", "full_name", "position", "department"]
    for field in text_fields:
        if field in data:
            value = str(data.get(field, "")).strip()
            if value == "":
                errors.append(f"{field} cannot be empty")
            cleaned[field] = value

    if "salary" in data:
        try:
            salary = Decimal(str(data["salary"]))
            if salary <= 0:
                errors.append("salary must be greater than 0")
            cleaned["salary"] = salary
        except (InvalidOperation, ValueError):
            errors.append("salary must be a valid number")

    if "date_hired" in data:
        try:
            cleaned["date_hired"] = datetime.strptime(str(data["date_hired"]), "%Y-%m-%d").date()
        except ValueError:
            errors.append("date_hired must use YYYY-MM-DD format")

    return cleaned, errors


@employee_bp.route("", methods=["POST"])
def create_employee():
    data = request.get_json() or {}
    cleaned, errors = parse_employee_payload(data)

    if errors:
        return jsonify({"message": "Validation failed", "errors": errors}), 400

    existing_employee = Employee.query.filter_by(employee_id=cleaned["employee_id"]).first()
    if existing_employee:
        return jsonify({"message": "Employee ID already exists"}), 409

    employee = Employee(**cleaned)
    db.session.add(employee)
    db.session.commit()

    return jsonify({"message": "Employee created successfully", "employee": employee.to_dict()}), 201


@employee_bp.route("", methods=["GET"])
def get_employees():
    search = request.args.get("search", "").strip()
    sort_by = request.args.get("sort_by", "employee_id")
    order = request.args.get("order", "asc").lower()

    allowed_sort_fields = {
        "employee_id": Employee.employee_id,
        "full_name": Employee.full_name,
        "department": Employee.department,
        "salary": Employee.salary,
        "date_hired": Employee.date_hired,
    }

    query = Employee.query
    if search:
        query = query.filter(
            or_(
                Employee.employee_id.ilike(f"%{search}%"),
                Employee.full_name.ilike(f"%{search}%"),
                Employee.department.ilike(f"%{search}%"),
                Employee.position.ilike(f"%{search}%"),
            )
        )

    sort_column = allowed_sort_fields.get(sort_by, Employee.employee_id)
    if order == "desc":
        sort_column = sort_column.desc()

    employees = query.order_by(sort_column).all()
    return jsonify({"employees": [employee.to_dict() for employee in employees]})


@employee_bp.route("/<employee_id>", methods=["GET"])
def get_employee(employee_id):
    employee = Employee.query.filter_by(employee_id=employee_id).first()
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    return jsonify({"employee": employee.to_dict()})


@employee_bp.route("/<employee_id>", methods=["PUT"])
def update_employee(employee_id):
    employee = Employee.query.filter_by(employee_id=employee_id).first()
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    data = request.get_json() or {}
    cleaned, errors = parse_employee_payload(data, partial=True)

    if "employee_id" in cleaned and cleaned["employee_id"] != employee.employee_id:
        duplicate = Employee.query.filter_by(employee_id=cleaned["employee_id"]).first()
        if duplicate:
            errors.append("employee_id already exists")

    if errors:
        return jsonify({"message": "Validation failed", "errors": errors}), 400

    for field, value in cleaned.items():
        setattr(employee, field, value)

    db.session.commit()
    return jsonify({"message": "Employee updated successfully", "employee": employee.to_dict()})


@employee_bp.route("/<employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    employee = Employee.query.filter_by(employee_id=employee_id).first()
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted successfully"})
