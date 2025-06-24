// ruta: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
// ✅ 1. Importa ModalsProvider
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { AuthProvider } from './context/AuthContext.jsx';
import { CotizacionProvider } from './context/Cotizacion.jsx';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

// Definimos nuestro tema personalizado
const theme = createTheme({
  fontFamily: 'Montserrat, sans-serif',
  primaryColor: 'cyan', // Un color primario moderno
  colors: {
    // Definimos una paleta de colores personalizada
    'ocean-blue': [
      '#7AD1DD', '#5FCCDB', '#44CADC', '#2AC9DE', '#1AC2D9', 
      '#11B7CD', '#09ADC3', '#0E99AC', '#128797', '#147885'
    ],
    'deep-blue': [
      '#E9EDF5', '#C5D1E8', '#A2B5DA', '#7F99CC', '#5C7CBC', 
      '#4B69B1', '#3A56A5', '#2A439A', '#19308E', '#081D83'
    ],
  },
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme}>
        {/* ✅ 2. Envuelve la app con ModalsProvider */}
        <ModalsProvider>
          <AuthProvider>
            <CotizacionProvider>
              <Notifications position="top-right" />
              <App />
            </CotizacionProvider>
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);