import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const ModalCrearRecursoHumano = ({ show, onHide, onCrear }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    tipoContratacion: "empleado",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCrear(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton className="modal-header-sda">
        <Modal.Title className="titulo-modal-sda">Nuevo Recurso Humano</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body className="modal-body-sda">
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de contratación</label>
            <select
              name="tipoContratacion"
              value={formData.tipoContratacion}
              onChange={handleChange}
              className="form-select"
            >
              <option value="empleado">Empleado</option>
              <option value="contratado">Contratado</option>
            </select>
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-sda">
          <button type="button" className="btn-sistema btn-sda-secundario" onClick={onHide}>
            Cancelar
          </button>
          <button type="submit" className="btn-sistema btn-sda-principal">
            Crear
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalCrearRecursoHumano;
