import React from 'react';

import { ListItem } from 'components/semantic/List';
import LimiterConfig from 'components/LimiterConfig';
import Popup from 'components/semantic/Popup';

import { formatSize, formatSpeed } from 'utils/ValueFormat';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface LimiterValueProps extends Pick<UI.WidgetProps, 'widgetT'> {
  limit: number;
  settingKey: string;
}

const LimiterValue: React.FC<LimiterValueProps> = ({ limit, settingKey, widgetT }) => {
  const value = limit ? formatSpeed(limit * 1024, widgetT.plainT) : widgetT.translate('Disabled');
  if (!LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT)) {
    return <span>{ value }</span>;
  }

  return (
    <Popup 
      triggerClassName="limit" 
      className="limiter" 
      trigger={ value }
    >
      { hide => (
        <LimiterConfig
          limit={ limit }
          settingKey={ settingKey }
          hide={ hide }
        />
      ) }
    </Popup>
  );
};


interface StatColumnProps extends Pick<UI.WidgetProps, 'widgetT'> {
  stats: API.TransferStats;
}

const StatColumn: React.FC<StatColumnProps> = ({ stats, widgetT }) => (
  <div className="ui list info tiny stats">
    <ListItem header={ widgetT.translate('Downloads') } description={ stats.downloads }/>
    <ListItem header={ widgetT.translate('Uploads') } description={ stats.uploads }/>
    <div className="section-separator"/>
    <ListItem 
      header={ widgetT.translate('Downloaded') } 
      description={ formatSize(stats.session_downloaded, widgetT.plainT) }
    />
    <ListItem 
      header={ widgetT.translate('Uploaded') } 
      description={ formatSize(stats.session_uploaded, widgetT.plainT) }
    />
    <div className="section-separator"/>
    <ListItem 
      header={ widgetT.translate('Download limit') } 
      description={ <LimiterValue widgetT={ widgetT } limit={ stats.limit_down } settingKey="download_limit_main"/> }
    />
    <ListItem 
      header={ widgetT.translate('Upload limit') }
      description={ <LimiterValue widgetT={ widgetT } limit={ stats.limit_up } settingKey="upload_limit_main"/> }
    />
  </div>
);

export default StatColumn;