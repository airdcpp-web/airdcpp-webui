import React from 'react';
import classNames from 'classnames';

import TypeConvert from 'utils/TypeConvert';


const fileToIcon = (name) => {
	switch (name) {
		case 'audio': return 'file outline audio';
		case 'compressed': return 'file outline archive';
		case 'document': return 'file text outline';
		case 'executable': return 'browser';
		case 'picture': return 'file outline image';
		case 'video': return 'file outline video';
		default: return 'file outline';
	}
};

const fileItemTypeToIcon = (typeInfo) => {
	switch (typeInfo.id) {
		case 'directory': return 'file outline yellow folder';
		case 'file': return fileToIcon(typeInfo.content_type);
		case 'drive_fixed': return 'grey disk outline';
		case 'drive_remote': return 'grey server';
		case 'removable': return 'grey external share';
		default: return 'file outline';
	}
};

export const FileIcon = ({ typeInfo, onClick }) => {
	const iconClass = classNames(
		'icon large',
		{ 'link': onClick },
		fileItemTypeToIcon(typeInfo),
	);

	return (
		<i className={ iconClass }/>
	);
};

export const FileNameFormatter = ({ onClick, typeInfo, caption }) => {
	//let className = 'file-name';
	//if (caption.indexOf(' ') === -1 /*&& caption.indexOf('-') === -1*/) {
	//	className += ' long';
	//}

	if (onClick) {
		caption = (
			<a onClick={ onClick }>
				{ caption }
			</a>
		);
	}

	return (
		<div className="file-name">
			<FileIcon typeInfo={ typeInfo }/>
			{ caption }
		</div>
	);
};

FileNameFormatter.propTypes = {
	onClick: React.PropTypes.func,

	typeInfo: React.PropTypes.object.isRequired,

	caption: React.PropTypes.string.isRequired,
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

	getUserIcon() {
		const { flags } = this.props;
		if (flags.indexOf('ignored') > -1) {
			return 'red ban icon';
		}

		return TypeConvert.userOnlineStatusToColor(flags) + ' user icon';
	},

	getDefaultProps() {
		return {
			size: '',
			className: '',
		};
	},

	render() {
		const cornerIcon = this.getCornerIcon();
		return (
			<i className={ this.props.size + ' icons ' + this.props.className }>
				<i className={ this.getUserIcon() }></i>
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