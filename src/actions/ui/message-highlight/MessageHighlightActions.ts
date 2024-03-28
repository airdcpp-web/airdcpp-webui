import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';

import SearchActions from 'actions/reflux/SearchActions';

import { hasCopySupport } from 'utils/BrowserUtils';
import { makeTextMagnetLink } from 'utils/MagnetUtils';

export type HighlightItemInfo = Pick<API.MessageHighlight, 'text'> & {
  id: number;
  magnet?: UI.TextMagnet;
};

const handleSearch: UI.ActionHandler<HighlightItemInfo> = ({
  data,
  location,
  navigate,
}) => {
  return SearchActions.search(
    {
      name: data.magnet ? data.magnet.searchString : data.text,
    },
    location,
    navigate,
  );
};

const handleCopy: UI.ActionHandler<HighlightItemInfo> = ({ data }) => {
  const text = data.magnet ? makeTextMagnetLink(data.magnet) : data.text;
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
