import NotificationActions from 'actions/NotificationActions';

// The webpack path must be set before loading any styles
// Since common styles are imported in the main entry, this must be done in a separate import
// https://github.com/webpack/css-loader/issues/155
__webpack_public_path__ = getBasePath();

// Override the default onError function
__webpack_require__.oe = (err) => { 
	NotificationActions.error({ 
		title: err,
		message: 'Try reloading the page if you have updated the UI recently',
	});
};


// We must export something or this module gets stripped
export default __webpack_public_path__;
