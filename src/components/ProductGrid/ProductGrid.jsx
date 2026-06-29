import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="empty-grid-message animate-fade-in">
        <p>Nenhum produto encontrado com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="product-grid grid-responsive">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
