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
		 * Current path to display
		 */
		path: React.PropTypes.string.isRequired,
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

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.path !== this.props.path;
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
		const tokens = this.tokenizePath();
		let path = this.props.rootPath;

		for (let i = 1; i <= index; i++) {
			path += tokens[i] + this.props.separator;
		}

		this.props.itemClickHandler(path);
	},

	formatName(token) {
		return (
			<div className="section-caption">
				{ this.props.rootPath === token ? this.props.rootName : token }
			</div>
		);
	},

	formatSection(token, index) {
		return (
			<Section 
				key={ token + index } 
				onClick={ () => this.onClick(token, index) }
				name={ this.formatName(token) }
			/>
		);
	},

	tokenizePath() {
		const { path, separator, rootPath } = this.props;

		return [ rootPath, ...path.split(separator).filter(t => t.length != 0) ];
	},

	parsePath() {
		const tokens = this.tokenizePath();
		return {
			current: tokens[tokens.length-1],
			tokens: tokens.slice(0, tokens.length-1),
		};
	},

	render: function () {
		const { current, tokens } = this.parsePath();

		const className = this.state.overflow ? 'overflow' : '';
		return (
			<div className={ 'ui segment browserbar ' + className }>
				<div className="path-navigation" ref="wrapper">
					<div className="ui breadcrumb" ref="breadcrumb">
						{ tokens.map(this.formatSection) }
					</div>
				</div>
				
				<SelectedSection
					key={ current }
					selectedNameFormatter={ this.props.selectedNameFormatter }
					name={ this.formatName(current) }
				/>
			</div>
		);
	}
});

export default BrowserBar;
