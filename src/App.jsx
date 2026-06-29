import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider';


import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';


import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Vendas from './pages/Vendas/Vendas';
import Cadastros from './pages/Cadastros/Cadastros';
import Compras from './pages/Compras/Compras';
import Estoque from './pages/Estoque/Estoque';
import Despesas from './pages/Despesas/Despesas';
import Financeiro from './pages/Financeiro/Financeiro';
import Relatorios from './pages/Relatorios/Relatorios';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import NotFound from './pages/NotFound/NotFound';

import './App.css';


const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-container">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};


const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <ThemeProvider>
          <Router basename={import.meta.env.BASE_URL}>
            <Routes>
              {}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {}
              <Route
                path="/dashboard"
                element={
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/vendas"
                element={
                  <ProtectedLayout>
                    <Vendas />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/cadastros"
                element={
                  <ProtectedLayout>
                    <Cadastros />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/compras"
                element={
                  <ProtectedLayout>
                    <Compras />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/estoque"
                element={
                  <ProtectedLayout>
                    <Estoque />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/despesas"
                element={
                  <ProtectedLayout>
                    <Despesas />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/financeiro"
                element={
                  <ProtectedLayout>
                    <Financeiro />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/relatorios"
                element={
                  <ProtectedLayout>
                    <Relatorios />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <ProtectedLayout>
                    <Configuracoes />
                  </ProtectedLayout>
                }
              />

              {}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
