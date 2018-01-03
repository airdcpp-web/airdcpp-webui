import PropTypes from 'prop-types';
import React from 'react';
import invariant from 'invariant';
import classNames from 'classnames';

import Popup from './Popup';
import DropdownCaption from './DropdownCaption';


// A popup-based class for handling dropdowns in Fixed Data Table
// The normal styled dropdown won"t work there because the table cell won"t allow overflow
// https://github.com/facebook/fixed-data-table/issues/180

class TableDropdown extends React.Component {
  static propTypes = {
    /**
		 * Cell content to render
		 */
    caption: PropTypes.node.isRequired,

    /**
		 * Trigger the dropdown when clicking on the caption
		 */
    linkCaption: PropTypes.bool,

    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    linkCaption: true,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.caption !== this.props.caption;
  }

  addCloseHandler = (elem) => {
    if (elem.type === 'div') {
      // Divider
      return elem;
    }

    invariant(elem.props.onClick, 'Invalid item for table dropdown (click handler missing)');
    return React.cloneElement(elem, {
      onClick: () => {
        this.popupNode.hide();
				
        elem.props.onClick();
      } 
    });
  };

  getChildren = () => {
    return (
      <div className="ui text menu vertical">
        <div className="ui dropdown item table-items">
          { this.props.children().map(this.addCloseHandler) }
        </div>
      </div>
    );
  };

  render() {
    let caption = (
      <DropdownCaption>
        { this.props.caption }
      </DropdownCaption>
    );

    // Caption
    const trigger = (
      <div className="trigger">
        <i className="large angle down icon"/>
        { this.props.linkCaption ? caption : null }
      </div>
    );

    // Settings
    const settings = {
      lastResort:true
    };

    return (
      <div className={ classNames('dropdown', this.props.className) }>
        <Popup 
          ref={ c => this.popupNode = c }
          className="basic dropdown-content" 
          trigger={ trigger } 
          settings={ settings } 
          position="bottom left"
        >
          { this.getChildren }
        </Popup>
        { this.props.linkCaption ? null : caption }
      </div>);
  }
}

export default TableDropdown;