import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="product-card animate-fade-in">
      <Link to={`/product/${product.id}`} className="card-image-link">
        <div className="card-image-container">
          <img src={product.image} alt={product.title} className="card-image" />
          <span className="card-category">{product.category}</span>
        </div>
      </Link>

      <div className="card-content">
        <Link to={`/product/${product.id}`}>
          <h3 className="card-title" title={product.title}>
            {product.title}
          </h3>
        </Link>

        <div className="card-rating">
          <Star className="star-icon" size={14} />
          <span className="rating-value">{product.rating?.rate || '0.0'}</span>
          <span className="rating-count">({product.rating?.count || 0})</span>
        </div>

        <div className="card-footer">
          <div className="card-price-container">
            <span className="price-label">A partir de</span>
            <span className="card-price">
              R$ {(product.price * 5.5).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            className={`btn-icon-cart ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
            aria-label="Adicionar ao carrinho"
            disabled={added}
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
