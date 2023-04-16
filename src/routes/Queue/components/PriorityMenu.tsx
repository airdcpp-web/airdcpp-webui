import PropTypes from 'prop-types';
import { Component } from 'react';
import isEqual from 'lodash/isEqual';

import { PriorityEnum } from 'constants/PriorityConstants';

import TableDropdown, { DropdownCloseHandler } from 'components/semantic/TableDropdown';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';
import { runBackgroundSocketAction } from 'utils/ActionUtils';
import { EmptyDropdownCaption } from 'components/semantic/EmptyDropdown';
import { buildMenu } from 'components/action-menu/builder/slidingMenuBuilder';

interface PriorityMenuProps {
  itemPrio: API.QueuePriority;
  item: API.QueueItemBase;
  prioAction: (item: API.QueueItemBase, priority: API.QueuePriorityEnum) => Promise<any>;
  t: UI.TranslateF;
}

class PriorityMenu extends Component<PriorityMenuProps> {
  static propTypes = {
    /**
     * Priority object
     */
    itemPrio: PropTypes.object.isRequired,

    /**
     * Item with priority properties
     */
    item: PropTypes.object.isRequired,

    prioAction: PropTypes.func.isRequired,
  };

  setPriority = (priorityId: API.QueuePriorityEnum) => {
    const { item, prioAction, t } = this.props;
    return runBackgroundSocketAction(() => prioAction(item, priorityId), t);
  };

  setAutoPriority = () => {
    this.setPriority(API.QueuePriorityEnum.DEFAULT);
  };

  shouldComponentUpdate(nextProps: PriorityMenuProps) {
    return !isEqual(nextProps.item.priority, this.props.item.priority);
  }

  getPriorityListItem = (
    priority: Omit<API.QueuePriority, 'auto'>,
    t: UI.TranslateF
  ): UI.ActionMenuItem => {
    const currentPrio = this.props.item.priority.id;
    return {
      id: priority.id.toString(),
      item: {
        active: currentPrio === priority.id,
        onClick: () => {
          this.setPriority(priority.id);
        },
        children: translate(priority.str, t, UI.Modules.QUEUE),
      },
    };
  };

  getChildren = (onClose: DropdownCloseHandler) => {
    const { t } = this.props;

    const children = Object.keys(PriorityEnum)
      .map(Number)
      .map((prioKey) =>
        this.getPriorityListItem(PriorityEnum[prioKey as keyof typeof PriorityEnum], t)
      );

    children.push({ id: 'divider' });
    children.push({
      id: 'auto',
      item: {
        active: this.props.itemPrio.auto,
        onClick: () => {
          this.setPriority(API.QueuePriorityEnum.DEFAULT);
        },
        children: translate('Auto', t, UI.Modules.QUEUE),
      },
    });

    return buildMenu(children, onClose);
  };

  render() {
    const { itemPrio, t } = this.props;
    let caption = translate(
      PriorityEnum[itemPrio.id as keyof typeof PriorityEnum].str,
      t,
      UI.Modules.QUEUE
    );
    if (itemPrio.auto) {
      caption += ` (${translate('Auto', t, UI.Modules.QUEUE).toLocaleLowerCase()})`;
    }

    if (!LoginStore.hasAccess(API.AccessEnum.QUEUE_EDIT)) {
      return <EmptyDropdownCaption caption={caption} />;
    }

    return (
      <TableDropdown caption={caption} className="priority-menu">
        {this.getChildren}
      </TableDropdown>
    );
  }
}

export default PriorityMenu;
