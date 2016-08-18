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
	mixins: [ LocationContext, Reflux.connect(WidgetStore, 'layout') ],

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
					onBreakpointChange={ WidgetStore.onBreakpointChange }

					breakpoints={{ xlg: 1600, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
					cols={{ xlg: 14, lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}

					draggableHandle=".react-grid-item .header-row .header"
					layouts={ {} } // https://github.com/STRML/react-grid-layout/issues/320
				>
					{ this.state.layout
							.map(this.mapWidget)
							.filter(widget => widget) }
				</ResponsiveReactGridLayout>
			</div>
		);
	}
});

export default Home;