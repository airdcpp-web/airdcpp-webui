import { useEffect } from 'react';
import * as React from 'react';
import cx from 'classnames';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { createFileBundle } from 'services/api/QueueApi';
import { dupeToStringType } from 'utils/TypeConvert';
import { formatMagnetCaption } from 'utils/MagnetUtils';
import { TableDownloadMenu } from 'components/menu';
import { TableDropdownProps } from 'components/semantic/TableDropdown';


const magnetDownloadHandler: UI.DownloadHandler<UI.DownloadableItemInfo> = (itemInfo, user, downloadData) => {
  return createFileBundle({
    ...itemInfo,
    ...downloadData,
    user,
  });
};


export interface HighlightHashMagnetProps extends Pick<TableDropdownProps, 'position'> {
  highlightId: number;
  contentType: API.FileContentType | null;
  dupe: API.Dupe | null;
  user: UI.DownloadSource | undefined;
  t: UI.TranslateF;
  menuProps: UI.MessageActionMenuData;
  magnet: UI.HashMagnet;
}

export const HighlightHashMagnet: React.FC<HighlightHashMagnetProps> = ({
  dupe, user, contentType, menuProps, t, highlightId, magnet
}) => {
  const { addDownload, boundary, ...other } = menuProps;
  const downloadUser = !!user && 
    user.flags.indexOf('bot') === -1 && 
    user.flags.indexOf('hidden') === -1 ? user : undefined;


  const downloadData: UI.DownloadableItemInfo = {
    id: highlightId,
    type: {
      id: 'file',
      str: '',
      content_type: contentType!,
    },
    dupe,
    name: magnet.name,
    tth: magnet.tth!,
    size: magnet.size!,
    path: undefined,
    time: undefined,
  };

  useEffect(
    () => {    
      addDownload(highlightId, {
        downloadHandler: magnetDownloadHandler,
        itemDataGetter: () => Promise.resolve(downloadData),
        userGetter: () => downloadUser,
        session: undefined,
      });
    },
    []
  );

  // Use table dropdown to avoid issues with overflow and dupe coloring
  return (
    <TableDownloadMenu
      className={ cx('highlight magnet url link', dupeToStringType(dupe)) }
      caption={ formatMagnetCaption(magnet, t) }
      user={ downloadUser }
      itemInfoGetter={ () => downloadData }
      downloadHandler={ magnetDownloadHandler }
      triggerIcon={ null }
      session={ undefined }
      popupSettings={{
        boundary
      }}
      { ...other }
    />
  );
};
