import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import DownloadableItemActions from 'actions/DownloadableItemActions';


export default function (Component) {
  class DownloadMenu extends React.PureComponent {
    constructor(props) {
      super(props);

      this.itemData = { };

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
    const { caption, className, ...other } = this.props;
    return (
      <Component 
        className={ classNames('download', className) }
        caption={ caption } 
        actions={ DownloadableItemActions }
        itemDataGetter={ this.itemDataGetter } 
        { ...other }
      />
    );
  }
  };

  DownloadMenu.propTypes = {

    /**
     * Target user
     */
    user: PropTypes.object.isRequired,

    /**
     * Context-specific item data getter
     */
    itemInfoGetter: PropTypes.func.isRequired,
  };


  return DownloadMenu;
}
