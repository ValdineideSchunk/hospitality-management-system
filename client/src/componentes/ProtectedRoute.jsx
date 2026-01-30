import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Aguarda o carregamento do estado de autenticação
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, renderiza o componente filho
  return children;
};

export default ProtectedRoute;
