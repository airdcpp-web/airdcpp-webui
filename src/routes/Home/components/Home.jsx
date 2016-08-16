import React from 'react';
import invariant from 'invariant';

import DemoIntro from './DemoIntro';
import NewUserIntro from './NewUserIntro';

import { Responsive, WidthProvider } from 'react-grid-layout';

import Widget from './Widget';
import WidgetDropdown from './WidgetDropdown';

import RSS from './widgets/RSS/RSS';
import Transfers from './widgets/Transfers/Transfers';

import 'semantic-ui/components/card.min.css';
import '../style.css';

import BrowserUtils from 'utils/BrowserUtils';

import History from 'utils/History';
import OverlayConstants from 'constants/OverlayConstants';
import { LocationContext } from 'mixins/RouterMixin';

import reject from 'lodash/reject';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


// CONSTANTS

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const LAYOUT_STORAGE_KEY = 'home_layout';

const widgets = [
	RSS,
	Transfers,
];


// HELPERS

const idToSettingKey = (id) => 'widget_' + id;

const idToWidgetType = (id) => {
	const pos = id.indexOf('_');
	return pos !== -1 ? id.substring(0, pos) : id;
};

const parseSettings = (id) => {
	return BrowserUtils.loadLocalProperty(idToSettingKey(id), { });
};

const saveSettings = (id, settings) => {
	BrowserUtils.saveLocalProperty(idToSettingKey(id), settings);
};

const generateId = (widgetType) => {
	return widgetType + '_' + Math.floor((Math.random() * 100000000) + 1);
};

const getWidgetInfoById = (id) => {
	const widgetType = idToWidgetType(id);
	return widgets.find(item => item.typeId === widgetType);
};

const createDefaultWidget = (x, y, widgetInfo, name, settings, suffix = '_default') => {
	const item = {
		i: widgetInfo.typeId + suffix,
		x,
		y,
		...widgetInfo.size,
	};

	saveSettings(item.i, {
		name,
		widget: settings,
	});

	return item;
};

const Home = React.createClass({
	mixins: [ LocationContext ],
	getInitialState() {
		let layout = BrowserUtils.loadLocalProperty(LAYOUT_STORAGE_KEY);
		if (layout && layout.items) {
			layout = layout.items;
		} else {
			// Initialize the default layout
			layout = [
				createDefaultWidget(0, 0, Transfers, Transfers.name),
				createDefaultWidget(9, 0, RSS, 'Application releases', {
					feed_url: 'https://github.com/airdcpp-web/airdcpp-webclient/releases.atom',
				}, '_releases'),
			];
		}

		return {
			layout,
		};
	},

	// Action handlers
	onCreateWidget(widgetInfo) {
		History.pushModal(this.props.location, '/home/widget', OverlayConstants.HOME_WIDGET_MODAL, { 
			widgetInfo,
			settings: {
				name: widgetInfo.name,
			},
			onSave: settings => this.onSaveWidget(generateId(widgetInfo.typeId), settings, widgetInfo),
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
		BrowserUtils.removeLocalProperty(idToSettingKey(id));

		 this.setState({
			layout: reject(this.state.layout, { i: id })
		 });
	},


	// Update existing widget settings or add a new one in the layout (widgetInfo must be provided for new widgets)
	onSaveWidget(id, settings, widgetInfo) {
		saveSettings(id, settings);

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

	// Grid event handlers
  // We're using the cols coming back from this to calculate where to add new items.
	onBreakpointChange(breakpoint, cols) {
		this.setState({
			breakpoint: breakpoint,
			cols: cols
		});
	},

	onLayoutChange(layout) {
		BrowserUtils.saveLocalProperty(LAYOUT_STORAGE_KEY, {
			version: UI_VERSION,
			items: layout,
		});

		this.setState({
			layout
		});

		console.log('New layout', layout);
	},


	// Convert a layout entry to a component
	mapWidget(layoutItem) {
		const widgetInfo = getWidgetInfoById(layoutItem.i);
		invariant(widgetInfo, 'Widget info missing');
		if (!widgetInfo) {
			return null;
		}

		const Component = widgetInfo.component;
		const settings = parseSettings(layoutItem.i);

		return (
			<Widget
				key={ layoutItem.i }
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
					{ this.state.layout
							.map(this.mapWidget)
							.filter(widget => widget) }
				</ResponsiveReactGridLayout>
			</div>
		);
	}
});

export default Home;