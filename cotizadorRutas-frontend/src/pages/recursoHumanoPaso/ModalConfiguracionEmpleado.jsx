import { useEffect, useState } from "react";
import { Modal, Button, Form, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import "../../styles/formularioSistema.css";
import "../../styles/botonesSistema.css";

const ModalConfiguracionEmpleado = ({
  show,
  onClose,
  recursoHumano,
  onGuardarCambios,
  tipoContratacion,
}) => {
  const [formData, setFormData] = useState({});
  const [cambios, setCambios] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    if (recursoHumano) {
      setFormData({ ...recursoHumano });
      setCambios(false);
    }
  }, [recursoHumano]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    setCambios(true);
  };

const handleGuardar = async () => {
  try {
    const res = await axios.put(
      `http://localhost:5010/api/recursos-humanos/${formData._id}`,
      formData
    );
    onGuardarCambios(res.data);  // se pasa la versión actualizada
    setCambios(false);
    onClose();
  } catch (error) {
    console.error("❌ Error al guardar cambios:", error);
    alert("Ocurrió un error al guardar los cambios.");
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
        value={formData[name] ?? ""}
        placeholder={`Valor actual: ${recursoHumano[name] ?? "(sin definir)"}`}
        onChange={handleChange}
      />
      {unidad && <small className="text-muted">{unidad}</small>}
    </Form.Group>
  );

  if (!recursoHumano) return null;

  return (
    <>
      <Modal show={show} onHide={handleCerrar} size="xl" backdrop="static" centered>
        <Modal.Header closeButton className="modal-header-sda">
          <Modal.Title className="modal-title-sda">
            Configuración Avanzada – {recursoHumano.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="formulario-sda">
            <Card className="mb-4">
              <Card.Body>
                <Card.Title className="text-muted text-uppercase fw-bold mb-3">💰 Parámetros Económicos</Card.Title>
                <Row>
                  {campo("Sueldo Básico", "sueldoBasico", "$ ARS")}
                  {campo("% Adicional por Actividad", "adicionalActividadPorc", "%")}
                  {campo("Adicional por Km Remunerativo", "adicionalKmRemunerativo", "$ por km")}
                  {campo("Mínimo Km Remunerativo por viaje", "minKmRemunerativo", "km")}
                  {campo("Viático por Km No Remunerativo", "viaticoPorKmNoRemunerativo", "$ por km")}
                  {campo("Mínimo Km No Remunerativo por viaje", "minKmNoRemunerativo", "km")}
                  {campo("Adicional No Remunerativo Fijo", "adicionalNoRemunerativoFijo", "$ ARS")}
                  {campo("Adicional Carga/Descarga cada X km", "adicionalCargaDescargaCadaXkm", "$ ARS")}
                  {campo("Km por unidad de Carga/Descarga", "kmPorUnidadDeCarga", "km")}
                </Row>
              </Card.Body>
            </Card>

            {tipoContratacion === "empleado" && (
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title className="text-muted text-uppercase fw-bold mb-3">🧾 Solo para Empleados</Card.Title>
                  <Row>
                    {campo("% Cargas Sociales", "porcentajeCargasSociales", "%")}
                  </Row>
                </Card.Body>
              </Card>
            )}

            {tipoContratacion === "contratado" && (
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title className="text-muted text-uppercase fw-bold mb-3">📦 Solo para Contratados</Card.Title>
                  <Row>
                    {campo("% Overhead (Monotributo, Seguro, Bonificaciones)", "porcentajeOverheadContratado", "%")}
                  </Row>
                </Card.Body>
              </Card>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">📝 Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observaciones"
                value={formData.observaciones || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, observaciones: e.target.value }))
                }
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

export default ModalConfiguracionEmpleado;
