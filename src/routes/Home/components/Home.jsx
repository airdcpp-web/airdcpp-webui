import React from 'react';

import DemoIntro from './DemoIntro';
import NewUserIntro from './NewUserIntro';

import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import Widget from './Widget';
import WidgetDropdown from './WidgetDropdown';

import RSS from './widgets/RSS/RSS';
import TransferSpeed from './widgets/TransferSpeed/TransferSpeed';

import 'semantic-ui/components/card.min.css';
import '../style.css';

import BrowserUtils from 'utils/BrowserUtils';

import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';
import { LocationContext } from 'mixins/RouterMixin';

import reject from 'lodash/reject';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


const widgets = [
	RSS,
	TransferSpeed,
];

const keyToComponentId = (id) => {
	const pos = id.indexOf('_');
	return pos !== -1 ? id.substring(0, pos) : id;
};

const parseSettings = (key) => {
	return BrowserUtils.loadLocalProperty('widget_' + key, { });
};
 

const Home = React.createClass({
	mixins: [ LocationContext ],
	getInitialState() {
		return {
			layout: BrowserUtils.loadLocalProperty('home_layout', []),
		};
	},

	onLayoutChange(layout) {
		BrowserUtils.saveLocalProperty('home_layout', layout);
		this.setState({
			layout
		});

		console.log('New layout', layout);
	},

	onCreateWidget(widgetInfo) {
		const id = widgetInfo.id + '_' + Math.floor((Math.random() * 100000000) + 1);
		History.pushModal(this.props.location, '/home/widget', OverlayConstants.HOME_WIDGET_MODAL, { 
			widgetInfo,
			settings: {
				name: widgetInfo.name,
			},
			onSave: settings => this.onSaveWidget(id, settings, widgetInfo),
		});
	},

	onEditWidget(evt, id, widgetInfo, settings) {
		History.pushModal(this.props.location, '/home/widget', OverlayConstants.HOME_WIDGET_MODAL, { 
			widgetInfo,
			settings, 
			onSave: settings => this.onSaveWidget(id, settings),
		});
	},

	onRemoveWidget(evt, id) {
		BrowserUtils.removeLocalProperty('widget_' + id);

		 this.setState({
			layout: reject(this.state.layout, { i: id })
		 });
	},

	onSaveWidget(id, settings, widgetInfo) {
		BrowserUtils.saveLocalProperty('widget_' + id, settings);

		if (widgetInfo) {
			const layout = this.state.layout.concat({ 
				i: id, 
				x: this.state.layout.length * 2 % (this.state.cols || 12), 
				y: 0, 
				...widgetInfo.size
			});

			this.setState({
				layout,
			});

			console.log('Widget added', layout);
		}
	},

  // We're using the cols coming back from this to calculate where to add new items.
	onBreakpointChange(breakpoint, cols) {
		this.setState({
			breakpoint: breakpoint,
			cols: cols
		});
	},

	mapWidget(layoutItem) {
		const widgetId = keyToComponentId(layoutItem.i);
		const widgetInfo = widgets.find(item => item.id === widgetId);
		if (widgetInfo) {
			const Component = widgetInfo.component;
			const settings = parseSettings(layoutItem.i);

			return (
				<Widget
					key={ layoutItem.i }
					widgetId={ widgetId }
					componentId={ layoutItem.i }
					widgetInfo={ widgetInfo }
					settings={ settings }
					onEdit={ evt => this.onEditWidget(evt, layoutItem.i, widgetInfo, settings) }
					onRemove={ evt => this.onRemoveWidget(evt, layoutItem.i) }
					data-grid={ layoutItem }
				>
					<Component
						settings={ settings.widget }
						componentId={ layoutItem.i }
					/>
				</Widget>
			);
		}

		return null;
	},

	render() {
		return (
			<div id="home">
				<DemoIntro/>
				<NewUserIntro/>

				<WidgetDropdown
			  	widgets={ widgets }
			  	onClickItem={ this.onCreateWidget }
				/>
				<ResponsiveReactGridLayout 
					className="ui cards layout"
					rowHeight={50} 
					width={1200}
					onLayoutChange={ this.onLayoutChange }
					onBreakpointChange={ this.onBreakpointChange }

					breakpoints={{ xlg: 1600, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
					cols={{ xlg: 14, lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}

					draggableHandle=".react-grid-item .header-row .header"
				>
					{/*<WidgetDropdown
						key="widget-dropdown"
						data-grid={ {
							i: 'widget-dropdown',
							x: 0,
							y: 0,
							w: 2,
							h: 1,
						} }
				  	widgets={ widgets }
				  	onClickItem={ this.onCreateWidget }
					/>*/}
					{ this.state.layout.map(this.mapWidget) }
				</ResponsiveReactGridLayout>
			</div>
		);
	}
});

export default Home;