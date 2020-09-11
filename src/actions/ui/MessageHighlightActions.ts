'use strict';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import SearchActions from 'actions/reflux/SearchActions';
import { hasCopySupport } from 'utils/BrowserUtils';


type ItemInfo = Pick<API.MessageHighlight, 'text'>;

const handleSearch: UI.ActionHandler<ItemInfo> = ({ data, location }) => {
  return SearchActions.search(
    {
      name: data.text,
    }, 
    location
  );
};

const handleCopy: UI.ActionHandler<ItemInfo> = ({ data }) => {
  return navigator.clipboard.writeText(data.text);
};

const MessageHighlightActions: UI.ActionListType<ItemInfo> = {
  search: {
    access: API.AccessEnum.SEARCH, 
    displayName: 'Search', 
    icon: IconConstants.SEARCH,
    handler: handleSearch,
  },
  copy: {
    displayName: 'Copy',
    icon: IconConstants.COPY,
    filter: hasCopySupport,
    handler: handleCopy,
    notifications: {
      onSuccess: 'Text was copied to clipboard',
    }
  }
};


export default {
  moduleId: UI.Modules.COMMON,
  actions: MessageHighlightActions,
} as UI.ModuleActions<ItemInfo>;
