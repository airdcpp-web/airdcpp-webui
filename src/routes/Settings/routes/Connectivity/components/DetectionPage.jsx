import React from 'react';

import DetectPanel from './DetectPanel';

import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';


const DetectionPage = React.createClass({
	mixins: [ SettingPageMixin() ],

	render() {
		return (
			<div>
				<DetectPanel/>
			</div>
		);
	}
});

export default DetectionPage;