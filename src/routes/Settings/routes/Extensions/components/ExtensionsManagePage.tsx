import * as React from 'react';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from 'decorators/DataProviderDecorator';

import ExtensionConstants from 'constants/ExtensionConstants';

import EngineStatusMessage from 'routes/Settings/routes/Extensions/components/EngineStatusMessage';
import ExtensionsConfigureDialog from 'routes/Settings/routes/Extensions/components/ExtensionsConfigureDialog';

import { Link } from 'react-router-dom';
import Message from 'components/semantic/Message';
import LocalExtension from 'routes/Settings/routes/Extensions/components/LocalExtension';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { SettingPageProps } from 'routes/Settings/types';
import { Trans } from 'react-i18next';
import IconConstants from 'constants/IconConstants';

interface ExtensionsManagePageProps extends SettingPageProps {}

interface ExtensionsManagePageDataProps extends DataProviderDecoratorChildProps {
  installedPackages: API.Extension[];
}

const getItem = (extension: API.Extension, moduleT: UI.ModuleTranslator) => {
  return (
    <LocalExtension key={extension.name} installedPackage={extension} moduleT={moduleT} />
  );
};

const ExtensionsManagePage: React.FC<
  ExtensionsManagePageProps & ExtensionsManagePageDataProps
> = ({ installedPackages, moduleT }) => {
  if (installedPackages.length === 0) {
    const defaults =
      'No installed extensions were found. \
New extensions can be installed from the <url>Extension catalog</url> page.';
    return (
      <Message
        description={
          <Trans
            i18nKey={moduleT.toI18nKey('noInstalledExtensions')}
            defaults={defaults}
            components={{
              url: <Link to="/settings/extensions/packages" />,
            }}
          />
        }
        icon={IconConstants.INFO}
      />
    );
  }

  return (
    <div className="extension-layout">
      <EngineStatusMessage moduleT={moduleT} />
      <div className="ui divider" />
      <div className="ui divided items">
        {installedPackages.map((p) => getItem(p, moduleT))}
      </div>
      <ExtensionsConfigureDialog />
    </div>
  );
};

export default DataProviderDecorator<
  ExtensionsManagePageProps,
  ExtensionsManagePageDataProps
>(ExtensionsManagePage, {
  urls: {
    installedPackages: ExtensionConstants.EXTENSIONS_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData }) => {
    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.ADDED, () =>
      refetchData(),
    );
    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.REMOVED, () =>
      refetchData(),
    );
    addSocketListener(ExtensionConstants.MODULE_URL, ExtensionConstants.UPDATED, () =>
      refetchData(),
    );
  },
});
