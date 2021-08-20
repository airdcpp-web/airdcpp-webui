import 'utils/webpack';

import ReactDOM from 'react-dom';
import App from './App';


ReactDOM.render(<App/>, document.getElementById('container-main'));

// https://github.com/GoogleChrome/workbox/issues/1790
if (process.env.NODE_ENV !== 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(`${getBasePath()}${process.env.SERVICEWORKER}`)
    .then(sw => { 
      console.log('Service Worker Registered'); 
    });
}
