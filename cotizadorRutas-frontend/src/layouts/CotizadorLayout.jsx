// ruta: src/layouts/CotizadorLayout.jsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Stepper, Container, Paper, Title, rem } from '@mantine/core';
import { FileText, Clock, Truck, User, Settings, Check } from 'lucide-react';

const CotizadorLayout = () => {
  const location = useLocation();
  
  const stepPaths = [
    '/',
    '/cotizador/frecuencia',
    '/cotizador/vehiculo',
    '/cotizador/recurso-humano',
    '/cotizador/configuracion-final'
  ];

  let active = stepPaths.findIndex(path => location.pathname.startsWith(path) && path !== '/');
  if (location.pathname === '/') active = 0;
  if (location.pathname.startsWith('/cotizador/configuracion-final')) active = 4;


  return (
    <Container size="xl" my="xl">
        <Title order={1} ta="center" mb="xl" c="deep-blue.7">
            Cotizador de Rutas Inteligente
        </Title>

        <Paper withBorder shadow="md" p="lg" mb="xl" radius="md">
             <Stepper active={active} color="cyan" iconSize={32}>
                <Stepper.Step 
                    icon={<FileText style={{ width: rem(18), height: rem(18) }} />} 
                    label="Paso 1" 
                    description="Definir Ruta" 
                />
                <Stepper.Step 
                    icon={<Clock style={{ width: rem(18), height: rem(18) }} />} 
                    label="Paso 2" 
                    description="Frecuencia" 
                />
                <Stepper.Step 
                    icon={<Truck style={{ width: rem(18), height: rem(18) }} />} 
                    label="Paso 3" 
                    description="Vehículo" 
                />
                <Stepper.Step 
                    icon={<User style={{ width: rem(18), height: rem(18) }} />} 
                    label="Paso 4" 
                    description="Recurso Humano" 
                />
                <Stepper.Step 
                    icon={<Settings style={{ width: rem(18), height: rem(18) }} />} 
                    label="Paso 5" 
                    description="Resumen Final" 
                />
                <Stepper.Completed>
                    <Check style={{ width: rem(18), height: rem(18) }} />
                </Stepper.Completed>
            </Stepper>
        </Paper>
      
      {/* Contenido de cada paso */}
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Outlet />
      </Paper>
    </Container>
  );
};

export default CotizadorLayout;