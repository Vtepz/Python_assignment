from flask import Blueprint, jsonify
from sqlalchemy import func

from models import Employee, db

payroll_bp = Blueprint("payroll", __name__, url_prefix="/api/payroll")


@payroll_bp.route("", methods=["GET"])
def get_payroll():
    total = db.session.query(func.coalesce(func.sum(Employee.salary), 0)).scalar()
    average = db.session.query(func.coalesce(func.avg(Employee.salary), 0)).scalar()
    highest = Employee.query.order_by(Employee.salary.desc()).first()
    lowest = Employee.query.order_by(Employee.salary.asc()).first()

    return jsonify(
        {
            "total_payroll_budget": float(total),
            "average_salary": float(average),
            "highest_salary": float(highest.salary) if highest else 0,
            "lowest_salary": float(lowest.salary) if lowest else 0,
            "highest_paid_employee": highest.to_dict() if highest else None,
            "lowest_paid_employee": lowest.to_dict() if lowest else None,
        }
    )
