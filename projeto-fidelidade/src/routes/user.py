from flask import Blueprint, jsonify, request, session
from src.models.user import User, db
from functools import wraps
import re

user_bp = Blueprint('user', __name__)

def validate_email(email):
    """Validate email format and allowed domains"""
    if not email:
        return False, "Email is required"
    
    # Check basic email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return False, "Invalid email format"
    
    # Check allowed domains
    allowed_domains = ['gmail.com', 'hotmail.com', 'eniac.edu.br']
    domain = email.split('@')[1].lower()
    
    if domain not in allowed_domains:
        return False, f"Email domain not allowed. Use: {', '.join(allowed_domains)}"
    
    return True, "Valid email"

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@user_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    # Validate email format and domain
    is_valid, message = validate_email(email)
    if not is_valid:
        return jsonify({'error': message}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@user_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'Username, email and password required'}), 400
    
    # Validate email format and domain
    is_valid, message = validate_email(email)
    if not is_valid:
        return jsonify({'error': message}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    # Create new user
    user = User(username=username, email=email, points=0)  # Start with 0 points
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    session['user_id'] = user.id
    
    return jsonify({
        'message': 'Registration successful',
        'user': user.to_dict()
    }), 201

@user_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'}), 200

@user_bp.route('/auth/me', methods=['GET'])
@login_required
def get_current_user():
    user = User.query.get(session['user_id'])
    return jsonify(user.to_dict())

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password', 'defaultpass')
    
    if not username or not email:
        return jsonify({'error': 'Username and email required'}), 400
    
    user = User(username=username, email=email, points=data.get('points', 0))
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'points' in data:
        user.points = data['points']
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

@user_bp.route('/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    # Validate email format and domain
    is_valid, message = validate_email(email)
    if not is_valid:
        return jsonify({'error': message}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # For security, don't reveal if email exists or not
        return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200
    
    # In a real application, you would:
    # 1. Generate a secure reset token
    # 2. Store it in the database with expiration
    # 3. Send email with reset link
    # For this demo, we'll just return success
    
    return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200

@user_bp.route('/users/<int:user_id>/points', methods=['POST'])
@login_required
def add_points(user_id):
    # Only allow users to add points to their own account or admin functionality
    current_user_id = session['user_id']
    if current_user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    points_to_add = data.get('points', 0)
    
    if points_to_add <= 0:
        return jsonify({'error': 'Points must be positive'}), 400
    
    user = User.query.get_or_404(user_id)
    user.points += points_to_add
    db.session.commit()
    
    return jsonify({
        'message': f'Added {points_to_add} points',
        'user': user.to_dict()
    })
