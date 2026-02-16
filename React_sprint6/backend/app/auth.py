import hashlib
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "muTrackerSecret"
ALGORITHM = "HS256"


# ---------------- PASSWORD HANDLING ----------------

def hash_password(password: str):
    """
    Hash password using SHA-256 (no length limit, no crashes).
    """
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain: str, stored: str):
    """
    Works for:
    - Plain text passwords (old DB)
    - SHA-256 hashed passwords (new users)
    """

    # If stored password looks like SHA-256 hash (64 hex chars)
    if len(stored) == 64 and all(c in "0123456789abcdef" for c in stored.lower()):
        return hashlib.sha256(plain.encode()).hexdigest() == stored

    # Else fallback to plain-text comparison
    return plain == stored


# ---------------- JWT TOKEN ----------------

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=4)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
