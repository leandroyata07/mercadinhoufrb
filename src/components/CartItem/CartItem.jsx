import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import './CartItem.css';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const { product, quantity } = item;

  return (
    <div className="cart-item animate-fade-in">
      <div className="cart-item-image-wrapper">
        <img src={product.image} alt={product.title} className="cart-item-image" />
      </div>

      <div className="cart-item-details">
        <Link to={`/product/${product.id}`} className="cart-item-title">
          {product.title}
        </Link>
        <span className="cart-item-category">{product.category}</span>
        <span className="cart-item-price-unit">
          Unitário: R$ {(product.price * 5.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-selector">
          <button
            className="quantity-btn"
            onClick={() => updateQuantity(product.id, quantity - 1)}
            aria-label="Diminuir quantidade"
          >
            <Minus size={16} />
          </button>
          <span className="quantity-value">{quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => updateQuantity(product.id, quantity + 1)}
            aria-label="Aumentar quantidade"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="cart-item-subtotal">
          R$ {(product.price * 5.5 * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        <button
          className="remove-btn"
          onClick={() => removeFromCart(product.id)}
          aria-label="Remover do carrinho"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
