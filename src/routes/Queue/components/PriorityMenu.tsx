import PropTypes from 'prop-types';
import { Component } from 'react';
import isEqual from 'lodash/isEqual';

import { PriorityEnum } from 'constants/PriorityConstants';

import TableDropdown, { DropdownCloseHandler } from 'components/semantic/TableDropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';
import EmptyDropdown from 'components/semantic/EmptyDropdown';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translate } from 'utils/TranslationUtils';
import { runBackgroundSocketAction } from 'utils/ActionUtils';


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
    return runBackgroundSocketAction(
      () => prioAction(item, priorityId),
      t
    );
  }

  setAutoPriority = () => {
    this.setPriority(API.QueuePriorityEnum.DEFAULT);
  }

  shouldComponentUpdate(nextProps: PriorityMenuProps) {
    return !isEqual(nextProps.item.priority, this.props.item.priority);
  }

  getPriorityListItem = (priority: API.QueuePriority, t: UI.TranslateF, onClose: DropdownCloseHandler) => {
    const currentPrio = this.props.item.priority.id;
    return (
      <MenuItemLink 
        key={ priority.id }
        active={ currentPrio === priority.id } 
        onClick={ () => {
          this.setPriority(priority.id);
          onClose();
        }}
      >
        { translate(priority.str, t, UI.Modules.QUEUE) }
      </MenuItemLink>
    );
  }

  getChildren = (onClose: DropdownCloseHandler) => {
    const { t } = this.props;

    let children = Object.keys(PriorityEnum)
      .map(prioKey => this.getPriorityListItem(PriorityEnum[prioKey], t, onClose));

    children.push(<div key="divider" className="ui divider"/>);
    children.push(
      <MenuItemLink 
        key="auto"
        active={ this.props.itemPrio.auto } 
        onClick={ () => {
          this.setPriority(API.QueuePriorityEnum.DEFAULT);
          onClose();
        } }
      >
        { translate('Auto', t, UI.Modules.QUEUE) }
      </MenuItemLink>
    );

    return children;
  }

  render() {
    const { itemPrio, t } = this.props;
    let caption = translate(PriorityEnum[itemPrio.id].str, t, UI.Modules.QUEUE);
    if (itemPrio.auto) {
      caption += ` (${translate('Auto', t, UI.Modules.QUEUE).toLocaleLowerCase()})`;
    }

    if (!LoginStore.hasAccess(API.AccessEnum.QUEUE_EDIT)) {
      return (
        <EmptyDropdown
          caption={ caption }
        />
      );
    }

    return (
      <TableDropdown 
        caption={ caption } 
        className="priority-menu"
      >
        { this.getChildren }
      </TableDropdown>
    );
  }
}

export default PriorityMenu;