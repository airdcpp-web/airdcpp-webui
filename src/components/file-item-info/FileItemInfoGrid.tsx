import * as React from 'react';

import { useFormatter } from 'context/FormatterContext';

import { DownloadMenu } from 'components/action-menu';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import './style.css';
import { Row, Grid } from 'components/semantic/Grid';

const DupeStrings = {
  //[API.DupeEnum.NONE]: 'None',
  [API.DupeEnum.SHARE_PARTIAL]: 'Share (partial)',
  [API.DupeEnum.SHARE_FULL]: 'Share (full)',
  [API.DupeEnum.QUEUE_PARTIAL]: 'Queue (partial)',
  [API.DupeEnum.QUEUE_FULL]: 'Queue (full)',
  [API.DupeEnum.FINISHED_PARTIAL]: 'Finished (partial)',
  [API.DupeEnum.FINISHED_FULL]: 'Finished (full)',
  [API.DupeEnum.SHARE_QUEUE]: 'Share and queue',
  [API.DupeEnum.SHARE_FINISHED]: 'Share and finished',
  [API.DupeEnum.QUEUE_FINISHED]: 'Queue and finished',
  [API.DupeEnum.SHARE_QUEUE_FINISHED]: 'Share, queue and finished',
};

const DupePaths: React.FC<{ paths: string[] }> = ({ paths }) => (
  <div className="dupe-paths">
    {paths.map((path) => (
      <div key={path} className="path">
        {path}
      </div>
    ))}
  </div>
);

interface FileItemInfoGridProps {
  fileItem: UI.DownloadableItemInfo;
  user: API.HintedUser;
  downloadHandler: UI.DownloadHandler<UI.DownloadableItemInfo>;
  showPath?: boolean;
  session: UI.SessionItemBase;
}

const FileItemInfoGrid: React.FC<FileItemInfoGridProps> = ({
  session,
  fileItem,
  user,
  downloadHandler,
  showPath = true,
}) => {
  const { t } = useTranslation();
  const gridT = (text: string) => {
    return translate(text, t, UI.Modules.COMMON);
  };

  const { formatSize, formatRelativeTime } = useFormatter();
  return (
    <div className="ui fileitem info segment">
      <Grid columns="two" stackable={true}>
        <Row title={gridT('Name')} text={fileItem.name} />
        <Row title={gridT('Type/content')} text={fileItem.type.str} />
        <Row title={gridT('Size')} text={formatSize(fileItem.size, true)} />
        <Row
          title={gridT('Last modified')}
          text={formatRelativeTime(fileItem.time || 0)}
        />
        {fileItem.type.id === 'file' && <Row title={gridT('TTH')} text={fileItem.tth} />}
        {!!fileItem.dupe && (
          <Row title={gridT('Dupe type')} text={gridT(DupeStrings[fileItem.dupe.id])} />
        )}
        {!!fileItem.dupe && (
          <Row
            title={gridT('Dupe paths')}
            text={<DupePaths paths={fileItem.dupe.paths} />}
          />
        )}
        {showPath && <Row title={gridT('Path')} text={fileItem.path} />}
      </Grid>

      <DownloadMenu
        caption={gridT('Actions...')}
        button={true}
        user={user}
        itemInfoGetter={() => fileItem}
        downloadHandler={downloadHandler}
        contextElement=".ui.modal > .content"
        entity={session}
      />
    </div>
  );
};

export { FileItemInfoGrid };
