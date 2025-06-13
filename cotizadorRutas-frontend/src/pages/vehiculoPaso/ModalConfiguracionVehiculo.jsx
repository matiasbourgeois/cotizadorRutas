import { useEffect, useState } from "react";
import { Modal, Button, Form, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import "../../styles/formularioSistema.css";
import "../../styles/botonesSistema.css";

const ModalConfiguracionVehiculo = ({ show, onClose, vehiculo, onGuardarCambios }) => {
  const [formData, setFormData] = useState({});
  const [cambios, setCambios] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    if (vehiculo) {
      setFormData({ ...vehiculo });
      setCambios(false);
    }
  }, [vehiculo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setCambios(true);
  };

const handleGuardar = async () => {
  try {
    const vehiculoActualizado = { ...formData };

    // Enviar al backend
    await axios.put(`http://localhost:5010/api/vehiculos/${vehiculo._id}`, vehiculoActualizado);

    // Actualizar también en el frontend
    onGuardarCambios({ ...vehiculo, ...vehiculoActualizado });

    setCambios(false);
    onClose();
  } catch (error) {
    console.error("❌ Error al guardar cambios:", error);
    alert("Hubo un error al guardar los cambios.");
  }
};


  const handleCerrar = () => {
    if (cambios) {
      setMostrarConfirmacion(true);
    } else {
      onClose();
    }
  };

  const confirmarCerrar = () => {
    setMostrarConfirmacion(false);
    setCambios(false);
    onClose();
  };

  const cancelarCerrar = () => {
    setMostrarConfirmacion(false);
  };

  const campo = (label, name, unidad = "") => (
    <Form.Group as={Col} xs={12} sm={6} md={4} className="mb-3">
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <Form.Control
        type="number"
        name={name}
        value={formData[name] || ""}
        placeholder={`Valor actual: ${vehiculo[name] ?? "(sin definir)"}`}
        onChange={handleChange}
      />
      {unidad && <small className="text-muted">{unidad}</small>}
    </Form.Group>
  );

  if (!vehiculo) return null;

  return (
    <>
      <Modal show={show} onHide={handleCerrar} size="xl" backdrop="static" centered>
        <Modal.Header closeButton className="modal-header-sda">
          <Modal.Title className="modal-title-sda">
            Configuración Avanzada – {vehiculo.marca} {vehiculo.modelo} ({vehiculo.patente})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="formulario-sda">
            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="text-muted text-uppercase fw-bold mb-3">⚙️ Configuración técnica</Card.Title>
                <Row>
                  {campo("Rendimiento (km/l)", "rendimientoKmLitro", "km/l")}
                  {campo("Capacidad de carga", "capacidadKg", "kg")}
                  {campo("Volumen útil", "volumenM3", "m³")}
                  {campo("Cubiertas", "cantidadCubiertas", "unidades")}
                  {campo("Precio por cubierta", "precioCubierta", "$ ARS")}
                  {campo("Cambio de aceite", "precioCambioAceite", "$ ARS")}
                  {campo("Precio litro combustible", "precioLitroCombustible", "$ ARS")}
                  {campo("Precio GNC", "precioGNC", "$ ARS")}
                  {campo("Precio de compra Vehiculo nuevo", "precioVehiculoNuevo", "$ ARS")}
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="text-muted text-uppercase fw-bold mb-3">📦 Costos fijos mensuales</Card.Title>
                <Row>
                  {campo("Costo mantenimiento preventivo", "costoMantenimientoPreventivoMensual", "$ARS (mensual)")}
                  {campo("Costo seguro Vehiculo mensual", "costoSeguroMensual", "$ ARS")}
                  {campo("Costo patente – Municipalidad", "costoPatenteMunicipal", "$ ARS")}
                  {campo("Costo patente – Provincia", "costoPatenteProvincial", "$ ARS")}
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="text-muted text-uppercase fw-bold mb-3">🧮 Parámetros de desgaste</Card.Title>
                <Row>
                  {campo("Km vida útil del vehículo", "kmsVidaUtilVehiculo", "km")}
                  {campo("Valor residual (%)", "valorResidualPorcentaje", "%")}
                  {campo("Km vida útil de las cubiertas", "kmsVidaUtilCubiertas", "km")}
                  {campo("Km entre cambios de aceite", "kmsCambioAceite", "km")}
                </Row>
              </Card.Body>
            </Card>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">📝 Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observaciones"
                value={formData.observaciones || ""}
                onChange={handleChange}
                placeholder="Texto libre"
              />
            </Form.Group>
          </Form>

          <div className="d-flex justify-content-end mt-4">
            <button className="btn-soft me-2" onClick={handleCerrar}>Cancelar</button>
            <button className="btn-sistema btn-sda-principal" onClick={handleGuardar}>Guardar Cambios</button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación */}
      <Modal show={mostrarConfirmacion} onHide={cancelarCerrar} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Desea cerrar sin guardar?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Hay cambios no guardados. ¿Está seguro que desea cerrar el formulario sin guardar?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelarCerrar}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarCerrar}>Cerrar sin guardar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalConfiguracionVehiculo;
