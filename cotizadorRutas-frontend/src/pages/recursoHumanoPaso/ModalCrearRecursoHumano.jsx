import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";

const ModalCrearRecursoHumano = ({ show, onHide, onCrear }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    tipoContratacion: "empleado",
  });
  const [estaGuardando, setEstaGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (estaGuardando) return;

    setEstaGuardando(true);
    try {
      // ✅ Hacemos la llamada POST al backend para crear el recurso
      const res = await axios.post("http://localhost:5010/api/recursos-humanos", formData);
      
      // ✅ Pasamos el recurso recién creado (con su _id) al componente padre
      onCrear(res.data);
      
      // Limpiar y cerrar el modal
      setFormData({
        nombre: "",
        dni: "",
        telefono: "",
        email: "",
        tipoContratacion: "empleado",
      });
      onHide();

    } catch (error) {
      console.error("❌ Error al crear recurso humano:", error);
      alert("Error al crear el recurso. Verifique los datos o la conexión con el servidor.");
    } finally {
      setEstaGuardando(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton className="modal-header-sda">
        <Modal.Title className="modal-title-sda">Nuevo Recurso Humano</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label fw-bold">Nombre completo</label>
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
            <label className="form-label fw-bold">DNI</label>
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
            <label className="form-label fw-bold">Tipo de contratación</label>
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

        <Modal.Footer>
          <button type="button" className="btn-soft-cancelar" onClick={onHide} disabled={estaGuardando}>
            Cancelar
          </button>
          <button type="submit" className="btn-soft-confirmar" disabled={estaGuardando}>
            {estaGuardando ? "Guardando..." : "Crear Recurso"}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalCrearRecursoHumano;