import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/semantic/Button';
import ActionInput from 'components/semantic/ActionInput';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import SettingConstants from 'constants/SettingConstants';
import SocketService from 'services/SocketService';

import IconConstants from 'constants/IconConstants';


const LimiterConfig = React.createClass({
	mixins: [ PureRenderMixin ],
	propTypes: {
		limit: PropTypes.number.isRequired,

		/* Limiter API setting key to use for saving */
		settingKey: PropTypes.string.isRequired,

		hide: PropTypes.func,
	},

	save(limit = 0) {
		SocketService.post(SettingConstants.ITEMS_SET_URL, {
			[this.props.settingKey]: limit,
		});

		this.props.hide();
	},

	render() {
		return (
			<div className="limiter-config">
				<div className="ui header">Enter limit (kB/s)</div>
				<ActionInput 
					placeholder="Enter limit..." 
					type="number" 
					caption="Save" 
					icon={ IconConstants.SAVE }
					handleAction={ text => this.save(parseInt(text)) }
				/>
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