from flask import Blueprint, jsonify, request, session
from src.models.user import User, Product, Transaction, db
from functools import wraps
from datetime import datetime

products_bp = Blueprint('products', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

@products_bp.route('/products', methods=['GET'])
def get_products():
    # Get query parameters for filtering
    category = request.args.get('category')
    sort_by = request.args.get('sort', 'name')
    max_price = request.args.get('max_price', type=int)
    
    query = Product.query
    
    # Apply filters
    if category and category != 'all':
        query = query.filter(Product.category == category)
    
    if max_price:
        query = query.filter(Product.price <= max_price)
    
    # Apply sorting
    if sort_by == 'price-asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price-desc':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'name':
        query = query.order_by(Product.name.asc())
    elif sort_by == 'popular':
        # Sort by badge "Popular" first, then by price
        query = query.order_by(
            (Product.badge == 'Popular').desc(),
            Product.price.asc()
        )
    
    products = query.all()
    return jsonify([product.to_dict() for product in products])

@products_bp.route('/products', methods=['POST'])
def create_product():
    data = request.json
    
    required_fields = ['name', 'price', 'category']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        category=data['category'],
        image_url=data.get('image_url', ''),
        stock=data.get('stock', 0),
        badge=data.get('badge')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.json
    
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.category = data.get('category', product.category)
    product.image_url = data.get('image_url', product.image_url)
    product.stock = data.get('stock', product.stock)
    product.badge = data.get('badge', product.badge)
    
    db.session.commit()
    return jsonify(product.to_dict())

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return '', 204

@products_bp.route('/products/<int:product_id>/redeem', methods=['POST'])
@login_required
def redeem_product(product_id):
    user_id = session['user_id']
    user = User.query.get(user_id)
    product = Product.query.get_or_404(product_id)
    
    # Validate user exists
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check if user has enough points
    if user.points < product.price:
        return jsonify({
            'error': 'Insufficient points',
            'required_points': product.price,
            'current_points': user.points,
            'missing_points': product.price - user.points
        }), 400
    
    # Check if product is in stock
    if product.stock <= 0:
        return jsonify({'error': 'Product out of stock'}), 400
    
    try:
        # Create transaction
        transaction = Transaction(
            user_id=user_id,
            product_id=product_id,
            points_spent=product.price,
            status='completed',
            redeemed_at=datetime.utcnow()
        )
        
        # Deduct points from user (this is the key fix)
        user.points -= product.price
        
        # Reduce product stock
        product.stock -= 1
        
        # Save all changes
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'message': 'Product redeemed successfully',
            'transaction': transaction.to_dict(),
            'remaining_points': user.points,
            'product_name': product.name,
            'points_spent': product.price
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Transaction failed. Please try again.'}), 500

@products_bp.route('/transactions', methods=['GET'])
@login_required
def get_user_transactions():
    user_id = session['user_id']
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.created_at.desc()).all()
    return jsonify([transaction.to_dict() for transaction in transactions])

@products_bp.route('/transactions/<int:transaction_id>', methods=['GET'])
@login_required
def get_transaction(transaction_id):
    user_id = session['user_id']
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first_or_404()
    return jsonify(transaction.to_dict())

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    # Get unique categories from products
    categories = db.session.query(Product.category).distinct().all()
    category_list = [cat[0] for cat in categories]
    return jsonify(category_list)

