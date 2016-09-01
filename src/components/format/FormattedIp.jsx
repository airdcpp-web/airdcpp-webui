import React from 'react';

import 'semantic-ui/components/flag.min.css';


const IpFormatter = ({ item }) => (
	<div className="ip flag">
		<i className={ 'ui flag ' + item.country_id.toLowerCase() }/>
		{ item.str }
	</div>
);

IpFormatter.propTypes = {
	item: React.PropTypes.object.isRequired,
};

export default IpFormatter;