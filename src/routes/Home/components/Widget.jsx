import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import LoginStore from 'stores/LoginStore';

import { ActionMenu } from 'components/menu/DropdownMenu';
import WidgetActions from 'actions/WidgetActions';


const getError = (widgetInfo, settings) => {
	if (widgetInfo.formSettings && !settings.widget) {
		return 'Widget settings were not found';
	}

	if (widgetInfo.access && !LoginStore.hasAccess(widgetInfo.access)) {
		return "You aren't permitted to access this widget";
	}

	return null;
};

const Widget = ({ widgetInfo, settings, componentId, children, className, ...widgetProps }) => {
	const error = getError(widgetInfo, settings);
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
					itemData={{
						id: componentId,
						widgetInfo,
						settings,
					}}
				>
					{ !!widgetInfo.actionMenu && <ActionMenu { ...widgetInfo.actionMenu }/> }
				</ActionMenu>
			</div>
			<div className="content widget">
				{ error ? error : children }
			</div>
		</div>
	);
};

Widget.propTypes = {
	widgetInfo: PropTypes.object.isRequired,

	settings: PropTypes.object.isRequired,

	componentId: PropTypes.string.isRequired,
};

export default Widget;