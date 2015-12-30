import React from 'react';

import LayoutHeader from 'components/semantic/LayoutHeader';
import Button from 'components/semantic/Button';

const TabHeader = React.createClass({
	propTypes: {
		buttonClickHandler: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			buttonCaption: 'Close'
		};
	},

	render() {
		const { buttonClickHandler, ...other } = this.props;
		return (
			<LayoutHeader
				{ ...other }
				className="tab-header"
				component={ buttonClickHandler ? (
						<Button
							caption={ this.props.buttonCaption }
							onClick={ this.props.buttonClickHandler }
						/>
					) : null
				}
			/>
		);
	},
});

export default TabHeader
;