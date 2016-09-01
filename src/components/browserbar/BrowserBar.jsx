import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './style.css';

import 'semantic-ui/components/breadcrumb.min.css';


const Section = ({ caption, onClick }) => (
	<div className="path-token">
		<a className="section" onClick={ onClick }>
			{ caption }
		</a>
		<i className="right chevron icon divider"/>
	</div>
);

const SelectedSection = ({ selectedNameFormatter, caption, token }) => (
	<div className="ui label current path-token section">
		{ selectedNameFormatter(caption, token) }
	</div>
);

const BrowserBar = React.createClass({
	mixins: [ PureRenderMixin ],
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

		/**
		 * Function returning the formated element for the current directory name
		 * Receives the caption element and path token as parameters
		 */
		selectedNameFormatter: React.PropTypes.func.isRequired,
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
				caption={ this.formatName(token) }
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
					caption={ this.formatName(current) }
					token={ current }
				/>
			</div>
		);
	}
});

export default BrowserBar;
