# Human Resource Management System

A full-stack HRM System for a beginner to intermediate university assignment. The system lets an HR manager manage employee records from normal dashboard pages and from a console-style terminal inside the React frontend.

## Tech Stack

Backend:

- Python Flask
- Flask SQLAlchemy
- Flask CORS
- PostgreSQL
- REST API architecture

Frontend:

- React.js with Vite
- Bootstrap 5
- Axios
- React Router
- Lucide React icons

## Project Structure

```text
hrm-system/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   │   ├── employee_routes.py
│   │   ├── payroll_routes.py
│   │   └── dashboard_routes.py
│   ├── database/
│   │   └── schema.sql
│   ├── seed.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── layouts/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── README.md
```

## 1. Create the PostgreSQL Database

Open pgAdmin or the PostgreSQL SQL Shell and create the database:

```sql
CREATE DATABASE hrm_system;
```

You can also run the included schema from a terminal:

```powershell
cd backend
psql -U postgres -f database/schema.sql
```

If PostgreSQL asks for a password, enter the password you created when installing PostgreSQL.

## 2. Install Backend Packages

Open a terminal in the project folder:

```powershell
cd hrm-system\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create your backend environment file:

```powershell
copy .env.example .env
```

Open `backend\.env` and update the PostgreSQL password:

```env
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/hrm_system
```

## 3. Run the Flask Backend

Create the database tables and insert sample employees:

```powershell
python seed.py
```

Start the Flask API:

```powershell
python app.py
```

The backend should run at:

```text
http://localhost:5000
```

Main API endpoints:

- `POST /api/employees`
- `GET /api/employees`
- `GET /api/employees/<employee_id>`
- `PUT /api/employees/<employee_id>`
- `DELETE /api/employees/<employee_id>`
- `GET /api/payroll`
- `GET /api/dashboard`

## 4. Install Frontend Packages

Open another terminal:

```powershell
cd hrm-system\frontend
npm install
```

## 5. Run the React Frontend

```powershell
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

Login page demo values:

```text
Username: admin
Password: admin123
```

This login is a simple frontend demo login for assignment presentation. It is not a production authentication system.

## 6. Test the Terminal Commands

Go to:

```text
http://localhost:5173/terminal
```

Try these commands:

```text
help
view
search EMP001
add EMP006; Jane Doe; HR Officer; Human Resources; 50000; 2024-06-01
update EMP006; Jane Doe; Senior HR Officer; Human Resources; 58000; 2024-06-01
remove EMP006
yes
payroll
stats
clear
exit
```

The `remove EMP001` command asks for confirmation. Type `yes` to delete or `no` to cancel.

## Added Full-System Features

Real backend login:

- Default username: `admin`
- Default password: `admin123`
- Passwords are stored as hashed values in the `users` table.
- Run `python seed.py` after setup to create the admin user.

Employee profile:

- Open the Employees page.
- Click the eye icon on an employee row.
- The profile page shows full employee details and supports CSV export and print.

Export features:

- Employees page can export all employees to CSV.
- Payroll page can export payroll summary to CSV.
- Payroll and employee profile pages support browser print, which can also save as PDF.

## Employee Rules

- Employee ID must be unique.
- Employee ID, full name, position, department, salary, and date hired are required.
- Salary must be greater than 0.
- Date hired must use `YYYY-MM-DD`.

## Notes for Windows

- Run backend commands from `hrm-system\backend`.
- Run frontend commands from `hrm-system\frontend`.
- Make sure PostgreSQL is running before starting Flask.
- If `python` does not work, try `py` instead.
- If `psql` is not recognized, add the PostgreSQL `bin` folder to your Windows PATH or use pgAdmin.




run backend

cd C:\Users\User\Desktop\python_assignment\hrm-system\backend
venv\Scripts\activate
python app.py

python seed.py

run front

cd C:\Users\User\Desktop\python_assignment\hrm-system\frontend
npm run dev