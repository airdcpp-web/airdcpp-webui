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
  const value = limit ? formatSpeed(limit * 1024) : widgetT('disabled', 'Disabled');
  if (!LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT)) {
    return <span>{ value }</span>;
  }

  return (
    <Popup 
      triggerClassName="limit" 
      className="limiter" 
      trigger={ value }
    >
      <LimiterConfig
        limit={ limit }
        settingKey={ settingKey }
      />
    </Popup>
  );
};


interface StatColumnProps extends Pick<UI.WidgetProps, 'widgetT'> {
  stats: API.TransferStats;
}

const StatColumn: React.FC<StatColumnProps> = ({ stats, widgetT }) => (
  <div className="ui list info tiny stats">
    <ListItem header={ widgetT('downloads', 'Downloads') } description={ stats.downloads }/>
    <ListItem header={ widgetT('uploads', 'Uploads') } description={ stats.uploads }/>
    <div className="section-separator"/>
    <ListItem header={ widgetT('downloaded', 'Downloaded') } description={ formatSize(stats.session_downloaded) }/>
    <ListItem header={ widgetT('uploaded', 'Uploaded') } description={ formatSize(stats.session_uploaded) }/>
    <div className="section-separator"/>
    <ListItem 
      header={ widgetT('downloadLimit', 'Download limit') } 
      description={ <LimiterValue widgetT={ widgetT } limit={ stats.limit_down } settingKey="download_limit_main"/> }
    />
    <ListItem 
      header={ widgetT('uploadLimit', 'Upload limit') }
      description={ <LimiterValue widgetT={ widgetT } limit={ stats.limit_up } settingKey="upload_limit_main"/> }
    />
  </div>
);

export default StatColumn;