import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import './OrderSummary.css';

const OrderSummary = ({ total, onCheckout, isCheckoutPage = false }) => {
  const navigate = useNavigate();

  
  const totalBrl = total * 5.5;
  const shippingBrl = totalBrl > 200 || totalBrl === 0 ? 0 : 20.0;
  const finalTotalBrl = totalBrl + shippingBrl;

  return (
    <div className="order-summary animate-fade-in">
      <h3 className="summary-title">Resumo do Pedido</h3>

      <div className="summary-details">
        <div className="summary-row">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">
            R$ {totalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Frete</span>
          <span className="summary-value">
            {shippingBrl === 0 ? (
              <span className="shipping-free">Grátis</span>
            ) : (
              `R$ ${shippingBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            )}
          </span>
        </div>

        {shippingBrl > 0 && (
          <p className="shipping-tip">
            Adicione mais <strong>R$ {Math.max(0, 200 - totalBrl).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</strong> para ganhar frete grátis!
          </p>
        )}

        <div className="summary-divider"></div>

        <div className="summary-row summary-total-row">
          <span className="total-label">Total</span>
          <span className="total-value">
            R$ {finalTotalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {!isCheckoutPage && total > 0 && (
        <button
          className="btn btn-primary checkout-btn"
          onClick={() => navigate('/checkout')}
        >
          <CreditCard size={18} />
          Fechar Pedido
        </button>
      )}
    </div>
  );
};

export default OrderSummary;
