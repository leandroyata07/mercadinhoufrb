import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Check, ShieldCheck, Truck } from 'lucide-react';
import { getProductById } from '../../services/api';
import { useCart } from '../../context/CartContext';
import Loader from '../../components/Common/Loader';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os detalhes do produto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  if (loading) {
    return <Loader message="Buscando detalhes do produto..." />;
  }

  if (error || !product) {
    return <ErrorMessage message={error || 'Produto não encontrado.'} onRetry={fetchProduct} />;
  }

  const priceBrl = product.price * 5.5;

  return (
    <div className="product-detail-container container animate-fade-in">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Voltar para a vitrine
      </Link>

      <div className="product-detail-grid">
        <div className="product-image-section">
          <div className="detail-image-container">
            <img src={product.image} alt={product.title} className="detail-image" />
          </div>
        </div>

        <div className="product-info-section">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-rating">
            <div className="stars-wrapper">
              <Star className="star-icon" size={16} />
              <span className="rating-value">{product.rating?.rate || '0.0'}</span>
            </div>
            <span className="rating-divider">|</span>
            <span className="rating-count">{product.rating?.count || 0} avaliações de clientes</span>
          </div>

          <div className="detail-price-box">
            <span className="price-label">Preço à vista</span>
            <div className="detail-price">
              R$ {priceBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="installments">
              ou 10x de R$ {(priceBrl / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sem juros
            </p>
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-buying-actions">
            <div className="quantity-control-wrapper">
              <span className="qty-label">Qtd:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="quantity-select-dropdown"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={`btn btn-primary buy-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? (
                <>
                  <Check size={18} />
                  Adicionado!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Adicionar ao Carrinho
                </>
              )}
            </button>
          </div>

          <div className="detail-shipping-benefits">
            <div className="benefit-item">
              <Truck className="benefit-icon" size={20} />
              <div>
                <h4 className="benefit-title">Frete com condições especiais</h4>
                <p className="benefit-desc">Frete grátis em compras acima de R$ 200,00.</p>
              </div>
            </div>
            <div className="benefit-item">
              <ShieldCheck className="benefit-icon" size={20} />
              <div>
                <h4 className="benefit-title">Compra 100% Segura</h4>
                <p className="benefit-desc">Garantia de devolução e proteção dos seus dados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
