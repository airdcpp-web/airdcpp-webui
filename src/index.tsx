// import 'utils/webpack';

import ReactDOM from 'react-dom';
import App from './App';



// Wrapper for hot reloading
//import { hot } from 'react-hot-loader';

//const HMRApp = hot(module)(App);

//ReactDOM.render(<HMRApp/>, document.getElementById('container-main'));



ReactDOM.render(<App/>, document.getElementById('container-main'));

/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(`${getBasePath()}${process.env.SERVICEWORKER}`)
    .then(sw => { 
      console.log('Service Worker Registered'); 
    });
}*/

/*const render = (Component: React.ComponentType) => {
  ReactDOM.render(<Component/>, document.getElementById('container-main'));
};

render(App);

if ((module as any).hot) {
  (module as any).hot.accept('./App', () => { 
    render(App);
  });
}*/
