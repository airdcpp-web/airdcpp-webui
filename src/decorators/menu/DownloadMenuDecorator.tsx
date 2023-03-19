//import PropTypes from 'prop-types';
import * as React from 'react';

import classNames from 'classnames';
import DownloadableItemActions from 'actions/ui/DownloadableItemActions';

import * as UI from 'types/ui';
import { ActionMenuDecoratorProps } from './ActionMenuDecorator';

export interface DownloadMenuDecoratorProps<ItemDataT extends UI.DownloadableItemInfo>
  extends Omit<ActionMenuDecoratorProps<ItemDataT>, 'actions' | 'itemData' | 'caption'>,
    Pick<UI.DownloadableItemData<ItemDataT>, 'session' | 'user'> {
  itemInfoGetter: () => ItemDataT;
  downloadHandler: UI.DownloadHandler<ItemDataT>;
  caption: React.ReactNode;
  className?: string;
}

type DownloadMenuDecoratorChildProps<ItemDataT extends UI.DownloadableItemInfo> =
  ActionMenuDecoratorProps<UI.DownloadableItemData<ItemDataT>>;

export default function <DropdownPropsT, ItemDataT extends UI.DownloadableItemInfo>(
  Component: React.ComponentType<
    DownloadMenuDecoratorChildProps<ItemDataT> & DropdownPropsT
  >
) {
  class DownloadMenu extends React.PureComponent<
    DownloadMenuDecoratorProps<ItemDataT> & DropdownPropsT
  > {
    /*static propTypes = {

      // Target user
      user: PropTypes.object.isRequired,
  
      // Context-specific item data getter
      itemInfoGetter: PropTypes.func.isRequired,
  
      // Context-specific item data getter
      downloadHandler: PropTypes.func.isRequired,
    };*/

    itemData: UI.DownloadableItemData<ItemDataT>;
    constructor(props: DownloadMenuDecoratorProps<ItemDataT> & DropdownPropsT) {
      super(props);

      this.itemData = {
        handler: props.downloadHandler,
      } as UI.DownloadableItemData<ItemDataT>;

      // Since table cells are recycled, the same menu can be re-used for different items
      // as it's not necessarily re-rendered due to performance reasons
      // Use getters so that we get data for the current cell
      Object.defineProperty(this.itemData, 'id', {
        get: () => {
          return this.props.itemInfoGetter().id;
        },
      });

      Object.defineProperty(this.itemData, 'session', {
        get: () => {
          return this.props.session;
        },
      });

      Object.defineProperty(this.itemData, 'user', {
        get: () => {
          return this.props.user;
        },
      });

      Object.defineProperty(this.itemData, 'itemInfo', {
        get: () => {
          return this.props.itemInfoGetter();
        },
      });
    }

    itemDataGetter = () => {
      return this.itemData;
    };

    render() {
      const { caption, className } = this.props;

      return (
        <Component
          {...this.props}
          className={classNames('download', className)}
          caption={caption}
          actions={DownloadableItemActions}
          itemData={this.itemDataGetter}
        />
      );
    }
  }

  return DownloadMenu;
}
