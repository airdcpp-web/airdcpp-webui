//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Popup from './Popup';
import DropdownCaption from './DropdownCaption';
import Icon, { IconType } from './Icon';
import IconConstants from 'constants/IconConstants';


// A popup-based class for handling dropdowns in Fixed Data Table
// The normal styled dropdown won"t work there because the table cell won"t allow overflow
// https://github.com/facebook/fixed-data-table/issues/180


export type DropdownCloseHandler = () => void;

export interface TableDropdownProps {
  caption: React.ReactNode;
  linkCaption?: boolean;
  className?: string;
  triggerIcon?: IconType;
  children: (onClose: DropdownCloseHandler) => React.ReactNode;
}

class TableDropdown extends React.Component<TableDropdownProps> {
  /*static propTypes = {
    // Cell content to render
    caption: PropTypes.node.isRequired,

    // Trigger the dropdown when clicking on the caption
    linkCaption: PropTypes.bool,

    children: PropTypes.func.isRequired,
  };*/

  static defaultProps: Pick<TableDropdownProps, 'linkCaption' | 'triggerIcon'> = {
    linkCaption: true,
    triggerIcon: IconConstants.EXPAND,
  };

  popupNode: Popup;
  shouldComponentUpdate(nextProps: TableDropdownProps) {
    return nextProps.caption !== this.props.caption;
  }

  getChildren = () => {
    return (
      <div className="ui text menu vertical table-items">
        { this.props.children(this.popupNode.hide) }
      </div>
    );
  }

  render() {
    const { caption, className, linkCaption, triggerIcon } = this.props;
    let captionNode = (
      <DropdownCaption>
        { caption }
      </DropdownCaption>
    );

    // Caption
    const trigger = (
      <div className="trigger">
        <Icon 
          size="large"
          icon={ triggerIcon }
        />
        { !!linkCaption && captionNode }
      </div>
    );

    // Settings
    const settings: SemanticUI.PopupSettings = {
      lastResort: true
    };

    return (
      <div className={ classNames('table', 'dropdown', className) }>
        <Popup 
          ref={ c => this.popupNode = c! }
          className="basic dropdown-content" 
          trigger={ trigger } 
          settings={ settings } 
          position="bottom left"
        >
          { this.getChildren }
        </Popup>
        { !linkCaption && captionNode }
      </div>
    );
  }
}

export default TableDropdown;