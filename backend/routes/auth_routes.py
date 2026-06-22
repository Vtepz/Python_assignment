from itsdangerous import BadSignature, URLSafeTimedSerializer
from flask import Blueprint, current_app, jsonify, request

from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def create_token(user):
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return serializer.dumps({"user_id": user.id, "username": user.username}, salt="hrm-auth")


def read_token(token, max_age=60 * 60 * 8):
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return serializer.loads(token, salt="hrm-auth", max_age=max_age)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid username or password"}), 401

    return jsonify(
        {
            "message": "Login successful",
            "token": create_token(user),
            "user": user.to_dict(),
        }
    )


@auth_bp.route("/me", methods=["GET"])
def current_user():
    header = request.headers.get("Authorization", "")
    token = header.replace("Bearer ", "", 1).strip()

    if not token:
        return jsonify({"message": "Missing authorization token"}), 401

    try:
        payload = read_token(token)
    except BadSignature:
        return jsonify({"message": "Invalid or expired token"}), 401

    user = User.query.get(payload.get("user_id"))
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": user.to_dict()})
