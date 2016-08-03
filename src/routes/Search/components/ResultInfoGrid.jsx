import React from 'react';

import SearchActions from 'actions/SearchActions';
import ValueFormat from 'utils/ValueFormat';

import { DownloadMenu } from 'components/menu/DropdownMenu';


const formatText = (text) => text ? text : '(unknown)';

const GridRow = ({ title, text }) => (
	<div className="ui row">
		<div className="three wide column">
			<div className="ui tiny header">
			{ title }
			</div>
		</div>
		<div className="twelve wide column">
			{ formatText(text) }
		</div>
	</div>
);

const ResultInfoGrid = ({ parentResult }) => (
	<div className="ui segment">
		<div className="ui grid two column">
			<GridRow title="Content/Type" text={ parentResult.type.str }/>
			<GridRow title="Size" text={ ValueFormat.formatSize(parentResult.size) }/>
			<GridRow title="Last modified" text={ ValueFormat.formatRelativeTime(parentResult.time) }/>
			{ parentResult.type.id === 'file' ? <GridRow title="TTH" text={ parentResult.tth }/> : null }
		</div>

		<DownloadMenu 
			caption="Actions..."
			button={ true }
			user={ parentResult.users.user }
			itemInfo={ parentResult }
			handler={ SearchActions.download } 
		/>
	</div>
);

export default ResultInfoGrid;