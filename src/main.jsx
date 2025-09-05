import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AlertProvider } from './context/AlertContext.jsx';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookiesProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </CookiesProvider>
  </StrictMode>,
);
