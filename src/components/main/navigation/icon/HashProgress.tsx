import React, { memo, useEffect } from 'react';

import HashConstants from 'constants/HashConstants';
import IconConstants from 'constants/IconConstants';

import Icon from 'components/semantic/Icon';
import DataProviderDecorator from 'decorators/DataProviderDecorator';

import * as API from 'types/api';

// import Popup from 'components/semantic/Popup';
// import { HashInfoLayout } from './HashInfoLayout';

import { useState } from 'react';
import { HashInfoDialog } from './HashInfoDialog';


import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


interface HashProgressProps {

}

interface HashProgressDataProps {
  stats: API.HashStats;
}

const getHashPercent = (stats: API.HashStats) => {
  const percent = (
    (0.5 * (stats.hash_files_added - stats.hash_files_left) / stats.hash_files_added) + 
    (0.5 * (stats.hash_bytes_added - stats.hash_bytes_left) / stats.hash_bytes_added)
  ) * 100;

  return percent;
};

const HashProgress = memo<HashProgressProps & HashProgressDataProps>(({ stats }) => {
  /*if (stats.hash_files_left === 0 && stats.hashers === 0) {
    return null;
  }

  return (
    <>
      <Popup
        triggerClassName="icon" 
        triggerProps={{
          style: {
            width: '25px',
            height: '25px',
            display: 'inline-flex'
          },
        }}
        trigger={(
          <CircularProgressbarWithChildren
            value={ getPercent(stats) }
            strokeWidth={ 7 }
            styles={buildStyles({
              pathColor: '#2185d0',
            })}
          >
            <Icon
              icon={ IconConstants.HASH }
              style={{
                maxHeight: '13px',
                maxWidth: '13px',
                margin: '0px'
              }}
              cornerIcon={ stats.pause_forced ? IconConstants.PAUSE : IconConstants.PLAY }
            />
          </CircularProgressbarWithChildren>
        )}
        position="top right"
        contentUpdateTrigger={ stats }
      >
        { hide => (
          <HashInfoLayout
            stats={ stats }
            // hide={ hide }
          />
        ) }
      </Popup>
    </>
  );*/

  const hasData = stats.hash_files_left > 0 || stats.hashers > 0;
  const [ dialogOpen, setDialogOpen ] = useState(false);

  useEffect(
    () => {
      if (!hasData && dialogOpen) {
        setDialogOpen(false);
      }
    },
    [ stats ]
  );

  return (
    <>
      { hasData && (
        <div 
          className="progress icon"
          style={{
            width: '25px',
            height: '25px',
            display: 'inline-flex'
          }}
        >
          <CircularProgressbarWithChildren
            value={ getHashPercent(stats) }
            strokeWidth={ 7 }
            styles={ buildStyles({
              pathColor: '#2185d0',
            }) }
          >
            <Icon
              icon={ IconConstants.HASH }
              style={{
                maxHeight: '13px',
                maxWidth: '13px',
                margin: '0px'
              }}
              cornerIcon={ stats.pause_forced ? IconConstants.PAUSE : IconConstants.PLAY }
              onClick={ () => setDialogOpen(true) }
            />
          </CircularProgressbarWithChildren>
        </div>
      )}
      { dialogOpen && (
        <HashInfoDialog
          stats={ stats }
          onClose={ () => setDialogOpen(false) }
        />
      ) }
    </>
  );
});

export default DataProviderDecorator<HashProgressProps, HashProgressDataProps>(HashProgress, {
  urls: {
    stats: HashConstants.STATS_URL,
  },
  onSocketConnected: (addSocketListener, { refetchData, mergeData }) => {
    addSocketListener(HashConstants.MODULE_URL, HashConstants.STATISTICS, (data: API.HashStats) => {
      mergeData({
        stats: data
      });
    });
  },
});