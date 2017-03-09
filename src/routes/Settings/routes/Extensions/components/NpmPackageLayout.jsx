import React from 'react';

import Extension from './Extension';
import ExtensionConstants from 'constants/ExtensionConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';

import 'semantic-ui/components/item.min.css';


const NpmPackageLayout = React.createClass({
	getItem(npmPackage) {
		const installedPackage = this.props.installedPackages.find(installedPackage => installedPackage.name === npmPackage.name);
		return (
			<Extension 
				key={ npmPackage.name } 
				npmPackage={ npmPackage } 
				installedPackage={ installedPackage }
			/>
		);
	},

	render() {
		const { packageCatalog, } = this.props;
		return (
			<div className="extension-layout">
				<div className="ui divider"/>
				{ packageCatalog.length > 0 && (
					<div className="ui divided items">
						{ packageCatalog.map(data => this.getItem(data.package)) }
					</div>
				) }
			</div>
		);
	}
});

export default DataProviderDecorator(NpmPackageLayout, {
	urls: {
		installedPackages: ExtensionConstants.EXTENSIONS_URL,
		packageCatalog: () => $.getJSON(ExtensionConstants.NPM_PACKAGES_URL),
	},
	dataConverters: {
		packageCatalog: ({ objects }) => objects,
	},
	onSocketConnected: (addSocketListener, { refetchData }) => {
		addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.ADDED, refetchData);
		addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.REMOVED, refetchData);
		addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.UPDATED, refetchData);

		addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.STARTED, refetchData);
		addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.STOPPED, refetchData);
	},
});
