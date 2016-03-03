import React from 'react';
import SettingForm from 'routes/Settings/components/SettingForm';
import SettingPageMixin from 'routes/Settings/mixins/SettingPageMixin';

import LoginStore from 'stores/LoginStore';
//import AutoSuggestField from 'components/form/AutoSuggestField';

import t from 'utils/tcomb-form';

import '../style.css';

const Entry = {
	auto_follow_redirects: t.Bool,
	disconnect_offline_users: t.Bool,
	disconnect_hubs_noreg: t.Bool,
};

const MiscPage = React.createClass({
	mixins: [ SettingPageMixin('form') ],
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
		let entry = Entry;

		// The locale-specific system encoding is used on Windows by default
		// while other system use UTF-8
		if (LoginStore.systemInfo.platform !== 'windows') {
			entry = Object.assign({}, entry, {
				nmdc_encoding: t.Str,
			});
		}

		return (
			<div className="misc-settings">
				<SettingForm
					ref="form"
					formItems={entry}
					onFieldSetting={this.onFieldSetting}
				/>
			</div>
		);
	}
});

export default MiscPage;