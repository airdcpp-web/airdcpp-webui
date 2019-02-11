import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash/isEqual';

import { PriorityEnum } from 'constants/PriorityConstants';

import TableDropdown from 'components/semantic/TableDropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';
import EmptyDropdown from 'components/semantic/EmptyDropdown';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import i18next from 'i18next';
import { translate } from 'utils/TranslationUtils';


interface PriorityMenuProps {
  itemPrio: API.QueuePriority;
  item: API.QueueItemBase;
  prioAction: (item: API.QueueItemBase, priority: API.QueuePriorityEnum) => void;
  t: i18next.TFunction;
}

class PriorityMenu extends React.Component<PriorityMenuProps> {
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
    this.props.prioAction(this.props.item, priorityId);
  }

  setAutoPriority = () => {
    this.setPriority(API.QueuePriorityEnum.DEFAULT);
  }

  shouldComponentUpdate(nextProps: PriorityMenuProps) {
    return !isEqual(nextProps.item.priority, this.props.item.priority);
  }

  getPriorityListItem = (priority: API.QueuePriority, t: i18next.TFunction) => {
    const currentPrio = this.props.item.priority.id;
    return (
      <MenuItemLink 
        key={ priority.id }
        active={ currentPrio === priority.id } 
        onClick={ () => this.setPriority(priority.id) }
      >
        { translate(priority.str, t, UI.Modules.QUEUE) }
      </MenuItemLink>
    );
  }

  getChildren = () => {
    const { t } = this.props;

    let children = Object.keys(PriorityEnum)
      .map(prioKey => this.getPriorityListItem(PriorityEnum[prioKey], t));

    children.push(<div key="divider" className="ui divider"/>);
    children.push(
      <MenuItemLink 
        key="auto"
        active={ this.props.itemPrio.auto } 
        onClick={ this.setAutoPriority }
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