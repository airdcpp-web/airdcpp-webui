import React from 'react';


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