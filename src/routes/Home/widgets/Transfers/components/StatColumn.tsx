import * as React from 'react';

import { ListItem } from '@/components/semantic/List';

import { useFormatter } from '@/context/FormatterContext';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { AdjustableSpeedLimit } from '@/components/speed-limit';

interface StatColumnProps extends Pick<UI.WidgetProps, 'widgetT'> {
  stats: API.TransferStats;
}

const StatColumn: React.FC<StatColumnProps> = ({ stats, widgetT }) => {
  const { formatSize } = useFormatter();
  return (
    <div className="ui list info tiny stats">
      <ListItem header={widgetT.translate('Downloads')} description={stats.downloads} />
      <ListItem header={widgetT.translate('Uploads')} description={stats.uploads} />
      <div className="section-separator" />
      <ListItem
        header={widgetT.translate('Downloaded')}
        description={formatSize(stats.session_downloaded)}
      />
      <ListItem
        header={widgetT.translate('Uploaded')}
        description={formatSize(stats.session_uploaded)}
      />
      <div className="section-separator" />
      <ListItem
        header={widgetT.translate('Download limit')}
        description={
          <AdjustableSpeedLimit
            limit={stats.limit_down}
            unit="KiB"
            settingKey="download_limit_main"
          />
        }
      />
      <ListItem
        header={widgetT.translate('Upload limit')}
        description={
          <AdjustableSpeedLimit
            limit={stats.limit_up}
            unit="KiB"
            settingKey="upload_limit_main"
          />
        }
      />
    </div>
  );
};

export default StatColumn;
