import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  maxPrice,
  setMaxPrice,
}) => {
  return (
    <div className="search-filter-container animate-fade-in">
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Buscar produto por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label htmlFor="category-select" className="filter-label">Categoria</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">Ordenar por</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="relevance">Relevância</option>
            <option value="price-asc">Preço: Menor para Maior</option>
            <option value="price-desc">Preço: Maior para Menor</option>
            <option value="rating-desc">Melhor Avaliados</option>
          </select>
        </div>

        <div className="filter-group price-slider-group">
          <div className="price-slider-labels">
            <span className="filter-label">Preço Máximo:</span>
            <span className="price-value">R$ {Math.round(maxPrice * 5.5)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="price-range-input"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
