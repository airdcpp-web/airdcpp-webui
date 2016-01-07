import React from 'react';
import RecentHubConstants from 'constants/RecentHubConstants';

import RemoteSuggestField from './RemoteSuggestField';
import Button from 'components/semantic/Button';

const HubSearchInput = React.createClass({
	propTypes: {

		/**
		 * Function to call when pressing enter
		 */
		submitHandler: React.PropTypes.func.isRequired,
	},

	getInitialState() {
		return {
			text: '',
		};
	},

	submitHandler() {
		this.props.submitHandler(this.state.text);
	},

	onKeyDown: function (event) {
		if (event.keyCode === 13 && this.state.text.length !== 0) {
			this.submitHandler();
		}
	},

	render() {
		const { text } = this.state;
		return (
			<div className="ui fluid action input" onKeyDown={ this.onKeyDown }>
				<RemoteSuggestField
					placeholder="Enter hub address..."
					submitHandler={ this.submitHandler }
					valueField="hub_url"
					descriptionField="name"
					url={ RecentHubConstants.SEARCH_URL }
					onChange={ value => this.setState({ text: value }) }
				/>

				<Button
					icon="green play"
					onClick={ this.submitHandler }
					caption="Connect"
					disabled={ text.length === 0 }
				/>
			</div>
		);
	},
});

export default HubSearchInput;
