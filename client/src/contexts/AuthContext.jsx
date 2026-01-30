import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    
    if (tokenSalvo) {
      try {
        const decoded = jwtDecode(tokenSalvo);
        
        // Verificar se o token não está expirado
        if (decoded.exp * 1000 > Date.now()) {
          setToken(tokenSalvo);
          setUsuario({
            id_funcionario: decoded.id_funcionario,
            nome_funcionario: decoded.nome_funcionario,
            cpf: decoded.cpf,
            cargo: decoded.cargo
          });
          axios.defaults.headers.common.Authorization = `Bearer ${tokenSalvo}`;
        } else {
          // Token expirado, remove
          localStorage.removeItem('token');
          delete axios.defaults.headers.common.Authorization;
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common.Authorization;
      }
    }
    
    setLoading(false);
  }, []);

  const login = (tokenRecebido, dadosUsuario) => {
    localStorage.setItem('token', tokenRecebido);
    setToken(tokenRecebido);
    setUsuario(dadosUsuario);
    axios.defaults.headers.common.Authorization = `Bearer ${tokenRecebido}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    delete axios.defaults.headers.common.Authorization;
    window.location.href = '/login';
  };

  const isAuthenticated = () => {
    return !!token && !!usuario;
  };

  const value = {
    usuario,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
