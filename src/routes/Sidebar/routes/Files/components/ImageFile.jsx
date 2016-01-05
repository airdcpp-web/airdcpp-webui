'use strict';
import React from 'react';

import LoginStore from 'stores/LoginStore';


const getUri = (tth) => {
	return '/view/' + tth + '?auth=' + LoginStore.token; 
};

const ImageFile = ({ item }) => {
	return (
		<img src={ getUri(item.tth) }/>
	);
};

export default ImageFile;