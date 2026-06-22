from flask import Blueprint, jsonify
from sqlalchemy import func

from models import Employee, db

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("", methods=["GET"])
def get_dashboard():
    total_employees = Employee.query.count()
    total_payroll = db.session.query(func.coalesce(func.sum(Employee.salary), 0)).scalar()
    average_salary = db.session.query(func.coalesce(func.avg(Employee.salary), 0)).scalar()
    highest_paid = Employee.query.order_by(Employee.salary.desc()).first()
    recent_employees = Employee.query.order_by(Employee.created_at.desc()).limit(5).all()

    return jsonify(
        {
            "total_employees": total_employees,
            "total_payroll_budget": float(total_payroll),
            "average_salary": float(average_salary),
            "highest_paid_employee": highest_paid.to_dict() if highest_paid else None,
            "recent_activity": [employee.to_dict() for employee in recent_employees],
        }
    )
