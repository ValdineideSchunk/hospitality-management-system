import React, { useState, useEffect } from "react";
import { Button, Modal, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MenuLateral.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faCalendar,
  faUserGroup,
  faMap,
  faChevronRight,
  faRightFromBracket,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AtalhoRelatorios from "../../Relatorios/AtalhoRelatorios";

function MenuLateral() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Usuário");
  const [userCargo, setUserCargo] = useState("");
  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserCargo = localStorage.getItem("userCargo");

    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserCargo) {
      setUserCargo(storedUserCargo);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div
      className={`d-flex flex-column bg-white vh-100 ${
        isOpen ? "open-sidebar" : ""
      }`}
      id="sidebar"
      style={{ minWidth: isOpen ? "200px" : "60px", height: "100vh" }}
    >
      <div
        id="sidebar_content"
        className="flex-grow-1 d-flex flex-column m-0"
        style={{ backgroundColor: "#006bb4" }}
      >
        {/* Informações do usuário */}
        <div
          id="user"
          className="d-flex align-items-center justify-content-start text-center mb-5 mt-3 ms-3"
          title={userName}
        >
          <FontAwesomeIcon
            icon={faUser}
            style={{ fontSize: "25px", color: "#ffffff", paddingLeft: "10px" }}
          />
          <div
            id="user_infos"
            className="d-flex flex-column ms-0 align-items-start"
          >
            <span
              className="item-description text-white ms-0"
              style={{ fontSize: "12px" }}
            >
              {userName}
            </span>
          </div>
        </div>
        {/* Itens do menu */}
        <ul
          id="side_items"
          className="nav flex-column gap-2 flex-grow-1 align-items-start w-100"
        >
          <li className="nav-item side-item w-100">
            <Link
              to="/home"
              className="nav-link text-white d-flex align-items-center justify-content-start hover-effect w-100"
              title="Ir para a página inicial"
            >
              <FontAwesomeIcon
                icon={faHouse}
                style={{
                  fontSize: "25px",
                  color: "#ffffff",
                  paddingRight: "12px",
                }}
              />
              <span className="item-description text-white">Home</span>
            </Link>
          </li>
          <li className="nav-item side-item w-100">
            <Link
              to="/tabela_reserva"
              className="nav-link text-white d-flex align-items-center justify-content-start w-100"
              title="Reservas"
            >
              <FontAwesomeIcon
                icon={faCalendar}
                style={{
                  fontSize: "32px",
                  color: "#ffffff",
                  paddingRight: "12px",
                }}
              />
              <span className="item-description text-white">Reservas</span>
            </Link>
          </li>
          <li className="nav-item side-item w-100">
            <Link
              to="/tabela_hospedes"
              className="nav-link text-white d-flex align-items-center justify-content-start w-100"
              title="Hóspedes"
            >
              <FontAwesomeIcon
                icon={faUserGroup}
                style={{
                  fontSize: "25px",
                  color: "#ffffff",
                  paddingRight: "12px",
                }}
              />
              <span className="item-description text-white">Hóspedes</span>
            </Link>
          </li>
          <li className="nav-item side-item w-100">
            <Link
              to="/mapa_reservas"
              className="nav-link text-white d-flex align-items-center justify-content-start w-100"
              title="Mapa de Reservas"
            >
              <FontAwesomeIcon
                icon={faMap}
                style={{
                  fontSize: "25px",
                  color: "#ffffff",
                  paddingRight: "12px",
                }}
              />
              <span className="item-description text-white">Mapa</span>
            </Link>
          </li>

          {/* Link para ajustes, visível apenas para administradores */}
          {userCargo === "administrador" && (
            <li className="nav-item side-item w-100">
              <Link
                to="#"
                className="nav-link text-white d-flex align-items-center justify-content-start w-100"
                title="Recursos do Administrador"
                onClick={(e) => { e.preventDefault(); setMostrarAjustes(true); }}
              >
                <FontAwesomeIcon
                  icon={faGear}
                  style={{
                    fontSize: "32px",
                    color: "#ffffff",
                    paddingRight: "12px",
                  }}
                />
                <span className="item-description text-white">Admin</span>
              </Link>
            </li>
          )}

          <li className="nav-item side-item mt-auto w-100">
            <button
              className="nav-link text-white d-flex align-items-center justify-content-start w-100"
              title="Sair"
              onClick={() => setMostrarModalSair(true)}
              style={{ background: "none", border: "none" }}
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                style={{
                  fontSize: "25px",
                  color: "#ffffff",
                  paddingRight: "12px",
                }}
              />
              <span className="item-description text-white">Sair</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Modal de Logout */}
      <Modal
        show={mostrarModalSair}
        onHide={() => setMostrarModalSair(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja sair?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setMostrarModalSair(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Sair
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Ajustes */}
      <Modal
        show={mostrarAjustes}
        onHide={() => setMostrarAjustes(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Recursos do Administrador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col md={12} className="mb-3">
                <Link to="/cadastro_funcionario">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setMostrarAjustes(false)}
                  >
                    Cadastrar Funcionários
                  </Button>
                </Link>
              </Col>
              <Col md={12} className="mb-3">
                <Link to="/tabela_funcionarios">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setMostrarAjustes(false)}
                  >
                    Tabela Funcionários
                  </Button>
                </Link>
              </Col>
              <Col md={12} className="mb-3">
                <Link to="/cadastro_acomodacao">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setMostrarAjustes(false)}
                  >
                    Cadastrar Acomodações
                  </Button>
                </Link>
              </Col>
              <Col md={12} className="mb-3">
                <Link to="/listagem_acomodacoes">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setMostrarAjustes(false)}
                  >
                    Tabela Acomodações
                  </Button>
                </Link>
              </Col>
              <Col md={12} className="mb-3">
                <Link to="/atalhos_relatorios">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setMostrarAjustes(false)}
                  >
                    Relatório
                  </Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      {/* Botão para abrir/fechar o menu */}
      <button
        id="open_btn"
        className="btn btn-link text-white d-flex justify-content-center align-items-center p-2"
        onClick={toggleMenu}
        style={{
          position: "absolute",
          top: "10px",
          right: "-40px",
          backgroundColor: "#4f46e5",
          borderRadius: "30%",
          width: "50px",
          height: "50px",
          transition: "transform 0.3s",
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: "20px" }} />
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: "20px" }} />
      </button>
    </div>
  );
}

export default MenuLateral;
