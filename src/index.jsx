import 'utils/webpack';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


// Wrapper for hot reloading

ReactDOM.render(
	<App/>,
	document.getElementById('container-main')
);

if (module.hot) {
	module.hot.accept();
}
