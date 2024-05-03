import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // Correction du plugin React
import path from 'path'; // Import de path pour utiliser path.resolve

// Configuration de Vite
export default defineConfig({
  plugins: [react()], // Utilisation du plugin React
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Configuration de l'alias pour résoudre vers le répertoire src
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080'
      }
    }
  }
});
