import React from 'react';

import { formatRelativeTime, formatSize } from 'utils/ValueFormat';

import SearchActions from 'actions/SearchActions';
import { DownloadMenu } from 'components/menu/DropdownMenu';
import { DupeEnum } from 'constants/DupeConstants';

import * as API from 'types/api';


const formatText = (text: React.ReactNode) => text ? text : '(unknown)';

const GridRow: React.SFC<{ title: string; text: React.ReactNode; }> = ({ title, text }) => (
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
  [DupeEnum.NONE]: 'None',
  [DupeEnum.SHARE_PARTIAL]: 'Share (partial)',
  [DupeEnum.SHARE_FULL]: 'Share (full)',
  [DupeEnum.QUEUE_PARTIAL]: 'Queue (partial)',
  [DupeEnum.QUEUE_FULL]: 'Queue (full)',
  [DupeEnum.FINISHED_PARTIAL]: 'Finished (partial)',
  [DupeEnum.FINISHED_FULL]: 'Finished (full)',
  [DupeEnum.SHARE_QUEUE]: 'Share and queue',
};

const DupePaths: React.SFC<{ paths: string[] }> = ({ paths }) => (
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

const ResultInfoGrid: React.SFC<ResultInfoGridProps> = ({ parentResult }) => (
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