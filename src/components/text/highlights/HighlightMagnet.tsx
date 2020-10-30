'use strict';;
import { useEffect } from 'react';
import * as React from 'react';
import cx from 'classnames';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { formatSize } from 'utils/ValueFormat';
import { TFunction } from 'i18next';
import { createFileBundle } from 'services/api/QueueApi';
import { dupeToStringType } from 'utils/TypeConvert';
import { Magnet, parseMagnetLink } from 'utils/MagnetUtils';
import { TableDownloadMenu } from 'components/menu';
import { TableDropdownProps } from 'components/semantic/TableDropdown';


const magnetDownloadHandler: UI.DownloadHandler<UI.DownloadableItemInfo> = (itemInfo, user, downloadData) => {
  return createFileBundle({
    ...itemInfo,
    ...downloadData,
    user,
  });
};


export interface HighlightMagnetProps extends Pick<TableDropdownProps, 'position'> {
  highlightId: number;
  text: string;
  contentType: API.FileContentType;
  dupe: API.Dupe | null;
  user: UI.DownloadSource | undefined;
  t: TFunction;
  menuProps: UI.MessageActionMenuData;
}

const formatMagnetCaption = (magnet: Magnet, t: TFunction) => {
  const { name, size } = magnet;

  let caption = name;
  if (!!size) {
    caption += ` (${formatSize(size, t)})`;
  }

  return caption;
};

export const HighlightMagnet: React.FC<HighlightMagnetProps> = ({
  text, dupe, user, contentType, menuProps, t, highlightId
}) => {
  const magnet = parseMagnetLink(text);
  if (!magnet) {
    return (
      <>
        { text }
      </>
    );
  }

  const downloadUser = !!user && 
    user.flags.indexOf('bot') === -1 && 
    user.flags.indexOf('hidden') === -1 ? user : undefined;


  const downloadData: UI.DownloadableItemInfo = {
    id: highlightId,
    ...magnet,
    type: {
      id: 'file',
      str: '',
      content_type: contentType,
    },
    dupe,
    tth: magnet.tth,
    path: undefined,
    time: undefined,
  };

  const { addDownload, boundary, ...other } = menuProps;
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
