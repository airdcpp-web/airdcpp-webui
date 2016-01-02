import React from 'react';

import ShareActions from 'actions/ShareActions';
import { RefreshStateEnum } from 'constants/ShareRootConstants';
import ValueFormat from 'utils/ValueFormat';
import Loader from 'components/semantic/Loader';

const RefreshCell = React.createClass({
	componentDidMount() {
		this.scheduleComponentRefresh();
	},

	componentWillUnmount() {
		clearTimeout(this.fetchTimeout);
	},

	scheduleComponentRefresh() {
		// Update once per minute to show the correct time since last refresh
		this.fetchTimeout = setTimeout(() => { 
			this.forceUpdate();
			this.scheduleComponentRefresh();
		}, 60*1000);
	},

	onClickRefresh() {
		ShareActions.refreshPaths([ this.props.rowData.path ]);
	},

	render: function () {
		const state = this.props.rowData.refresh_state;
		if (state.id === RefreshStateEnum.NORMAL) {
			return (
				<div>
					<i className={ 'icon large link green refresh' } onClick={ this.onClickRefresh }/>
					{ this.props.cellData === 0 ? 'Unknown' : ValueFormat.formatRelativeTime(this.props.cellData) }
				</div>
			);
		}

		return (
			<Loader size="small" inline={ true } text={ state.str }/>
		);
	}
});

export default RefreshCell;