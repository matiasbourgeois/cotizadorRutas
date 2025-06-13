import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/botonesSistema.css';
import './styles/formularioSistema.css';
import './styles/tablasSistema.css';
import './styles/titulosSistema.css';
import './styles/Stepper.css'; // <-- AÑADIR NUEVO CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);