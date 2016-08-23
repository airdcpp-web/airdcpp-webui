import React from 'react';
import Reflux from 'reflux';
import invariant from 'invariant';

import DemoIntro from './DemoIntro';
import NewUserIntro from './NewUserIntro';

import Widget from './Widget';

import { Responsive, WidthProvider } from 'react-grid-layout';
import { LocationContext } from 'mixins/RouterMixin';
import WidgetStore from 'stores/WidgetStore';


import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import 'semantic-ui/components/card.min.css';
import '../style.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


const Home = React.createClass({
	mixins: [ LocationContext, Reflux.connect(WidgetStore, 'layouts') ],
	getInitialState() {
		return {
			breakpoint: 'lg',
		};
	},

	// Convert a layout entry to a component
	mapWidget(layoutItem) {
		const widgetInfo = WidgetStore.getWidgetInfoById(layoutItem.i);
		invariant(widgetInfo, 'Widget info missing');
		if (!widgetInfo) {
			return null;
		}

		const Component = widgetInfo.component;
		const settings = WidgetStore.getWidgetSettings(layoutItem.i);

		return (
			<Widget
				key={ layoutItem.i }
				componentId={ layoutItem.i }
				widgetInfo={ widgetInfo }
				settings={ settings }
				data-grid={ layoutItem }
			>
				<Component
					settings={ settings.widget }
					componentId={ layoutItem.i }
				/>
			</Widget>
		);
	},

	onBreakpointChange(breakpoint, cols) {
		this.setState({
			breakpoint,
		});
	},

	render() {
		return (
			<div id="home">
				<DemoIntro/>
				<NewUserIntro/>
				<ResponsiveReactGridLayout 
					className="ui cards layout"
					rowHeight={50} 
					width={1200}
					onLayoutChange={ WidgetStore.onLayoutChange }
					onBreakpointChange={ this.onBreakpointChange }

					breakpoints={ WidgetStore.breakpoints }
					cols={ WidgetStore.cols }

					draggableHandle=".react-grid-item .header-row .header"
					layouts={ this.state.layouts }
				>
					{ this.state.layouts[this.state.breakpoint]
							.map(this.mapWidget)
							.filter(widget => widget) }
				</ResponsiveReactGridLayout>
			</div>
		);
	}
});

export default Home;