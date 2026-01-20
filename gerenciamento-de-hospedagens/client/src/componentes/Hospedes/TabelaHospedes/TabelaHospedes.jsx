import React, { useEffect, useState } from 'react';
import styles from './TabelaHospede.module.css';
import { Link, useNavigate } from 'react-router-dom';

function TabelaHospede({ exibirAcoes = true, textoBotao = "Editar", onSelectHospede }) {
  const [hospedes, setHospedes] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      carregarHospedes();
    }, 300);
  }, []);

  async function carregarHospedes() {
    try {
      const resposta = await fetch('http://localhost:5000/hospede', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!resposta.ok) {
        throw new Error('Erro ao buscar Hóspedes');
      }
      const consulta = await resposta.json();
      console.log("Dados recebidos do frontend: ", consulta);
      setHospedes(consulta);
      setRemoveLoading(true);
    } catch (error) {
      console.log('erro ao buscar Hóspedes', error);
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredHospedes = hospedes.filter((hospede) =>
    hospede.nome_hospede?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospede.cpf?.toString().includes(searchTerm)
  );

  return (
    <div style={{ height: '99vh', overflowY: 'auto', padding: '1%', boxSizing: 'border-box' }}>
      <div className="d-flex">
        <div className="flex-grow-1 p-3">
          <h2 className="text-center">Lista de Hóspedes</h2>

          <div className="d-flex mb-3 mx-auto" style={{ width: '40%', textAlign: 'center' }}>
            <input
              type="text"
              placeholder="Pesquisar Hóspede por Nome ou CPF"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control me-2"
              style={{ flex: '1' }}
            />
            <Link to="/cadastro_hospede">
              <button className="btn btn-primary">Novo Hóspede</button>
            </Link>
          </div>

          {removeLoading && filteredHospedes.length === 0 && (
            <h1 className="mt-3 mx-auto" style={{ width: '50%', textAlign: 'center' }}>
              Não há hóspedes disponíveis
            </h1>
          )}

          <div className={styles.Hospedes}>
            <table className={`${styles.TabelaHospedes} table-bordered mt-3`}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>Sexo</th>
                  {exibirAcoes && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filteredHospedes.map((hospede) => (
                  <tr key={hospede.id_hospede}>
                    <td>{hospede.nome_hospede}</td>
                    <td>{hospede.cpf}</td>
                    <td>{hospede.celular}</td>
                    <td>{hospede.sexo}</td>
                    {exibirAcoes && (
                      <td className="bg-light">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            if (textoBotao === 'Selecionar') {
                              onSelectHospede(hospede);
                            } else if (textoBotao === 'Editar') {
                              navigate(`/editar_hospede/${hospede.id_hospede}`);
                            }
                          }}
                        >
                          {textoBotao}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabelaHospede;
