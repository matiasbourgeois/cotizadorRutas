import { Link } from 'react-router-dom';
import { ActionIcon, Tooltip } from '@mantine/core';
import { FileText, Clock, Truck, User, Settings, Check, RotateCcw } from 'lucide-react';
import '../styles/CotizadorStepper.css';

const stepConfig = [
  { label: 'Definir Ruta', icon: FileText, id: 'ruta' },
  { label: 'Frecuencia', icon: Clock, id: 'frecuencia' },
  { label: 'Vehículo', icon: Truck, id: 'vehiculo' },
  { label: 'Recurso Humano', icon: User, id: 'recurso' },
  { label: 'Resumen', icon: Settings, id: 'final' },
];

const CotizadorStepper = ({ activeIndex, idRuta, onReset }) => {
  const paths = [
    '/cotizador',
    `/cotizador/frecuencia/${idRuta}`,
    `/cotizador/vehiculo/${idRuta}`,
    `/cotizador/recurso-humano/${idRuta}`,
    '/cotizador/configuracion-final',
  ];

  return (
    <div className="stepper-bar">
      {stepConfig.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const isFuture = index > activeIndex;
        const isLinkDisabled = !idRuta && index > 0 && index < 4;
        const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'future';
        const StepIcon = step.icon;

        const stepContent = (
          <>
            <div className="stepper-icon">
              {isCompleted ? <Check size={16} strokeWidth={3} /> : <StepIcon size={16} />}
            </div>
            <span className="stepper-label">{step.label}</span>
          </>
        );

        return (
          <span key={step.id} style={{ display: 'contents' }}>
            {/* Connector line (before each step except the first) */}
            {index > 0 && (
              <div
                className={`stepper-connector ${
                  index <= activeIndex
                    ? index === activeIndex
                      ? 'active'
                      : 'completed'
                    : ''
                }`}
              />
            )}

            {/* Step */}
            {isCompleted && !isLinkDisabled ? (
              <Link
                to={paths[index]}
                className={`stepper-step ${statusClass} clickable`}
              >
                {stepContent}
              </Link>
            ) : (
              <div
                className={`stepper-step ${statusClass}${isActive ? ' clickable' : ''}`}
                style={{ pointerEvents: isFuture && isLinkDisabled ? 'none' : 'auto' }}
              >
                {stepContent}
              </div>
            )}
          </span>
        );
      })}

      {/* Reiniciar */}
      <div className="stepper-reset-btn">
        <Tooltip label="Reiniciar Cotización" position="bottom">
          <ActionIcon
            variant="light"
            color="orange"
            size="md"
            radius="md"
            onClick={onReset}
          >
            <RotateCcw size={14} />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
};

export default CotizadorStepper;
