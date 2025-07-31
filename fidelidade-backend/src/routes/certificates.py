from flask import Blueprint, jsonify, request, session
from src.models.user import User, Certificate, db
from functools import wraps
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename

certificates_bp = Blueprint('certificates', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'

@certificates_bp.route('/certificates/upload', methods=['POST'])
@login_required
def upload_certificate():
    user_id = session['user_id']
    
    # Check if file is present in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    # Check file size (10MB limit)
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > 10 * 1024 * 1024:  # 10MB
        return jsonify({'error': 'File size exceeds 10MB limit'}), 400
    
    # Create uploads directory if it doesn't exist
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    original_filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{original_filename}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    file.save(file_path)
    
    # Create certificate record
    certificate = Certificate(
        user_id=user_id,
        filename=unique_filename,
        original_filename=original_filename,
        file_size=file_size,
        status='pending'
    )
    
    db.session.add(certificate)
    db.session.commit()
    
    return jsonify({
        'message': 'Certificate uploaded successfully',
        'certificate': certificate.to_dict()
    }), 201

@certificates_bp.route('/certificates', methods=['GET'])
@login_required
def get_user_certificates():
    user_id = session['user_id']
    certificates = Certificate.query.filter_by(user_id=user_id).order_by(Certificate.uploaded_at.desc()).all()
    return jsonify([cert.to_dict() for cert in certificates])

@certificates_bp.route('/certificates/<int:certificate_id>', methods=['GET'])
@login_required
def get_certificate(certificate_id):
    user_id = session['user_id']
    certificate = Certificate.query.filter_by(id=certificate_id, user_id=user_id).first_or_404()
    return jsonify(certificate.to_dict())

@certificates_bp.route('/certificates/<int:certificate_id>/approve', methods=['POST'])
def approve_certificate(certificate_id):
    # This would typically require admin authentication
    # For now, we'll allow it for demonstration purposes
    
    data = request.json
    points_awarded = data.get('points_awarded', 100)  # Default 100 points
    reviewer_notes = data.get('reviewer_notes', '')
    
    certificate = Certificate.query.get_or_404(certificate_id)
    user = User.query.get(certificate.user_id)
    
    # Update certificate status
    certificate.status = 'approved'
    certificate.points_awarded = points_awarded
    certificate.reviewed_at = datetime.utcnow()
    certificate.reviewer_notes = reviewer_notes
    
    # Award points to user
    user.points += points_awarded
    
    db.session.commit()
    
    return jsonify({
        'message': 'Certificate approved successfully',
        'certificate': certificate.to_dict(),
        'user_points': user.points
    })

@certificates_bp.route('/certificates/<int:certificate_id>/reject', methods=['POST'])
def reject_certificate(certificate_id):
    # This would typically require admin authentication
    
    data = request.json
    reviewer_notes = data.get('reviewer_notes', '')
    
    certificate = Certificate.query.get_or_404(certificate_id)
    
    # Update certificate status
    certificate.status = 'rejected'
    certificate.reviewed_at = datetime.utcnow()
    certificate.reviewer_notes = reviewer_notes
    
    db.session.commit()
    
    return jsonify({
        'message': 'Certificate rejected',
        'certificate': certificate.to_dict()
    })

@certificates_bp.route('/admin/certificates', methods=['GET'])
def get_all_certificates():
    # This would typically require admin authentication
    
    status = request.args.get('status', 'pending')
    certificates = Certificate.query.filter_by(status=status).order_by(Certificate.uploaded_at.desc()).all()
    
    # Include user information
    result = []
    for cert in certificates:
        cert_dict = cert.to_dict()
        cert_dict['user'] = cert.user.to_dict()
        result.append(cert_dict)
    
    return jsonify(result)

@certificates_bp.route('/certificates/stats', methods=['GET'])
@login_required
def get_certificate_stats():
    user_id = session['user_id']
    
    total = Certificate.query.filter_by(user_id=user_id).count()
    pending = Certificate.query.filter_by(user_id=user_id, status='pending').count()
    approved = Certificate.query.filter_by(user_id=user_id, status='approved').count()
    rejected = Certificate.query.filter_by(user_id=user_id, status='rejected').count()
    
    total_points_earned = db.session.query(db.func.sum(Certificate.points_awarded)).filter_by(
        user_id=user_id, status='approved'
    ).scalar() or 0
    
    return jsonify({
        'total_certificates': total,
        'pending': pending,
        'approved': approved,
        'rejected': rejected,
        'total_points_earned': total_points_earned
    })

