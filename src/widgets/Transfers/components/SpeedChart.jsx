import React from 'react';

import { Charts, ChartContainer, ChartRow, YAxis, AreaChart, styler } from 'react-timeseries-charts';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import Measure from 'react-measure';


const upDownStyler = styler([
	{ 
		key: 'in',
		color: '#C8D5B8',
	}, {
		key: 'out', 
		color: 'lightcoral',
	}
]);

const SpeedChart = React.createClass({
	mixins: [ PureRenderMixin ],
	render() {
		const { trafficSeries, maxDownload, maxUpload } = this.props;
		return (
			<Measure>
				{ dimensions => (
					<div 
						ref={ c => this.c = c }
						className="graph"
					>
						<ChartContainer 
							timeRange={ trafficSeries.timerange() } 
							width={ dimensions.width }
						>
							<ChartRow 
								height={ dimensions.height - 25 }
							>
								<Charts>
									<AreaChart
										axis="traffic"
										series={ trafficSeries }
										columns={{ up: [ 'in' ], down: [ 'out' ] }}
										style={ upDownStyler }
									/>
								</Charts>
								<YAxis
									id="traffic"
									label="Traffic (bps)"
									min={ -maxUpload } max={ maxDownload }
									absolute={true}
									width="60"
									type="linear"
								/>
							</ChartRow>
						</ChartContainer>
					</div>
				) }
			</Measure>
		);
	}
});

export default SpeedChart;