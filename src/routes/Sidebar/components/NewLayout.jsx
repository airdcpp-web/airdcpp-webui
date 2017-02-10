import React from 'react';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import RedrawDecorator from 'decorators/RedrawDecorator';
import ValueFormat from 'utils/ValueFormat';

import LayoutHeader from 'components/semantic/LayoutHeader';
import { ListItem } from 'components/semantic/List';


const RecentLayout = DataProviderDecorator(RedrawDecorator(({ entries, recentTitleRenderer, hasSession, icon }) => {
	if (entries.length === 0) {
		return null;
	}

	return (
		<div className="ui relaxed divided list recents">
			<LayoutHeader
				title="Recent sessions"
				size="medium"
			/>
			{ entries.map((entry, index) => (
					<ListItem 
						key={ index }
						header={ recentTitleRenderer(entry) }
						description={ entry.last_opened ? ('Opened ' + ValueFormat.formatRelativeTime(entry.last_opened)) : null }
						icon={ (hasSession(entry) ? 'green ' : '') + icon }
					/>
				)) }
		</div>
	);
}), {
	urls: {
		entries: ({ recentUrl }, socket) => socket.get(recentUrl + '/10'),
	},
});

const NewLayout = React.createClass({
	propTypes: {
		/**
		 * Title of the button
		 */
		title: React.PropTypes.any.isRequired,

		/**
		 * Title of the button
		 */
		subHeader: React.PropTypes.any,

		/**
		 * URL for fetching the recent entries
		 */
		recentUrl: React.PropTypes.string.isRequired,

		/**
		 * Renders the recent entry title
		 */
		recentTitleRenderer: React.PropTypes.func.isRequired,

		/**
		 * Returns whether the recent entry is currently active
		 */
		hasSession: React.PropTypes.func.isRequired,
	},

	getDefaultProps() {
		return {
			className: '',
		};
	},

	render: function () {
		const { title, icon, subHeader, recentUrl, recentTitleRenderer, hasSession, children } = this.props;
		return (
			<div className={ 'new-layout ' + this.props.className }>
				<LayoutHeader
					title={ title }
					icon={ icon }
					subHeader={ subHeader }
				/>
				{ children }
				<RecentLayout
					recentUrl={ recentUrl }
					recentTitleRenderer={ recentTitleRenderer }
					icon={ icon }
					hasSession={ hasSession }
				/>
			</div>
		);
	}
});

export default NewLayout
;