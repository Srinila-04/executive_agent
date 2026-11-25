import net from 'node:net';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    const done = (ok) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(150);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

async function resolveBackendTarget() {
  if (process.env.VITE_BACKEND_URL) return process.env.VITE_BACKEND_URL;
  if (process.env.VITE_API_BASE_URL) return process.env.VITE_API_BASE_URL;
  if (await isPortOpen(5000)) return 'http://127.0.0.1:5000';
  if (await isPortOpen(8000)) return 'http://127.0.0.1:8000';
  return 'http://127.0.0.1:5000';
}

export default defineConfig(async () => {
  const apiTarget = await resolveBackendTarget();
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true
        }
      }
    }
  };
});
