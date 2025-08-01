import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.products import products_bp
from src.routes.certificates import certificates_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app, supports_credentials=True)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(certificates_bp, url_prefix='/api')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize database and create sample data
with app.app_context():
    db.create_all()
    
    # Create sample admin user if not exists
    from src.models.user import User, Product
    
    admin_user = User.query.filter_by(email='admin@eniac.edu.br').first()
    if not admin_user:
        admin_user = User(
            username='admin',
            email='admin@eniac.edu.br',
            points=5000
        )
        admin_user.set_password('admin123')
        db.session.add(admin_user)
    
    # Create sample products if not exist
    if Product.query.count() == 0:
        sample_products = [
            {
                'name': 'Fone Bluetooth Premium',
                'description': 'Fone de ouvido sem fio com cancelamento de ruído e bateria de longa duração.',
                'price': 850,
                'category': 'electronics',
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
                'stock': 5,
                'badge': 'Popular'
            },
            {
                'name': 'Livro: Python para Iniciantes',
                'description': 'Guia completo para aprender programação Python do básico ao avançado.',
                'price': 300,
                'category': 'books',
                'image_url': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop&crop=center',
                'stock': 10
            },
            {
                'name': 'Mochila Escolar Premium',
                'description': 'Mochila resistente com compartimentos para notebook e materiais escolares.',
                'price': 450,
                'category': 'accessories',
                'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center',
                'stock': 8
            },
            {
                'name': 'Vale Lanchonete R$ 20',
                'description': 'Voucher para usar na lanchonete da escola. Válido por 30 dias.',
                'price': 200,
                'category': 'vouchers',
                'image_url': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop&crop=center',
                'stock': 20,
                'badge': 'Novo'
            },
            {
                'name': 'Tablet 10" Android',
                'description': 'Tablet com tela de 10 polegadas, ideal para estudos e entretenimento.',
                'price': 1200,
                'category': 'electronics',
                'image_url': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&crop=center',
                'stock': 3
            },
            {
                'name': 'Kit Canetas Coloridas',
                'description': 'Conjunto com 24 canetas coloridas para desenho e anotações.',
                'price': 150,
                'category': 'accessories',
                'image_url': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop&crop=center',
                'stock': 15
            },
            {
                'name': 'Vale Cinema - 2 Ingressos',
                'description': 'Dois ingressos para qualquer sessão no cinema. Válido por 60 dias.',
                'price': 500,
                'category': 'vouchers',
                'image_url': 'https://images.unsplash.com/photo-1489185078527-20140f217ade?w=300&h=300&fit=crop&crop=center',
                'stock': 12
            },
            {
                'name': 'Revista Científica Anual',
                'description': 'Assinatura anual da revista de divulgação científica mais popular do país.',
                'price': 250,
                'category': 'books',
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center',
                'stock': 6
            }
        ]
        
        for product_data in sample_products:
            product = Product(**product_data)
            db.session.add(product)
    
    db.session.commit()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
