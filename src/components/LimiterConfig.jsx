import React from 'react';

import Button from 'components/semantic/Button';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import SettingConstants from 'constants/SettingConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';


const LimiterConfig = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {
		limit: React.PropTypes.number.isRequired,

		/* Limiter API setting key to use for saving */
		settingKey: React.PropTypes.string.isRequired,

		hide: React.PropTypes.func,
	},

	getInitialState() {
		return {
			limit: this.props.limit ? this.props.limit : '',
		};
	},

	save(limit = 0) {
		SocketService.post(SettingConstants.ITEMS_SET_URL, {
			[this.props.settingKey]: limit,
		});

		this.props.hide();
	},

	onChange(evt) {
		this.setState({
			limit: parseInt(evt.target.value),
		});
	},

	render() {
		return (
			<div className="limiter-config">
				<div className="ui header">Enter limit (kB/s)</div>
				<div className="ui action input">
					<input 
						type="number" 
						value={ this.state.limit }
						onChange={ this.onChange }
						placeholder="Enter limit..."
					/>
					<Button
						caption="Save"
						icon={ IconConstants.SAVE }
						onClick={ () => this.save(this.state.limit) }
					/>
				</div>
				{ !this.props.limit ? null : (
					<Button
						className="fluid remove"
						caption="Remove limit"
						icon={ IconConstants.REMOVE }
						onClick={ () => this.save(0) }
					/>
				) }
			</div>
		);
	}
});

export default LimiterConfig;