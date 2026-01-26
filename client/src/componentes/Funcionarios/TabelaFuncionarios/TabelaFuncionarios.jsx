import React, { useEffect, useState } from 'react';
import styles from './TabelaFuncionarios.module.css';
import { Link } from 'react-router-dom';

function TabelaFuncionarios() {
  // Estado para armazenar a lista de funcionários
  const [funcionarios, setFuncionarios] = useState([]);
  // Estado para controlar o loading de remoção
  const [removeLoading, setRemoveLoading] = useState(false);
  // Estado para armazenar o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState('');

  // useEffect para carregar os funcionários ao montar o componente
  useEffect(() => {
    setTimeout(() => {
      carregarFuncionarios();
    }, 300);
  }, []);

  // Função assíncrona para carregar a lista de funcionários da API
  async function carregarFuncionarios() {
    try {
      const resposta = await fetch('http://localhost:5000/funcionario', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!resposta.ok) {
        throw new Error('Erro ao buscar funcionários');
      }
      const consulta = await resposta.json();
      setFuncionarios(consulta);
      setRemoveLoading(true);
    } catch (error) {
    }
  }



  // Função para atualizar o estado de pesquisa
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFuncionarios = funcionarios.filter((funcionario) => {
    const nome = funcionario.nome_funcionario ? funcionario.nome_funcionario.toLowerCase() : '';
    return nome.includes(searchTerm.toLowerCase()) || funcionario.cpf.includes(searchTerm); });

    return (
      <div className="flex-grow-1 p-3">
        <h2 className="text-center">Lista de Funcionários</h2>
        <div className="d-flex mb-3 mx-auto" style={{ width: '40%', textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Pesquisar Funcionário por Nome ou CPF"
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control me-2"
            style={{ flex: '1' }}
          />
          <Link to="/cadastro_funcionario">
            <button className="btn btn-primary">Novo Funcionário</button>
          </Link>
        </div>
        {removeLoading && filteredFuncionarios.length === 0 && (
          <h1 className="mt-3 mx-auto" style={{ width: '50%', textAlign: 'center' }}>Não há funcionários disponíveis</h1>
        )}
        <div className={styles.Funcionarios}>
          <table className={`${styles.TabelaFuncionarios} table-bordered mt-3`}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Sexo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFuncionarios.map((funcionario) => (
                <tr key={funcionario.id_funcionario}>
                  <td>{funcionario.nome_funcionario}</td>
                  <td>{funcionario.cpf}</td>
                  <td>{funcionario.telefone}</td>
                  <td>{funcionario.sexo}</td>
                  <td className="bg-light">
                    <Link className="btn btn-primary btn-sm" to={`/editar_funcionario/${funcionario.id_funcionario}`}>Editar</Link>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

export default TabelaFuncionarios;
