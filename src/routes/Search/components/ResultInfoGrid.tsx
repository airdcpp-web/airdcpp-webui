import React from 'react';

import { formatRelativeTime, formatSize } from 'utils/ValueFormat';

import SearchActions from 'actions/SearchActions';
import { DownloadMenu } from 'components/menu';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { Trans } from 'react-i18next';
import { toI18nKey } from 'utils/TranslationUtils';


const formatText = (text: React.ReactNode) => {
  if (!!text) {
    return text;
  }
  
  return (
    <Trans 
      i18nKey={ toI18nKey('unknown', UI.Modules.SEARCH) }
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
    <div className="three wide column">
      <div className="ui tiny header">
        { title }
      </div>
    </div>
    <div className="thirteen wide column">
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

interface ResultInfoGridProps {
  parentResult: API.GroupedSearchResult;
  searchT: UI.ModuleTranslator;
}

const ResultInfoGrid: React.FC<ResultInfoGridProps> = ({ parentResult, searchT }) => {
  const { translate } = searchT;
  return (
    <div className="ui segment">
      <div className="ui grid stackable two column">
        <GridRow 
          title={ translate('Type/content') } 
          text={ parentResult.type.str }
        />
        <GridRow 
          title={ translate('Size') } 
          text={ formatSize(parentResult.size) }
        />
        <GridRow 
          title={ translate('Last modified') }
          text={ formatRelativeTime(parentResult.time) }
        />
        { parentResult.type.id === 'file' && (
          <GridRow 
            title={ translate('TTH') } 
            text={ parentResult.tth }
          /> 
        )}
        { !!parentResult.dupe && (
          <GridRow 
            title={ translate('Dupe type') }
            text={ translate(DupeStrings[parentResult.dupe.id]) }
          /> 
        )}
        { !!parentResult.dupe && (
          <GridRow 
            title={ translate('Dupe paths') }
            text={ <DupePaths paths={ parentResult.dupe.paths }/> }
          /> 
        )}
      </div>

      <DownloadMenu 
        caption={ translate('Actions...') }
        button={ true }
        user={ parentResult.users.user }
        itemInfoGetter={ () => parentResult }
        downloadHandler={ SearchActions.actions.download }
      />
    </div>
  );
};

export default ResultInfoGrid;