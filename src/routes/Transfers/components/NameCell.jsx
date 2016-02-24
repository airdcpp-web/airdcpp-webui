import React from 'react';

import { FileNameFormatter } from 'utils/IconFormat';
import Popup from 'components/semantic/Popup';


const NameCaption = ({ cellData, rowData }) => (
	<Popup 
		triggerClassName="name" 
		className="basic target" 
		trigger={ cellData }
	>
		<div>{ rowData.target }</div>
	</Popup>
);

const NameCell = ({ cellData, rowData, ...props }) => {
	if (!cellData) {
		return <span/>;
	}

	return (
		<FileNameFormatter 
			typeInfo={ rowData.type }
			caption={ <NameCaption cellData={ cellData } rowData={ rowData }/> }
		/>
	);
};

export default NameCell;