import React from 'react';
import classNames from 'classnames';

import TypeConvert from 'utils/TypeConvert';

export const FileNameFormatter = React.createClass({
	fileToIcon: function (name) {
		switch (name) {
			case 'audio': return 'file outline audio';
			case 'compressed': return 'file outline archive';
			case 'document': return 'edit';
			case 'executable': return 'browser';
			case 'picture': return 'file outline image';
			case 'video': return 'file outline video';
			default: return 'file outline';
		}
	},

	typeToIcon: function (item) {
		switch (item.id) {
			case 'directory': return 'file outline yellow folder';
			case 'file': return this.fileToIcon(item.content_type);
			case 'drive_fixed': return 'grey disk outline';
			case 'drive_remote': return 'grey server';
			case 'removable': return 'grey external share';
			default: return 'file outline';
		}
	},

	render: function () {
		const { onClick } = this.props;
		const iconClass = classNames(
			'icon large',
			{ 'link': onClick },
			this.typeToIcon(this.props.item),
		);

		return (
			<div onClick={ onClick }>
				<i className={ iconClass }/>
				{ onClick ? (
					<a>
						{ this.props.children }
					</a>
				) : this.props.children }
			</div>
		);
	}
});

export const IpFormatter = React.createClass({
	render: function () {
		const { country_id } = this.props.item;
		return (
			<div>
			<div className={ 'ui flag ' + (country_id.length === 0 ? 'icon grey ' : country_id.toLowerCase()) }/>
			{ this.props.item.str }
			</div>
		);
	}
});

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
		/*const {identity} = this.props.hub;
		if (flags.indexOf("bot") > -1) {
			return "setting";
		}

		if (flags.indexOf("op") > -1) {
			return "yellow privacy";
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