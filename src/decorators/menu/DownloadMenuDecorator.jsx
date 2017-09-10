import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import DownloadableItemActions from 'actions/DownloadableItemActions';


export default function (Component) {
  class DownloadMenu extends React.PureComponent {
    constructor(props) {
      super(props);

      this.itemData = {
        handler: this.props.handler,
      };

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
		 * Possible user to be passed to the handler (when not used for items in a singleton entity)
		 */
    user: PropTypes.object.isRequired,

    /**
		 * Function for handling the download
		 */
    handler: PropTypes.func.isRequired,

    /**
		 * Additional data to be passed to the handler
		 */
    itemInfoGetter: PropTypes.func.isRequired,
  };


  return DownloadMenu;
}
