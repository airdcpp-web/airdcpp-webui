import React from 'react';

import Popup from 'components/semantic/Popup';


const TriggerIcon = React.createClass({
	render() {
		if (this.props.trusted) {
			return <i onClick={ this.props.onClick } className="green lock link icon"/>;
		}

		return (
			<i onClick={ this.props.onClick } className="link icon icons">
				<i className="yellow lock icon"/>
				<i className="blue help corner icon"/>
			</i>
		);
	}
});

const InfoMessage = ({ encryption }) => (
	<div>
		<p>
			{ encryption.str }
		</p>
		<p style={ { color: encryption.trusted ? 'green' : 'orange' } }>
			{ encryption.trusted ? 'Authenticity of the certificate is validated' : 'Authenticity of the certificate could not be validated' }
		</p>
	</div>
);

const EncryptionState = ({ encryption, alwaysVisible }) => {
	if (!encryption) {
		return alwaysVisible ? <i className="grey lock icon"/> : <span/>;
	}

	return (
		<Popup 
			triggerClassName="encryption" 
			className="basic encryption content" 
			trigger={ <TriggerIcon trusted={ encryption.trusted }/> }
		>
			<InfoMessage encryption={ encryption }/>
		</Popup>
	);
};

export default EncryptionState;