import * as React from 'react';
import classNames from 'classnames';

import Popup, { PopupHandle, PopupProps } from './Popup';
import DropdownCaption from './DropdownCaption';
import Icon, { IconType } from './Icon';
import IconConstants from '@/constants/IconConstants';

// A popup-based class for handling dropdowns in Fixed Data Table
// The normal styled dropdown won't work there because the table cell won't allow overflow
// https://github.com/facebook/fixed-data-table/issues/180

export type DropdownCloseHandler = () => void;

export interface TableDropdownProps {
  // Cell content to render
  caption: React.ReactNode;

  id: any;

  // Trigger the dropdown when clicking on the caption
  linkCaption?: boolean;

  className?: string;
  triggerIcon?: IconType;

  children: (onClose: DropdownCloseHandler) => React.ReactNode;

  popupSettings?: SemanticUI.PopupSettings;
  position?: string;

  triggerProps?: PopupProps['triggerProps'];
}

const TableDropdownComponent: React.FC<TableDropdownProps> = ({
  caption,
  className,
  linkCaption = true,
  triggerIcon = IconConstants.EXPAND,
  children,
  popupSettings,
  triggerProps,
  position = 'bottom left',
}) => {
  const popupRef = React.useRef<PopupHandle | null>(null);

  const onClose = React.useCallback<DropdownCloseHandler>(() => {
    popupRef.current?.hide();
  }, []);

  const captionNode = <DropdownCaption>{caption}</DropdownCaption>;

  // Caption
  const trigger = (
    <>
      <Icon size="large" icon={triggerIcon} />
      {!!linkCaption && captionNode}
    </>
  );

  // Settings
  const settings = React.useMemo<SemanticUI.PopupSettings>(
    () => ({
      lastResort: true,
      ...popupSettings,
    }),
    [popupSettings],
  );

  return (
    <div className={classNames('table', 'dropdown', className)}>
      <Popup
        ref={popupRef}
        className="basic dropdown-content"
        trigger={trigger}
        triggerProps={triggerProps}
        settings={settings}
        position={position}
      >
        {() => <>{children(onClose)}</>}
      </Popup>
      {!linkCaption && captionNode}
    </div>
  );
};

export default React.memo(
  TableDropdownComponent,
  (prev, next) => prev.caption === next.caption && prev.id === next.id,
);
