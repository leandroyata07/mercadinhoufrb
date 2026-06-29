import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    zip: '',
    address: '',
    paymentMethod: 'credit-card',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setOrderNumber(`NS-${Math.floor(100000 + Math.random() * 900000)}`);
      clearCart(); 
    }, 1500);
  };

  const total = getCartTotal();

  if (success) {
    return (
      <div className="checkout-page-container container animate-fade-in">
        <div className="success-card">
          <CheckCircle2 size={64} className="success-icon" />
          <h1 className="success-title">Pedido Confirmado!</h1>
          <p className="success-subtitle">Obrigado por comprar na NovaStore.</p>

          <div className="order-details-box">
            <div className="order-detail-row">
              <span>Número do Pedido:</span>
              <strong>{orderNumber}</strong>
            </div>
            <div className="order-detail-row">
              <span>Destinatário:</span>
              <strong>{formData.name}</strong>
            </div>
            <div className="order-detail-row">
              <span>Endereço de entrega:</span>
              <strong>{formData.address}</strong>
            </div>
            <div className="order-detail-row">
              <span>Método de Pagamento:</span>
              <strong>
                {formData.paymentMethod === 'credit-card' ? 'Cartão de Crédito' : 'Boleto Bancário / Pix'}
              </strong>
            </div>
          </div>

          <p className="success-email-alert">
            Enviamos um e-mail de confirmação para <strong>{formData.email}</strong> com os detalhes do envio.
          </p>

          <Link to="/" className="btn btn-primary back-home-btn">
            <ShoppingBag size={18} />
            Voltar para a vitrine
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page-container container animate-fade-in">
        <div className="checkout-empty-view">
          <h2>Checkout indisponível</h2>
          <p>Você precisa ter itens no carrinho para finalizar a compra.</p>
          <Link to="/" className="btn btn-primary mt-4">
            Voltar à vitrine
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container container animate-fade-in">
      <Link to="/cart" className="back-link">
        <ArrowLeft size={16} />
        Voltar para o carrinho
      </Link>

      <h1 className="checkout-page-title">Finalizar Compra</h1>

      <div className="checkout-layout-grid">
        <form onSubmit={handleSubmit} className="checkout-form-section">
          <h3 className="form-section-title">Dados de Entrega</h3>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="seu-email@exemplo.com"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group zip-group">
              <label htmlFor="zip" className="form-label">CEP</label>
              <input
                type="text"
                id="zip"
                name="zip"
                required
                value={formData.zip}
                onChange={handleChange}
                placeholder="00000-000"
                className="form-input"
              />
            </div>

            <div className="form-group address-group">
              <label htmlFor="address" className="form-label">Endereço Completo</label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Rua, Número, Bairro, Cidade - UF"
                className="form-input"
              />
            </div>
          </div>

          <h3 className="form-section-title payment-title">Método de Pagamento</h3>
          <div className="payment-options">
            <label className={`payment-option-card ${formData.paymentMethod === 'credit-card' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={formData.paymentMethod === 'credit-card'}
                onChange={handleChange}
                className="payment-radio-input"
              />
              <span className="payment-card-content">
                <CreditCard size={20} className="payment-icon" />
                <span>Cartão de Crédito</span>
              </span>
            </label>

            <label className={`payment-option-card ${formData.paymentMethod === 'pix' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="pix"
                checked={formData.paymentMethod === 'pix'}
                onChange={handleChange}
                className="payment-radio-input"
              />
              <span className="payment-card-content">
                <span className="pix-symbol">P</span>
                <span>Pix / Boleto Bancário</span>
              </span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary submit-checkout-btn" disabled={loading}>
            {loading ? 'Processando transação...' : `Confirmar Pagamento`}
          </button>
        </form>

        <div className="checkout-summary-section">
          <OrderSummary total={total} isCheckoutPage={true} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
