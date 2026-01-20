import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

function Alertas({
  show = false, // Valor padrão
  variant = 'primary', // Valor padrão
  message = '', // Valor padrão
  onClose = null, // Valor padrão
  duration = null, // Valor padrão
}) {
  // Gerencia o fechamento automático
  useEffect(() => {
    if (show && duration) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer); // Limpa o timer quando o componente for desmontado
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <Alert
      variant={variant}
      style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        zIndex: 10,
      }}
      onClose={onClose}
      dismissible={!!onClose}
    >
      {message}
    </Alert>
  );
}

Alertas.propTypes = {
  show: PropTypes.bool.isRequired,
  variant: PropTypes.string,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  duration: PropTypes.number, // Tempo de exibição em milissegundos
};

export default Alertas;
