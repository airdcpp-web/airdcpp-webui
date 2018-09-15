import React from 'react';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import ExtensionConstants from 'constants/ExtensionConstants';

import EngineStatusMessage from 'routes/Settings/routes/Extensions/components/EngineStatusMessage';
import ExtensionsConfigureDialog from 'routes/Settings/routes/Extensions/components/ExtensionsConfigureDialog';

import { Link } from 'react-router-dom';
import Message from 'components/semantic/Message';
import LocalExtension from 'routes/Settings/routes/Extensions/components/LocalExtension';


interface ExtensionsManagePageProps {

}

interface ExtensionsManagePageDataProps extends DataProviderDecoratorChildProps {
  installedPackages: API.Extension[];
}

class ExtensionsManagePage extends React.Component<ExtensionsManagePageProps & ExtensionsManagePageDataProps> {
  static displayName = 'ExtensionsManagePage';

  getItem = (extension: API.Extension) => {
    return (
      <LocalExtension 
        key={ extension.name } 
        installedPackage={ extension } 
      />
    );
  }

  render() {
    const { installedPackages } = this.props;
    if (installedPackages.length === 0) {
      return (
        <Message 
          description={
            <span>
              No installed extensions were found. New extensions 
              can be installed from the <Link to="/settings/extensions/packages">Extension catalog</Link> page.
            </span>
          }
          icon="blue info"
        />
      );
    } 

    return (
      <div className="extension-layout">
        <EngineStatusMessage/>
        <div className="ui divider"/>
        <div className="ui divided items">
          { installedPackages.map(this.getItem) }
        </div>
        <ExtensionsConfigureDialog/>
      </div>
    );
  }
}

export default DataProviderDecorator(ExtensionsManagePage, {
  urls: {
    installedPackages: ExtensionConstants.EXTENSIONS_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.ADDED, () => refetchData());
    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.REMOVED, () => refetchData());
    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.UPDATED, () => refetchData());
  },
});
