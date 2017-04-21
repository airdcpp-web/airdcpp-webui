import React from 'react';

import Icon from 'components/semantic/Icon';


const getCornerIcon = (installedPackage, hasUpdate) => {
	if (!installedPackage) {
		return null;
	}

	if (hasUpdate) {
		return 'yellow warning circle';
	}

	if (!installedPackage.managed) {
		return 'blue external square';
	}

	return 'green check circle';
};

const ExtensionIcon = ({ installedPackage, hasUpdate }) => (
	<div className="ui image">
		<Icon 
			icon="puzzle" 
			size="huge" 
			cornerIcon={ getCornerIcon(installedPackage, hasUpdate) }
		/>
	</div>
);

export default ExtensionIcon;