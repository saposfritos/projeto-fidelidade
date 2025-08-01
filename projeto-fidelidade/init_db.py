#!/usr/bin/env python3
"""
Script para inicializar o banco de dados do programa de fidelidade ENIAC
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.main import app
from src.models.user import db, User, Product, Certificate, Transaction

def init_database():
    """Inicializa o banco de dados e cria dados de exemplo"""
    
    with app.app_context():
        # Criar todas as tabelas
        print("Criando tabelas do banco de dados...")
        db.create_all()
        
        # Verificar se já existem dados
        if User.query.count() > 0:
            print("Banco de dados já possui dados. Pulando inicialização.")
            return
        
        print("Criando dados de exemplo...")
        
        # Criar usuários de exemplo
        users_data = [
            {
                'username': 'admin',
                'email': 'admin@eniac.edu.br',
                'password': 'admin123',
                'points': 5000
            },
            {
                'username': 'joao.silva',
                'email': 'joao.silva@gmail.com',
                'password': 'senha123',
                'points': 1250
            },
            {
                'username': 'maria.santos',
                'email': 'maria.santos@hotmail.com',
                'password': 'senha123',
                'points': 800
            },
            {
                'username': 'pedro.oliveira',
                'email': 'pedro.oliveira@eniac.edu.br',
                'password': 'senha123',
                'points': 0
            }
        ]
        
        for user_data in users_data:
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                points=user_data['points']
            )
            user.set_password(user_data['password'])
            db.session.add(user)
            print(f"Usuário criado: {user_data['username']} ({user_data['email']})")
        
        # Criar produtos de exemplo
        products_data = [
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
                'stock': 10,
                'badge': None
            },
            {
                'name': 'Mochila Escolar Premium',
                'description': 'Mochila resistente com compartimentos para notebook e materiais escolares.',
                'price': 450,
                'category': 'accessories',
                'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center',
                'stock': 8,
                'badge': None
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
                'stock': 3,
                'badge': None
            },
            {
                'name': 'Kit Canetas Coloridas',
                'description': 'Conjunto com 24 canetas coloridas para desenho e anotações.',
                'price': 150,
                'category': 'accessories',
                'image_url': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop&crop=center',
                'stock': 15,
                'badge': None
            },
            {
                'name': 'Vale Cinema - 2 Ingressos',
                'description': 'Dois ingressos para qualquer sessão no cinema. Válido por 60 dias.',
                'price': 500,
                'category': 'vouchers',
                'image_url': 'https://images.unsplash.com/photo-1489185078527-20140f217ade?w=300&h=300&fit=crop&crop=center',
                'stock': 12,
                'badge': None
            },
            {
                'name': 'Revista Científica Anual',
                'description': 'Assinatura anual da revista de divulgação científica mais popular do país.',
                'price': 250,
                'category': 'books',
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center',
                'stock': 6,
                'badge': None
            },
            {
                'name': 'Mouse Gamer RGB',
                'description': 'Mouse gamer com iluminação RGB e alta precisão para jogos.',
                'price': 320,
                'category': 'electronics',
                'image_url': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop&crop=center',
                'stock': 7,
                'badge': None
            },
            {
                'name': 'Caderno Universitário',
                'description': 'Caderno universitário com 200 folhas e espiral resistente.',
                'price': 80,
                'category': 'accessories',
                'image_url': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop&crop=center',
                'stock': 25,
                'badge': None
            }
        ]
        
        for product_data in products_data:
            product = Product(**product_data)
            db.session.add(product)
            print(f"Produto criado: {product_data['name']} - {product_data['price']} pontos")
        
        # Salvar todas as alterações
        db.session.commit()
        
        print("\n✅ Banco de dados inicializado com sucesso!")
        print(f"📊 Usuários criados: {len(users_data)}")
        print(f"🛍️ Produtos criados: {len(products_data)}")
        print("\n🔑 Credenciais de teste:")
        print("Admin: admin@eniac.edu.br / admin123 (5000 pontos)")
        print("Usuário: joao.silva@gmail.com / senha123 (1250 pontos)")
        print("Usuário: maria.santos@hotmail.com / senha123 (800 pontos)")
        print("Usuário: pedro.oliveira@eniac.edu.br / senha123 (0 pontos)")

def reset_database():
    """Remove todas as tabelas e recria o banco"""
    with app.app_context():
        print("⚠️ Removendo todas as tabelas...")
        db.drop_all()
        print("✅ Tabelas removidas. Recriando...")
        init_database()

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Inicializar banco de dados do programa de fidelidade')
    parser.add_argument('--reset', action='store_true', help='Resetar o banco de dados (remove todos os dados)')
    
    args = parser.parse_args()
    
    if args.reset:
        reset_database()
    else:
        init_database()

