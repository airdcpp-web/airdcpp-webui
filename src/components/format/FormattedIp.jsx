import PropTypes from 'prop-types';
import React from 'react';

import 'semantic-ui/components/flag.min.css';


const IpFormatter = ({ item }) => (
	<div className="ip flag">
		<i className={ 'ui flag ' + item.country.toLowerCase() }/>
		{ item.str }
	</div>
);

IpFormatter.propTypes = {
	item: PropTypes.object.isRequired,
};

export default IpFormatter;