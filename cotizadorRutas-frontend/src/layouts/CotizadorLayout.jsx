import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Stepper from '../components/Stepper';

const CotizadorLayout = () => {
  const location = useLocation();
  const { idRuta } = location.state || {}; // Para obtener idRuta en la navegación

  const steps = ['Puntos y Ruta', 'Frecuencia', 'Vehículo', 'Recurso Humano', 'Resumen Final'];
  
  // Mapeo de rutas a los índices de los pasos
  const stepPaths = [
    '/',
    '/cotizador/frecuencia',
    '/cotizador/vehiculo',
    '/cotizador/recurso-humano',
    '/cotizador/configuracion-final'
  ];

  // Determina el paso actual
  let currentStep = stepPaths.findIndex(path => location.pathname.startsWith(path) && path !== '/');
  if (location.pathname === '/') currentStep = 0;


  // Genera las URLs para poder volver a los pasos completados
  const stepUrls = [
      '/',
      idRuta ? `/cotizador/frecuencia/${idRuta}` : '#',
      idRuta ? `/cotizador/vehiculo/${idRuta}` : '#',
      idRuta ? `/cotizador/recurso-humano/${idRuta}` : '#',
      '#' // El último paso no es navegable
  ];

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <Stepper steps={steps} currentStep={currentStep} stepUrls={stepUrls} />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default CotizadorLayout;