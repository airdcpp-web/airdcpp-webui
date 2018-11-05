import 'utils/webpack';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';



// Wrapper for hot reloading
//import { hot } from 'react-hot-loader';

//const HMRApp = hot(module)(App);

//ReactDOM.render(<HMRApp/>, document.getElementById('container-main'));



ReactDOM.render(<App/>, document.getElementById('container-main'));

/*const render = (Component: React.ComponentType) => {
  ReactDOM.render(<Component/>, document.getElementById('container-main'));
};

render(App);

if ((module as any).hot) {
  (module as any).hot.accept('./App', () => { 
    render(App);
  });
}*/
