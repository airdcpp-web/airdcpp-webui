import React from 'react';

import Accordion from 'components/semantic/Accordion';
import Message from 'components/semantic/Message';


const EmptyMessage = () => (
	<Message
		title="No paths to display"
	/>
);

const PathItem = ({ path, downloadHandler }) => (
	<div className="item">
		<i className="yellow folder icon"></i>
		<div className="content">
			<a onClick={ evt => downloadHandler(path) }>
				{ path }
			</a>
		</div>
	</div>
);

const PathList = ({ downloadHandler, paths }) => {
	if (paths.length === 0) {
		return <EmptyMessage/>;
	}

	return (
		<div className="ui relaxed list">
			{ paths.map(path => (
				<PathItem 
					key={path} 
					path={path} 
					downloadHandler={ downloadHandler }
				/>
			)) }
		</div>
	);
};

PathList.PropTypes = {
	/**
	 * Function handling the path selection. Receives the selected path as argument.
	 */
	downloadHandler: React.PropTypes.func.isRequired,

	/**
	 * Array of paths to list
	 */
	paths: React.PropTypes.array.isRequired,
};


const AccordionTargets = React.createClass({
	propTypes: {
		/**
		 * Function handling the path selection. Receives the selected path as argument.
		 */
		downloadHandler: React.PropTypes.func.isRequired,

		/**
		 * Grouped paths to list
		 */
		groupedPaths: React.PropTypes.array.isRequired,
	},

	formatParent(parent) {
		return (
			<div key={ parent.name }>
				<div className="title">
					<i className="dropdown icon"/>
					{ parent.name }
				</div>

				<div className="content">
					<PathList paths={parent.paths} downloadHandler={ this.props.downloadHandler }/>
				</div>
			</div>
			);
	},

	render: function () {
		const { groupedPaths } = this.props;
		if (groupedPaths.length === 0) {
			return <EmptyMessage/>;
		}

		return (
			<Accordion className="styled download-targets">
				{this.props.groupedPaths.map(this.formatParent) }
			</Accordion>
		);
	}
});

export { PathList, AccordionTargets };