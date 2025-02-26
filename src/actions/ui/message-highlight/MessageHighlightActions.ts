import IconConstants from '@/constants/IconConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { hasCopySupport } from '@/utils/BrowserUtils';
import { makeTextMagnetLink } from '@/utils/MagnetUtils';
import { searchStringForeground } from '@/utils/SearchUtils';

export type HighlightItemInfo = Pick<API.MessageHighlight, 'text'> & {
  id: number;
  magnet?: UI.TextMagnet;
};

const handleSearch: UI.ActionHandler<HighlightItemInfo> = ({
  itemData,
  location,
  navigate,
}) => {
  return searchStringForeground(
    itemData.magnet ? itemData.magnet.searchString : itemData.text,
    location,
    navigate,
  );
};

const handleCopy: UI.ActionHandler<HighlightItemInfo> = ({ itemData }) => {
  const text = itemData.magnet ? makeTextMagnetLink(itemData.magnet) : itemData.text;
  return navigator.clipboard.writeText(text);
};

export const MessageHighlightSearchAction = {
  id: 'search',
  access: API.AccessEnum.SEARCH,
  displayName: 'Search',
  icon: IconConstants.SEARCH,
  handler: handleSearch,
};

export const MessageHighlightCopyAction = {
  id: 'copy',
  displayName: 'Copy',
  icon: IconConstants.COPY,
  filter: hasCopySupport,
  handler: handleCopy,
  notifications: {
    onSuccess: 'Text was copied to clipboard',
  },
};

const MessageHighlightActions: UI.ActionListType<HighlightItemInfo> = {
  search: MessageHighlightSearchAction,
  copy: MessageHighlightCopyAction,
};

export const MessageHighlightActionModule = {
  moduleId: UI.Modules.COMMON,
};

export const MessageHighlightActionMenu = {
  moduleData: MessageHighlightActionModule,
  actions: MessageHighlightActions,
} as UI.ModuleActions<HighlightItemInfo>;
