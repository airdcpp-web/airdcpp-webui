import React from 'react';
import Moment from 'moment';
import classNames from 'classnames';
import TypeConvert from 'utils/TypeConvert'

export default {
	formatSize: function(fileSizeInBytes) {
		if (fileSizeInBytes === undefined) {
			return undefined;
		}

		let i = 0;
		const byteUnits = [' b', ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
		do {
				fileSizeInBytes = fileSizeInBytes / 1024;
				i++;
		} while (fileSizeInBytes > 1024);

		return Math.max(fileSizeInBytes, 0.0).toFixed(2) + byteUnits[i];
	},

	formatSpeed: function(bytesPerSecond, formatter) {
		if (bytesPerSecond === undefined) {
			return undefined;
		}
		
		return formatter.formatSize(bytesPerSecond) + "/s";
	},

	formatSpeedIfRunning: function(bytesPerSecond) {
		if (bytesPerSecond === undefined) {
			return undefined;
		}

		if (bytesPerSecond == 0) {
			return '';
		}

		return this.formatSize(bytesPerSecond) + "/s";
	},

	formatConnection: function(bytes) {
		if (bytes === undefined) {
			return undefined;
		}

		let bits = bytes*8;
		let i = 0;

		const bitUnits = [' bit', ' Kbit', ' Mbit', ' Gbit', ' Tbit', ' Pbit'];
		do {
				bits = bits / 1000;
				i++;
		} while (bits > 1000);

		return Math.max(bits, 0.0).toFixed(2) + bitUnits[i] + "/s";
	},

	formatDateTime: function(time) {
		if (time === undefined) {
			return undefined;
		}

		if (time == 0) {
			return '';
		}

		return Moment.unix(time).format("LLL");
	},

	formatTimestamp: function(time) {
		if (time === undefined) {
			return undefined;
		}

		if (time == 0) {
			return '';
		}

		//return Moment.unix(time).format("LTS");
		return Moment.unix(time).format("HH:mm:ss");
	},

	formatBool: function(value) {
		return value ? "Yes" : "No";
	},

	formatDecimal: function(value) {
		if (!value) {
			return undefined;
		}

		return parseFloat(Math.round(value * 100) / 100).toFixed(2);
	},

	FileNameFormatter: React.createClass({
			fileToIcon: function(name) {
				switch(name) {
					case "audio": return "file outline audio";
					case "compressed": return "file outline archive";
					case "document": return "edit";
					case "executable": return "browser";
					case "picture": return "file outline image";
					case "video": return "file outline video";
					default: return "file outline";
				}
			},

			typeToIcon: function(item) {
				switch(item.id) {
					case "directory": return "file outline yellow folder";
					case "file": return this.fileToIcon(item.content_type);
					case "drive_fixed": return "grey disk outline";
					case "drive_remote": return "grey server";
					case "removable": return "grey external share";
					default: return "file outline";
				}
			},

			render: function() {
				return (
					<div>
					<i className={ "icon large " + this.typeToIcon(this.props.item) }/>
						{ this.props.children }
					</div>
				);
			}
		}),

	IpFormatter: React.createClass({
			render: function() {
				const { country_id } = this.props.item;
				return (
					<div>
					<div className={ "ui flag " + (country_id.length === 0 ? "icon grey " : country_id.toLowerCase()) }/>
					{ this.props.item.str }
					</div>
				);
			}
		}),

	UserIconFormatter: React.createClass({
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
			const {flags} = this.props;
			if (flags.indexOf("bot") > -1) {
				return "setting";
			}

			if (flags.indexOf("op") > -1) {
				return "yellow privacy";
			}

			return null;
		},

		getDefaultProps() {
			return {
				size: ""
			}
		},

		render() {
			const {flags} = this.props;

			const cornerIcon = this.getCornerIcon();
			return (
				<i className={ this.props.size + " icons" }>
					<i className={ TypeConvert.userOnlineStatusToColor(flags) + " user icon" }></i>
					{ cornerIcon ? <i className={ this.getCornerIcon() + " corner icon" }></i> : null }
				</i>
			);
		},
	}),

	HubIconFormatter: React.createClass({
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
				size: ""
			}
		},

		render() {
			const {hub} = this.props;

			const cornerIcon = this.getCornerIcon();
			return (
				<i className={ this.props.size + " icons" }>
					<i className={ TypeConvert.hubOnlineStatusToColor(hub.connect_state.id) + " sitemap icon" }></i>
					{ cornerIcon ? <i className={ this.getCornerIcon() + " corner icon" }></i> : null }
				</i>
			);
		},
	}),
};
