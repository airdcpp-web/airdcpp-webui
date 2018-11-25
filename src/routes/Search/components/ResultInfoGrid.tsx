import React from 'react';

import { formatRelativeTime, formatSize } from 'utils/ValueFormat';

import SearchActions from 'actions/SearchActions';
import { DownloadMenu } from 'components/menu';
//import { DupeEnum } from 'constants/DupeConstants';

import * as API from 'types/api';


const formatText = (text: React.ReactNode) => text ? text : '(unknown)';

const GridRow: React.FC<{ title: string; text: React.ReactNode; }> = ({ title, text }) => (
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
}

const ResultInfoGrid: React.FC<ResultInfoGridProps> = ({ parentResult }) => (
  <div className="ui segment">
    <div className="ui grid stackable two column">
      <GridRow title="Content/Type" text={ parentResult.type.str }/>
      <GridRow title="Size" text={ formatSize(parentResult.size) }/>
      <GridRow title="Last modified" text={ formatRelativeTime(parentResult.time) }/>
      { parentResult.type.id === 'file' && <GridRow title="TTH" text={ parentResult.tth }/> }
      { !!parentResult.dupe && <GridRow title="Dupe type" text={ DupeStrings[parentResult.dupe.id] }/> }
      { !!parentResult.dupe && <GridRow title="Dupe paths" text={ <DupePaths paths={ parentResult.dupe.paths }/> }/> }
    </div>

    <DownloadMenu 
      caption="Actions..."
      button={ true }
      user={ parentResult.users.user }
      itemInfoGetter={ () => parentResult }
      downloadHandler={ SearchActions.download }
    />
  </div>
);

export default ResultInfoGrid;