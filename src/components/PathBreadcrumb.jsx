import React from 'react';

const PathBreadcrumb = React.createClass({
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

	render: function () {
		const items = this.props.tokens.map((token, index) => {
			return (
				<div key={token}>
					<i className="right chevron icon divider"></i>
					<a className="section" onClick={() => this.onClick(token, index)}>{token}</a>
				</div>);
		});

		return (
			<div className="ui breadcrumb segment">
				<a className="section" onClick={() => this.props.itemClickHandler(this.props.rootPath)}>{this.props.rootName}</a>
				{items}
			</div>
		);
	}
});

export default PathBreadcrumb
;