import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../../services/api';
import SearchBar from '../../components/SearchBar/SearchBar';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import Loader from '../../components/Common/Loader';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [maxPrice, setMaxPrice] = useState(1000); 

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);

      
      const prices = productsData.map((p) => p.price * 5.5);
      const maxProductPrice = Math.max(...prices, 0);
      setMaxPrice(Math.ceil(maxProductPrice));
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os produtos. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const filteredProducts = products
    .filter((product) => {
      const titleMatches = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatches = selectedCategory === '' || product.category === selectedCategory;
      const priceMatches = product.price * 5.5 <= maxPrice;
      return titleMatches && categoryMatches && priceMatches;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'rating-desc') {
        return (b.rating?.rate || 0) - (a.rating?.rate || 0);
      }
      return 0; 
    });

  if (loading) {
    return <Loader message="Carregando produtos de nossa vitrine..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  return (
    <div className="home-page-container container animate-fade-in">
      <section className="hero-section">
        <h1 className="hero-title">
          Estilo e Inovação para o seu <span className="hero-highlight">Dia a Dia</span>
        </h1>
        <p className="hero-subtitle">
          Explore nossa curadoria de produtos eletrônicos, jóias, e as últimas tendências em vestuário masculino e feminino.
        </p>
      </section>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Nossos Produtos</h2>
          <span className="results-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        <ProductGrid products={filteredProducts} />
      </section>
    </div>
  );
};

export default Home;
