import React from 'react';

import ValueFormat from 'utils/ValueFormat';

import { DownloadMenu } from 'components/menu/DropdownMenu';
import { DupeEnum } from 'constants/DupeConstants';


const formatText = (text) => text ? text : '(unknown)';

const GridRow = ({ title, text }) => (
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

const DupePaths = ({ paths }) => (
  <div className="dupe-paths">
    { paths.map(path => (
      <div key={ path } className="path">
        { path }
      </div>
    )) }
  </div>
);

const ResultInfoGrid = ({ parentResult }) => (
  <div className="ui segment">
    <div className="ui grid stackable two column">
      <GridRow title="Content/Type" text={ parentResult.type.str }/>
      <GridRow title="Size" text={ ValueFormat.formatSize(parentResult.size) }/>
      <GridRow title="Last modified" text={ ValueFormat.formatRelativeTime(parentResult.time) }/>
      { parentResult.type.id === 'file' && <GridRow title="TTH" text={ parentResult.tth }/> }
      { !!parentResult.dupe && <GridRow title="Dupe type" text={ DupeStrings[parentResult.dupe.id] }/> }
      { !!parentResult.dupe && <GridRow title="Dupe paths" text={ <DupePaths paths={ parentResult.dupe.paths }/> }/> }
    </div>

    <DownloadMenu 
      caption="Actions..."
      button={ true }
      user={ parentResult.users.user }
      itemInfoGetter={ _ => parentResult }
    />
  </div>
);

export default ResultInfoGrid;