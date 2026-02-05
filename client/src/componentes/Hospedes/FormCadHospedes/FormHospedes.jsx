import Alertas from "../../layout/Alertas";
import { useAlert } from "./hooks/useAlert";
import InformacoesPessoais from "./subcomponentes/InformacoesPessoais";
import Endereco from "./subcomponentes/Endereco";
import Adicionais from "./subcomponentes/Adicionais";

function FormHospede({ setFormData, formData, handleChange }) {
  const { alertProps, showAlert, closeAlert } = useAlert();

  return (
    <>
      <Alertas
        show={alertProps.show}
        variant={alertProps.variant}
        message={alertProps.message}
        onClose={closeAlert}
      />
      <InformacoesPessoais
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        showAlert={showAlert}
      />
      <Endereco
        formData={formData}
        handleChange={handleChange}
        showAlert={showAlert}
      />
      <Adicionais
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        showAlert={showAlert}
      />
    </>
  );
}

export default FormHospede;
