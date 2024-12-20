import { memo } from 'react';
import isEqual from 'lodash/isEqual';

import { PriorityEnum } from 'constants/PriorityConstants';

import TableDropdown, { DropdownCloseHandler } from 'components/semantic/TableDropdown';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import { EmptyDropdownCaption } from 'components/semantic/EmptyDropdown';
import { buildMenu } from 'components/action-menu/builder/slidingMenuBuilder';
import { useSession } from 'context/SessionContext';

interface PriorityMenuProps {
  // Priority object
  itemPrio: API.QueuePriority;

  // Item with priority properties
  item: API.QueueItemBase;

  prioAction: (item: API.QueueItemBase, priority: API.QueuePriorityEnum) => Promise<any>;
  t: UI.TranslateF;
}

const PriorityMenu: React.FC<PriorityMenuProps> = ({ item, itemPrio, prioAction, t }) => {
  const { hasAccess } = useSession();

  const setPriority = (priorityId: API.QueuePriorityEnum) => {
    return runBackgroundSocketAction(() => prioAction(item, priorityId), t);
  };

  const getPriorityListItem = (
    priority: Omit<API.QueuePriority, 'auto'>,
    t: UI.TranslateF,
  ): UI.ActionMenuItem => {
    const currentPrio = item.priority.id;
    return {
      id: priority.id.toString(),
      item: {
        active: currentPrio === priority.id,
        onClick: () => {
          setPriority(priority.id);
        },
        children: translate(priority.str, t, UI.Modules.QUEUE),
      },
    };
  };

  const getChildren = (onClose: DropdownCloseHandler) => {
    const children = Object.keys(PriorityEnum)
      .map(Number)
      .map((prioKey) =>
        getPriorityListItem(PriorityEnum[prioKey as keyof typeof PriorityEnum], t),
      );

    children.push({ id: 'divider' });
    children.push({
      id: 'auto',
      item: {
        active: itemPrio.auto,
        onClick: () => {
          setPriority(API.QueuePriorityEnum.DEFAULT);
        },
        children: translate('Auto', t, UI.Modules.QUEUE),
      },
    });

    return buildMenu(children, onClose);
  };

  let caption = translate(
    PriorityEnum[itemPrio.id as keyof typeof PriorityEnum].str,
    t,
    UI.Modules.QUEUE,
  );
  if (itemPrio.auto) {
    caption += ` (${translate('Auto', t, UI.Modules.QUEUE).toLocaleLowerCase()})`;
  }

  if (!hasAccess(API.AccessEnum.QUEUE_EDIT)) {
    return <EmptyDropdownCaption caption={caption} />;
  }

  return (
    <TableDropdown caption={caption} className="priority-menu">
      {getChildren}
    </TableDropdown>
  );
};

export default memo(PriorityMenu, (prevProps, nextProps) => {
  return isEqual(nextProps.item.priority, prevProps.item.priority);
});
