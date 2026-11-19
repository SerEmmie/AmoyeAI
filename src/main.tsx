import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find #root mount element.');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Fatal mount error:', error);
  const message = error instanceof Error ? error.message : String(error);
  rootElement.innerHTML = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:64px auto;padding:24px;border:1px solid #d8cde5;border-radius:12px;background:#fff;color:#1d122b;">
      <h1 style="margin:0 0 8px;font-size:20px;color:#291044;">Unable to load Amoye AI</h1>
      <p style="margin:0;font-size:14px;line-height:1.5;color:#4b3d5c;">${message.replace(/[<>&]/g, '')}</p>
    </div>
  `;
}
