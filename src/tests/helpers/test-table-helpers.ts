import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { orderBy } from 'lodash';
import { RequestSuccessResponse } from 'node_modules/airdcpp-apisocket/dist-es/types/api_internal';

type FireUpdate = (data: object) => void;

export const createMockTableManager = (sendUpdate: FireUpdate) => {
  let sortProperty: string | undefined;
  let sortAscending: boolean = false;
  let maxCount: number = 0;
  let rangeStart: number = 0;
  let items: UI.IdItemType[];

  const getUpdateItemCounts = () => ({
    total_items: items.length,
    matching_items: items.length,
    range_start: rangeStart,
  });

  const getItems = (start: number, count: number) => {
    let itemsToSend = items;
    if (sortProperty) {
      itemsToSend = orderBy(items, sortProperty, sortAscending ? 'asc' : 'desc');
    }

    if (maxCount) {
      itemsToSend = itemsToSend.slice(start, start + count);
    }

    return itemsToSend;
  };

  const sendItems = () => {
    const itemsToSend = getItems(rangeStart, maxCount);
    const updateData = {
      ...getUpdateItemCounts(),
      items: itemsToSend.map((item) => {
        const { id, ...properties } = item;
        return {
          id,
          properties,
        };
      }),
    };

    sendUpdate(updateData);
  };

  const handleSettings = ({ data }: RequestSuccessResponse) => {
    const settings = data as Partial<API.TableSettingRequest>;
    if (settings.max_count) {
      maxCount = settings.max_count;
    }

    if (settings.range_start) {
      rangeStart = settings.range_start;
    }

    if (settings.sort_property) {
      sortProperty = settings.sort_property;
    }

    if (settings.sort_ascending) {
      sortAscending = settings.sort_ascending;
    }

    if (!settings.max_count && !settings.range_start) {
      sendUpdate(getUpdateItemCounts());
    } else {
      sendItems();
    }
  };

  const setItems = (newItems: UI.IdItemType[]) => {
    items = newItems;
  };

  return {
    getItems,
    setItems,
    sendItems,

    handleSettings,
  };
};
