import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem/CartItem';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="cart-page-container container animate-fade-in">
        <div className="empty-cart-view">
          <ShoppingCart size={64} className="empty-cart-icon" />
          <h2>Seu carrinho está vazio</h2>
          <p>Que tal explorar nossos produtos e escolher algo especial para você?</p>
          <Link to="/" className="btn btn-primary go-shopping-btn">
            Ir para a vitrine
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container container animate-fade-in">
      <div className="cart-header-actions">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Continuar comprando
        </Link>

        <button className="clear-cart-btn" onClick={clearCart}>
          <Trash2 size={16} />
          Limpar Carrinho
        </button>
      </div>

      <h1 className="cart-page-title">Meu Carrinho</h1>

      <div className="cart-layout-grid">
        <div className="cart-items-section">
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>

        <div className="cart-summary-section">
          <OrderSummary total={total} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
