import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/formularioSistema.css";
import "../../styles/botonesSistema.css";

const ModalCrearVehiculo = ({ show, onClose, onVehiculoCreado }) => {
  const [formData, setFormData] = useState({
    tipoVehiculo: "utilitario",
    patente: "",
    marca: "",
    modelo: "",
    año: new Date(),
    tipoCombustible: "nafta",
    tieneGNC: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataEnviar = {
        ...formData,
        año: formData.año.getFullYear()
      };
      const res = await axios.post("http://localhost:5010/api/vehiculos", dataEnviar);
      onVehiculoCreado(res.data);
      onClose();
    } catch (error) {
      console.error("❌ Error al crear vehículo:", error);
      alert("Error al crear vehículo. Ver consola.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton className="modal-header-sda">
        <Modal.Title className="modal-title-sda">Agregar Nuevo Vehículo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="formulario-sda">
          <Form.Group className="mb-3">
            <Form.Label>Tipo de vehículo</Form.Label>
            <Form.Select name="tipoVehiculo" value={formData.tipoVehiculo} onChange={handleChange} required>
              <option value="utilitario">Utilitario</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
              <option value="camion">Camión</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Patente</Form.Label>
            <Form.Control type="text" name="patente" value={formData.patente} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Marca</Form.Label>
            <Form.Control type="text" name="marca" value={formData.marca} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Modelo</Form.Label>
            <Form.Control type="text" name="modelo" value={formData.modelo} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Año</Form.Label><br />
            <DatePicker
              selected={formData.año}
              onChange={(date) => setFormData({ ...formData, año: date })}
              showYearPicker
              dateFormat="yyyy"
              className="form-control"
              placeholderText="Seleccionar año"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de combustible</Form.Label>
            <Form.Select name="tipoCombustible" value={formData.tipoCombustible} onChange={handleChange} required>
              <option value="nafta">Nafta</option>
              <option value="gasoil">Gasoil</option>
            </Form.Select>
          </Form.Group>

          {formData.tipoCombustible === "nafta" && (
            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                name="tieneGNC"
                label="¿Tiene GNC?"
                checked={formData.tieneGNC}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <div className="d-flex justify-content-end mt-3">
            <button type="button" className="btn-soft me-2" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-sistema btn-sda-principal">
              Crear Vehículo
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCrearVehiculo;
