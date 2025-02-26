import '@/utils/webpack';

import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('container-main')!);
root.render(<App />);

// https://github.com/GoogleChrome/workbox/issues/1790
if (process.env.NODE_ENV !== 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(`${getBasePath()}${process.env.SERVICEWORKER}`)
    .then((sw) => {
      console.log('Service Worker Registered');
    });
}
