import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App';
import { AuthProvider } from './Context/authContext';

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
