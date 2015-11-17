'use strict';

import React from 'react';

import LoginStore from 'stores/LoginStore';

import Moment from 'moment';

import { Row } from './Grid';

//import Logo from '../../../../../../images/AirDCPlusPlus.png';

const AboutPage = React.createClass({
	render() {
		const uptime = Moment.unix(LoginStore.systemInfo.client_started).from(Moment());
		const buildDate = Moment(new Date(JSON.parse(UI_BUILD_DATE))).format('LLL');

		return (
				<div className="about-page">
					<div className="ui grid two column about-grid">
						<Row title="Application version" text={LoginStore.systemInfo.client_version}/>
						<Row title="Web UI version" text={UI_VERSION}/>
						<Row title="Web UI build date" text={buildDate}/>
						<Row title="Started" text={uptime}/>
					</div>
				</div>
		);
	},
});

export default AboutPage;
