
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import SearchActions from 'actions/reflux/SearchActions';
import { hasCopySupport } from 'utils/BrowserUtils';


export type HighlightItemInfo = Pick<API.MessageHighlight, 'text'> & { id: number; };

const handleSearch: UI.ActionHandler<HighlightItemInfo> = ({ data, location }) => {
  return SearchActions.search(
    {
      name: data.text,
    }, 
    location
  );
};

const handleCopy: UI.ActionHandler<HighlightItemInfo> = ({ data }) => {
  return navigator.clipboard.writeText(data.text);
};

const MessageHighlightActions: UI.ActionListType<HighlightItemInfo> = {
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
} as UI.ModuleActions<HighlightItemInfo>;
