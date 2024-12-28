import * as React from 'react';
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
  // Cell content to render
  caption: React.ReactNode;

  // Trigger the dropdown when clicking on the caption
  linkCaption?: boolean;

  className?: string;
  triggerIcon?: IconType;
  children: (onClose: DropdownCloseHandler) => React.ReactNode;
  popupSettings?: SemanticUI.PopupSettings;
  position?: string;
}

class TableDropdown extends React.Component<TableDropdownProps> {
  static defaultProps: Pick<
    TableDropdownProps,
    'linkCaption' | 'triggerIcon' | 'position'
  > = {
    linkCaption: true,
    triggerIcon: IconConstants.EXPAND,
    position: 'bottom left',
  };

  popupNode: Popup;
  shouldComponentUpdate(nextProps: TableDropdownProps) {
    return nextProps.caption !== this.props.caption;
  }

  getChildren = (hide: () => void) => {
    return <>{this.props.children(this.popupNode.hide)}</>;
  };

  render() {
    const { caption, className, linkCaption, triggerIcon, popupSettings, position } =
      this.props;
    const captionNode = <DropdownCaption>{caption}</DropdownCaption>;

    // Caption
    const trigger = (
      <>
        <Icon size="large" icon={triggerIcon} />
        {!!linkCaption && captionNode}
      </>
    );

    // Settings
    const settings: SemanticUI.PopupSettings = {
      lastResort: true,
      ...popupSettings,
    };

    return (
      <div className={classNames('table', 'dropdown', className)}>
        <Popup
          ref={(c) => {
            this.popupNode = c!;
          }}
          className="basic dropdown-content"
          trigger={trigger}
          settings={settings}
          position={position}
        >
          {this.getChildren}
        </Popup>
        {!linkCaption && captionNode}
      </div>
    );
  }
}

export default TableDropdown;
