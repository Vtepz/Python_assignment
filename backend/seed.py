from datetime import date

from app import create_app
from models import Employee, User, db

sample_employees = [
    {
        "employee_id": "EMP001",
        "full_name": "Ava Johnson",
        "position": "HR Manager",
        "department": "Human Resources",
        "salary": 72000,
        "date_hired": date(2021, 5, 10),
    },
    {
        "employee_id": "EMP002",
        "full_name": "Liam Smith",
        "position": "Software Developer",
        "department": "IT",
        "salary": 68000,
        "date_hired": date(2022, 2, 14),
    },
    {
        "employee_id": "EMP003",
        "full_name": "Sophia Brown",
        "position": "Accountant",
        "department": "Finance",
        "salary": 56000,
        "date_hired": date(2020, 9, 1),
    },
    {
        "employee_id": "EMP004",
        "full_name": "Noah Davis",
        "position": "Recruitment Officer",
        "department": "Human Resources",
        "salary": 52000,
        "date_hired": date(2023, 3, 20),
    },
    {
        "employee_id": "EMP005",
        "full_name": "Mia Wilson",
        "position": "Operations Supervisor",
        "department": "Operations",
        "salary": 61000,
        "date_hired": date(2021, 11, 8),
    },
]


def seed_database():
    app = create_app()
    with app.app_context():
        db.create_all()

        admin = User.query.filter_by(username="admin").first()
        if not admin:
            admin = User(username="admin", full_name="System Administrator", role="Admin")
            admin.set_password("admin123")
            db.session.add(admin)

        for employee_data in sample_employees:
            exists = Employee.query.filter_by(employee_id=employee_data["employee_id"]).first()
            if not exists:
                db.session.add(Employee(**employee_data))

        db.session.commit()
        print("Sample employee data and admin user inserted successfully.")


if __name__ == "__main__":
    seed_database()
