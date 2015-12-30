import React from 'react';
import classNames from 'classnames';

import TypeConvert from 'utils/TypeConvert';

const fileToIcon = (name) => {
	switch (name) {
		case 'audio': return 'file outline audio';
		case 'compressed': return 'file outline archive';
		case 'document': return 'edit';
		case 'executable': return 'browser';
		case 'picture': return 'file outline image';
		case 'video': return 'file outline video';
		default: return 'file outline';
	}
};

const fileItemTypeToIcon = (item) => {
	switch (item.id) {
		case 'directory': return 'file outline yellow folder';
		case 'file': return fileToIcon(item.content_type);
		case 'drive_fixed': return 'grey disk outline';
		case 'drive_remote': return 'grey server';
		case 'removable': return 'grey external share';
		default: return 'file outline';
	}
};

export const FileNameFormatter = ({ onClick, item, children }) => {
	const iconClass = classNames(
		'icon large',
		{ 'link': onClick },
		fileItemTypeToIcon(item),
	);

	return (
		<div className="file-name" onClick={ onClick }>
			<i className={ iconClass }/>
			{ onClick ? (
				<a>
					{ children }
				</a>
			) : children }
		</div>
	);
};

export const IpFormatter = ({ item }) => (
	<div className="ip flag">
		<i className={ 'ui flag ' + item.country_id.toLowerCase() }/>
		{ item.str }
	</div>
);

export const UserIconFormatter = React.createClass({
	propTypes: {
		/**
		 * Size of the icon
		 */
		size: React.PropTypes.string,

		/**
		 * Action ids to filter from all actions
		 */
		flags: React.PropTypes.array.isRequired,
	},

	getCornerIcon() {
		const { flags } = this.props;
		if (flags.indexOf('bot') > -1) {
			return 'setting';
		}

		if (flags.indexOf('op') > -1) {
			return 'yellow privacy';
		}

		if (flags.indexOf('me') > -1) {
			return 'blue star';
		}

		return null;
	},

	getDefaultProps() {
		return {
			size: '',
			className: '',
		};
	},

	render() {
		const { flags } = this.props;

		const cornerIcon = this.getCornerIcon();
		return (
			<i className={ this.props.size + ' icons ' + this.props.className }>
				<i className={ TypeConvert.userOnlineStatusToColor(flags) + ' user icon' }></i>
				{ cornerIcon ? <i className={ this.getCornerIcon() + ' corner icon' }></i> : null }
			</i>
		);
	},
});

export const HubIconFormatter = React.createClass({
	propTypes: {
		/**
		 * Size of the icon
		 */
		size: React.PropTypes.string,

		/**
		 * Action ids to filter from all actions
		 */
		hub: React.PropTypes.object.isRequired,
	},

	getCornerIcon() {
		/*const { hub } = this.props;
		if (hub.hub_url.indexOf('adcs') === 0 || hub.hub_url.indexOf('dchubs') === 0) {
			return 'yellow lock';
		}*/

		return null;
	},

	getDefaultProps() {
		return {
			size: ''
		};
	},

	render() {
		const { hub } = this.props;

		const cornerIcon = this.getCornerIcon();
		return (
			<i className={ this.props.size + ' icons' }>
				<i className={ TypeConvert.hubOnlineStatusToColor(hub.connect_state.id) + ' sitemap icon' }></i>
				{ cornerIcon ? <i className={ this.getCornerIcon() + ' corner icon' }></i> : null }
			</i>
		);
	},
});