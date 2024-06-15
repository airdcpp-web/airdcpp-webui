import * as React from 'react';

import classNames from 'classnames';

import * as UI from 'types/ui';
import { ActionMenuDecoratorProps } from './ActionMenuDecorator';
import { DownloadableItemActionMenu } from 'actions/ui/downloadable-item';

export interface DownloadMenuDecoratorProps<
  ItemDataT extends UI.DownloadableItemInfo,
  EntityT extends UI.SessionItemBase,
> extends Omit<
      ActionMenuDecoratorProps<ItemDataT, EntityT>,
      'actions' | 'itemData' | 'caption'
    >,
    Pick<UI.DownloadableItemData<ItemDataT>, 'entity' | 'user'> {
  itemInfoGetter: () => ItemDataT;
  entity: EntityT;
  downloadHandler: UI.DownloadHandler<ItemDataT>;
  caption: React.ReactNode;
  className?: string;
}

type DownloadMenuDecoratorChildProps<
  ItemDataT extends UI.DownloadableItemInfo,
  EntityT extends UI.SessionItemBase,
> = ActionMenuDecoratorProps<UI.DownloadableItemData<ItemDataT>, EntityT>;

export default function <
  DropdownPropsT,
  ItemDataT extends UI.DownloadableItemInfo,
  EntityT extends UI.SessionItemBase,
>(
  Component: React.ComponentType<
    DownloadMenuDecoratorChildProps<ItemDataT, EntityT> & DropdownPropsT
  >,
) {
  class DownloadMenu extends React.PureComponent<
    DownloadMenuDecoratorProps<ItemDataT, EntityT> & DropdownPropsT
  > {
    itemData: UI.DownloadableItemData<ItemDataT>;
    constructor(props: DownloadMenuDecoratorProps<ItemDataT, EntityT> & DropdownPropsT) {
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

      Object.defineProperty(this.itemData, 'entity', {
        get: () => {
          return this.props.entity;
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
          actions={DownloadableItemActionMenu}
          itemData={this.itemDataGetter}
          // entity={entity as EntityT}
        />
      );
    }
  }

  return DownloadMenu;
}
