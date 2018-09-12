//import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import DownloadableItemActions from 'actions/DownloadableItemActions';
import { ActionMenuDecoratorProps } from 'decorators/menu/ActionMenuDecorator';


export type DownloadHandlerType = () => void;

interface DownloadMenuItemData {
  handler: DownloadHandlerType;
}

export interface DownloadMenuDecoratorProps {
  user: API.HintedUserBase;
  itemInfoGetter: () => any;
  downloadHandler: DownloadHandlerType;
  caption: React.ReactNode;
  className?: string;
}

type DownloadMenuDecoratorChildProps = ActionMenuDecoratorProps;

export default function <DropdownPropsT>(Component: React.ComponentType<DownloadMenuDecoratorChildProps & DropdownPropsT>) {
  class DownloadMenu extends React.PureComponent<DownloadMenuDecoratorProps & DropdownPropsT> {
    /*static propTypes = {

      // Target user
      user: PropTypes.object.isRequired,
  
      // Context-specific item data getter
      itemInfoGetter: PropTypes.func.isRequired,
  
      // Context-specific item data getter
      downloadHandler: PropTypes.func.isRequired,
    };*/

    itemData: DownloadMenuItemData;
    constructor(props: DownloadMenuDecoratorProps & DropdownPropsT) {
      super(props);

      this.itemData = { 
        handler: props.downloadHandler,
      };

      // Since table cells are recycled, the same menu can be re-used for different items
      // as it's not necessarily re-rendered due to performance reasons
      // Use getters so that we get data for the current cell
      Object.defineProperty(this.itemData, 'user', {
        get: () => {
          return this.props.user;
        }
      });

      Object.defineProperty(this.itemData, 'itemInfo', {
        get: () => {
          return this.props.itemInfoGetter();
        }
      });
    }

    itemDataGetter = () => {
      return this.itemData;
    }

    render() {
      const { 
        caption, className, 
        //@ts-ignore
        ...other 
      } = this.props;

      return (
        <Component 
          className={ classNames('download', className) }
          caption={ caption } 
          actions={ DownloadableItemActions }
          itemData={ this.itemDataGetter } 
          { ...other }
        />
      );
    }
  };

  return DownloadMenu;
}
