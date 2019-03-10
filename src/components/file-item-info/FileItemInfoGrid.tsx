import React from 'react';

import { formatRelativeTime, formatSize } from 'utils/ValueFormat';

import { DownloadMenu } from 'components/menu';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Trans, useTranslation } from 'react-i18next';
import { toI18nKey, translate } from 'utils/TranslationUtils';

import './style.css';


const formatText = (text: React.ReactNode) => {
  if (!!text) {
    return text;
  }
  
  return (
    <Trans 
      i18nKey={ toI18nKey('unknown', UI.Modules.COMMON) }
    >
      (unknown)
    </Trans>
  );
};


interface GridRowProps {
  title: string; 
  text: React.ReactNode;
}

const GridRow: React.FC<GridRowProps> = ({ title, text }) => (
  <div className="ui row">
    <div className="three wide column title">
      <div className="ui tiny header">
        { title }
      </div>
    </div>
    <div className="thirteen wide column value">
      { formatText(text) }
    </div>
  </div>
);

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
}

const FileItemInfoGrid: React.FC<FileItemInfoGridProps> = ({ fileItem, user, downloadHandler }) => {
  const { t } = useTranslation();
  const gridT = (text: string) => {
    return translate(text, t, UI.Modules.COMMON);
  };

  return (
    <div className="fileitem info grid">
      <div className="ui segment">
        <div className="ui grid stackable two column">
          <GridRow 
            title={ gridT('Name') }
            text={ fileItem.name }
          />
          <GridRow 
            title={ gridT('Type/content') } 
            text={ fileItem.type.str }
          />
          <GridRow 
            title={ gridT('Size') } 
            text={ formatSize(fileItem.size, t) }
          />
          <GridRow 
            title={ gridT('Last modified') }
            text={ formatRelativeTime(fileItem.time) }
          />
          { fileItem.type.id === 'file' && (
            <GridRow 
              title={ gridT('TTH') } 
              text={ fileItem.tth }
            /> 
          )}
          { !!fileItem.dupe && (
            <GridRow 
              title={ gridT('Dupe type') }
              text={ gridT(DupeStrings[fileItem.dupe.id]) }
            /> 
          )}
          { !!fileItem.dupe && (
            <GridRow 
              title={ gridT('Dupe paths') }
              text={ <DupePaths paths={ fileItem.dupe.paths }/> }
            /> 
          )}
        </div>

        <DownloadMenu 
          caption={ gridT('Actions...') }
          button={ true }
          user={ user }
          itemInfoGetter={ () => fileItem }
          downloadHandler={ downloadHandler }
        />
      </div>
    </div>
  );
};

export { FileItemInfoGrid };