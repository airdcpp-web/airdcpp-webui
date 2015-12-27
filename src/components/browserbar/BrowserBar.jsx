import React from 'react';

import './style.css';

const Section = ({ name, onClick }) => (
	<div className="path-token">
		<a className="section" onClick={ onClick }>
			{ name }
		</a>
		<i className="right chevron icon divider"></i>
	</div>
);

const SelectedSection = ({ selectedNameFormatter, name }) => (
	<div className="ui label current path-token section">
		{ selectedNameFormatter(name) }
	</div>
);

const BrowserBar = React.createClass({
	propTypes: {
		/**
		 * Function handling the path selection. Receives the selected path as argument.
		 */
		itemClickHandler: React.PropTypes.func.isRequired,

		/**
		 * Function handling the path selection. Receives the selected path as argument.
		 */
		rootName: React.PropTypes.string,

		/**
		 * Root path that will be appended to the beginning of the returned path
		 */
		rootPath: React.PropTypes.string.isRequired,

		/**
		 * Root path that will be appended to the beginning of the returned path
		 */
		separator: React.PropTypes.string.isRequired,

		/**
		 * Array of path objects to list
		 */
		tokens: React.PropTypes.array.isRequired,
	},

	getDefaultProps() {
		return {
			rootName: 'Root',
		};
	},

	getInitialState() {
		return {
			overflow: false,
		};
	},

	componentDidMount() {
		this.checkOverflow();
	},

	componentDidUpdate() {
		this.checkOverflow();
	},

	checkOverflow() {
		const newOverflow = this.refs.breadcrumb.clientWidth > this.refs.wrapper.clientWidth;
		if (newOverflow !== this.state.overflow) {
			this.setState({ overflow: newOverflow });
			console.log('overflow', newOverflow);
		}
	},

	onClick(token, index) {
		let path = this.props.rootPath;
		for (let i = 0; i <= index; i++) {
			if (path.length === 0) {
				// No separator after the drive on Windows
				path += this.props.tokens[i];
			} else {
				path += this.props.tokens[i] + this.props.separator;
			}
		}

		this.props.itemClickHandler(path);
	},

	formatToken(token, index) {
		if (index === this.props.tokens.length-1) {
			return null;
		}

		return (
			<Section 
				key={ token + index } 
				onClick={ () => this.onClick(token, index) }
				name={ token }
			/>
		);
	},

	render: function () {
		const { tokens } = this.props;

		const items = this.props.tokens.map(this.formatToken);

		const className = this.state.overflow ? 'overflow' : '';
		const selectedToken = tokens[tokens.length-1];
		return (
			<div className={ 'ui segment browserbar ' + className }>
				<div className="path-navigation" ref="wrapper">
					<div className="ui breadcrumb" ref="breadcrumb">
						<Section 
							key={ this.props.rootPath } 
							onClick={ () => this.props.itemClickHandler(this.props.rootPath) }
							name={ this.props.rootName }
						/>
						{items}
					</div>
				</div>
				<SelectedSection
					key={ selectedToken }
					selectedNameFormatter={ this.props.selectedNameFormatter }
					name={ selectedToken }
				/>
			</div>
		);
	}
});

export default BrowserBar;
