from flask import Blueprint, jsonify, request, session
from src.models.user import User, Product, db
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        
        user = User.query.get(session['user_id'])
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin privileges required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin/products', methods=['GET'])
@admin_required
def admin_get_products():
    """Get all products for admin management"""
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([product.to_dict() for product in products])

@admin_bp.route('/admin/products', methods=['POST'])
@admin_required
def admin_create_product():
    """Create a new product"""
    data = request.json
    
    required_fields = ['name', 'price', 'category']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            price=int(data['price']),
            category=data['category'],
            image_url=data.get('image_url', ''),
            stock=int(data.get('stock', 0)),
            badge=data.get('badge', '')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({'error': 'Invalid data format'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create product'}), 500

@admin_bp.route('/admin/products/<int:product_id>', methods=['PUT'])
@admin_required
def admin_update_product(product_id):
    """Update an existing product"""
    product = Product.query.get_or_404(product_id)
    data = request.json
    
    try:
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = int(data.get('price', product.price))
        product.category = data.get('category', product.category)
        product.image_url = data.get('image_url', product.image_url)
        product.stock = int(data.get('stock', product.stock))
        product.badge = data.get('badge', product.badge)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        })
        
    except ValueError as e:
        return jsonify({'error': 'Invalid data format'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update product'}), 500

@admin_bp.route('/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required
def admin_delete_product(product_id):
    """Delete a product"""
    product = Product.query.get_or_404(product_id)
    
    try:
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete product'}), 500

@admin_bp.route('/admin/stats', methods=['GET'])
@admin_required
def admin_get_stats():
    """Get admin dashboard statistics"""
    from src.models.user import Transaction
    
    total_products = Product.query.count()
    total_users = User.query.filter_by(is_admin=False).count()
    total_transactions = Transaction.query.count()
    low_stock_products = Product.query.filter(Product.stock <= 5).count()
    
    return jsonify({
        'total_products': total_products,
        'total_users': total_users,
        'total_transactions': total_transactions,
        'low_stock_products': low_stock_products
    })

@admin_bp.route('/admin/check', methods=['GET'])
def check_admin():
    """Check if current user is admin"""
    if 'user_id' not in session:
        return jsonify({'is_admin': False}), 200
    
    user = User.query.get(session['user_id'])
    return jsonify({'is_admin': user.is_admin if user else False})

