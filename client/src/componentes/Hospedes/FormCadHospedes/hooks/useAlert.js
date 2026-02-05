import { useState } from "react";

/**
 * Hook reutilizável para gerenciar alertas com fechamento automático
 * @returns {Object} - { alertProps, showAlert }
 */
export const useAlert = () => {
  const [alertProps, setAlertProps] = useState({
    show: false,
    message: "",
    variant: "danger",
  });

  const showAlert = (message, variant = "danger") => {
    setAlertProps({ show: true, message, variant });
    setTimeout(() => setAlertProps((prev) => ({ ...prev, show: false })), 5000);
  };

  const closeAlert = () => {
    setAlertProps((prev) => ({ ...prev, show: false }));
  };

  return { alertProps, showAlert, closeAlert };
};
