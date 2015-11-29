import React from 'react';

import ShareActions from 'actions/ShareActions';
import { RefreshStateEnum } from 'constants/ShareRootConstants';
import ValueFormat from 'utils/ValueFormat';

const RefreshCell = React.createClass({
	onClickRefresh() {
		ShareActions.refreshPaths([ this.props.rowData.path ]);
	},

	render: function () {
		const state = this.props.rowData.refresh_state;
		if (state.id === RefreshStateEnum.STATE_NORMAL) {
			return (
				<div>
					<i className={ 'icon large link green refresh' } onClick={ this.onClickRefresh }/>
					{ ValueFormat.formatRelativeTime(this.props.cellData) }
				</div>
			);
		}

		return (
			<div>
				<div className="ui active inline small loader"></div>
				{ state.str }
			</div>
		);
	}
});

export default RefreshCell;