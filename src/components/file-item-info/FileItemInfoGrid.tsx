import React from 'react';

import { formatRelativeTime, formatSize } from 'utils/ValueFormat';

import { DownloadMenu } from 'components/menu';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { useTranslation } from 'react-i18next';
import { translate } from 'utils/TranslationUtils';

import './style.css';
import { Row } from 'components/semantic/Grid';


const DupeStrings = {
  //[API.DupeEnum.NONE]: 'None',
  [API.DupeEnum.SHARE_PARTIAL]: 'Share (partial)',
  [API.DupeEnum.SHARE_FULL]: 'Share (full)',
  [API.DupeEnum.QUEUE_PARTIAL]: 'Queue (partial)',
  [API.DupeEnum.QUEUE_FULL]: 'Queue (full)',
  [API.DupeEnum.FINISHED_PARTIAL]: 'Finished (partial)',
  [API.DupeEnum.FINISHED_FULL]: 'Finished (full)',
  [API.DupeEnum.SHARE_QUEUE]: 'Share and queue',
};

const DupePaths: React.FC<{ paths: string[] }> = ({ paths }) => (
  <div className="dupe-paths">
    { paths.map(path => (
      <div key={ path } className="path">
        { path }
      </div>
    )) }
  </div>
);

interface FileItemInfoGridProps {
  fileItem: UI.DownloadableItemInfo;
  user: API.HintedUser;
  downloadHandler: UI.DownloadHandler<UI.DownloadableItemInfo>;
  showPath?: boolean;
}

const FileItemInfoGrid: React.FC<FileItemInfoGridProps> = ({ fileItem, user, downloadHandler, showPath = true }) => {
  const { t } = useTranslation();
  const gridT = (text: string) => {
    return translate(text, t, UI.Modules.COMMON);
  };

  return (
    <div className="ui fileitem info segment">
      <div className="ui grid stackable two column">
        <Row 
          title={ gridT('Name') }
          text={ fileItem.name }
        />
        <Row 
          title={ gridT('Type/content') } 
          text={ fileItem.type.str }
        />
        <Row 
          title={ gridT('Size') } 
          text={ formatSize(fileItem.size, t, true) }
        />
        <Row 
          title={ gridT('Last modified') }
          text={ formatRelativeTime(fileItem.time) }
        />
        { fileItem.type.id === 'file' && (
          <Row 
            title={ gridT('TTH') } 
            text={ fileItem.tth }
          /> 
        )}
        { !!fileItem.dupe && (
          <Row 
            title={ gridT('Dupe type') }
            text={ gridT(DupeStrings[fileItem.dupe.id]) }
          /> 
        )}
        { !!fileItem.dupe && (
          <Row 
            title={ gridT('Dupe paths') }
            text={ <DupePaths paths={ fileItem.dupe.paths }/> }
          /> 
        )}
        { showPath && (
          <Row 
            title={ gridT('Path') }
            text={ fileItem.path }
          /> 
        )}
      </div>

      <DownloadMenu 
        caption={ gridT('Actions...') }
        button={ true }
        user={ user }
        itemInfoGetter={ () => fileItem }
        downloadHandler={ downloadHandler }
        contextElement=".ui.modal > .content"
      />
    </div>
  );
};

export { FileItemInfoGrid };