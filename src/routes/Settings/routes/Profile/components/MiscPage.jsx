import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';

import LoginStore from 'stores/LoginStore';

import '../style.css';


const MiscPage = React.createClass({
	onFieldSetting(id, fieldOptions, formValue) {
		if (id === 'nmdc_encoding') {
			fieldOptions['help'] = (
				<div>
					Encoding setting is only used in NMDC hub. ADC hubs will always use UTF-8 encoding.
					<br/>
					<br/>
					<div>
						Commonly used values:
						<ul>
							<li>Central Europe: cp1250</li>
							<li>Cyrillic: cp1251</li>
							<li>Western_Europe: cp1252</li>
							<li>Greek: cp1253</li>
							<li>Turkish: cp1254</li>
							<li>Hebrew: cp1256</li>
						</ul>
					</div>
				</div>
			);
		}
	},

	render() {
		const Entry = [
			'auto_follow_redirects',
			'disconnect_offline_users',
			'disconnect_hubs_noreg',
			'min_search_interval',
		];

		// The locale-specific system encoding is used on Windows by default
		// while other system use UTF-8
		if (LoginStore.systemInfo.platform !== 'windows') {
			Entry.push('nmdc_encoding');
		}

		return (
			<div>
				<RemoteSettingForm
					{ ...this.props }
					keys={ Entry }
					onFieldSetting={ this.onFieldSetting }
				/>
			</div>
		);
	}
});

export default MiscPage;