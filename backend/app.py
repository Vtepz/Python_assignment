import os

from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import text

from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.employee_routes import employee_bp
from routes.payroll_routes import payroll_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    allowed_origins = os.getenv("ALLOWED_ORIGINS")
    origins = (
        [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]
        if allowed_origins
        else ["http://localhost:5173", "http://127.0.0.1:5173"]
    )
    CORS(app, resources={r"/api/*": {"origins": origins}})
    db.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(payroll_bp)
    app.register_blueprint(dashboard_bp)

    @app.route("/")
    def home():
        return jsonify({"message": "HRM System API is running", "status": "ok"})

    @app.route("/api/health")
    def health():
        try:
            db.session.execute(text("SELECT 1"))
            return jsonify({"status": "ok", "database": "connected"})
        except Exception as error:
            return jsonify({"status": "error", "database": "unreachable", "message": str(error)}), 500

    @app.cli.command("init-db")
    def init_db():
        """Create all database tables."""
        db.create_all()
        print("Database tables created.")

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"message": "Route not found"}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"message": "Internal server error"}), 500

    return app


app = create_app()


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
