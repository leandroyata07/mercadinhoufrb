const BASE_URL = 'https://fakestoreapi.com';

export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Falha ao carregar produtos');
  }
  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Falha ao carregar o produto com ID: ${id}`);
  }
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error('Falha ao carregar categorias');
  }
  return response.json();
};
