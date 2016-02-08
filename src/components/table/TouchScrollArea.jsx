import React from 'react';

import ZyngaScroller from 'zynga/Scroller';
import TouchableArea from './TouchableArea';


const TouchScrollArea = React.createClass({
	propTypes: {
		/**
		 * Function to call when the scroll position changes
		 * Receives left and top coordinates as parameters
		 */
		handleScroll: React.PropTypes.func.isRequired,

		/**
		 * Function to call when scrolling starts
		 * Receives left and top coordinates as parameters
		 */
		onScrollStart: React.PropTypes.func,

		/**
		 * Function to call when scrolling ends
		 * Receives left and top coordinates as parameters
		 */
		onScrollEnd: React.PropTypes.func,
		
		/**
		 * Is touch mode enabled (it will disable mouse scrolling)
		 */
		touchMode: React.PropTypes.bool.isRequired,
	},

	componentWillMount : function () {
		this.reset(this.props.touchMode);
	},

	componentWillReceiveProps: function (nextProps) {
		if (nextProps.touchMode !== this.props.touchMode) {
			this.reset(nextProps.touchMode);
		}
	},

	componentWillUnmount() {
		clearTimeout(this._scrollTimer);
	},

	reset(touchMode) {
		this.scroller = new ZyngaScroller(touchMode ? this._handleScroll : this._doNothing);
		this._scrollTimer = null;
		this.updatingDimensions = false;
	},

	render : function () {
		if (!this.props.touchMode) {
			const { onScrollStart, onScrollEnd } = this.props;
			return React.cloneElement(this.props.children, {
				onScrollStart,
				onScrollEnd,
			});
		}

		return (
			<TouchableArea scroller={this.scroller}>
				{ this.props.children }
			</TouchableArea>
		);
	},

	_onContentDimensionsChange : function (tableWidth, tableHeight, contentWidth, contentHeight) {
		//console.log('_onContentDimensionsChange');
		this.updatingDimensions = true;

		this.scroller.setDimensions(
			tableWidth,
			tableHeight,
			contentWidth,
			contentHeight
		);

		this.updatingDimensions = false;
	},

	_handleScroll : function (left, top) {
		if (!this.isMounted()) {
			return;
		}
		
		// We aren't scrolling when the table is being resized
		if (!this.updatingDimensions) {
			if (this.props.onScrollStart && this._scrollTimer === null) {
				console.log('Touch scroll start, top: ' + top);
				this.props.onScrollStart(left, top);
			}

			if (this.props.onScrollEnd) {
				if (this._scrollTimer !== null) {
					clearTimeout(this._scrollTimer);
				}

				this._scrollTimer = setTimeout(this.onScrollEnd.bind(this, left, top), 200);
			}
		}

		this.props.handleScroll(left, top);
	},

	onScrollEnd(left, top) {
		if (!this.isMounted()) {
			return;
		}

		console.log('Touch scroll end, top: ' + top);
		this.props.onScrollEnd(left, top);
		this._scrollTimer = null;
	},

	_doNothing : function (left, top) {
		
	}
});

export default TouchScrollArea;
