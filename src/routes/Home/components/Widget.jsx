import React from 'react';
import classNames from 'classnames';

import WidgetActions from 'actions/WidgetActions';
import { ActionMenu } from 'components/menu/DropdownMenu';


const Widget = ({ widgetInfo, settings, componentId, children, className, ...widgetProps }) => {
	return (
		<div 
			className={ classNames('card', className, componentId, widgetInfo.typeId) } 
			{ ...widgetProps }
		>
			<div className="content header-row">
			  <div className="header">
			  	<i className={ 'left floated large icon ' + widgetInfo.icon }/>
			    { settings.name }
			  </div>

				<ActionMenu 
					className="widget-menu right top pointing"
					actions={ WidgetActions }
					ids={ [ 'edit', 'remove' ] }
					itemData={{
						id: componentId,
						widgetInfo,
						settings,
					}}
				/>
			</div>
			<div className="content widget">
				{ widgetInfo.formSettings && !settings.widget ? 'Widget settings were not found' : children }
			</div>
		</div>
	);
};

Widget.propTypes = {
	widgetInfo: React.PropTypes.object.isRequired,

	settings: React.PropTypes.object.isRequired,

	componentId: React.PropTypes.string.isRequired,

	onEdit: React.PropTypes.func.isRequired,
};

export default Widget;