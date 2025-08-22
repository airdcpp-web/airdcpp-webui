import { useMemo, useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import * as UI from '@/types/ui';

import 'fomantic-ui-css/components/popup';
import 'fomantic-ui-css/components/popup.min.css';

import { AnimationConstants } from '@/constants/UIConstants';
import { appendInstanceId, UIInstanceContext } from '@/context/InstanceContext';

type ChildType = React.ReactElement<any>;

export const POPUP_NODE_ID = 'popup-node';

export interface PopupProps {
  // Additional settings for the Semantic UI popup
  settings?: SemanticUI.PopupSettings;

  trigger: React.ReactNode;

  // Show the popup on hover instead of when clicking the element
  onHover?: boolean;

  position?: string;

  triggerClassName?: string;
  className?: string;
  children: ChildType | ((hide: UI.Callback) => ChildType);
  contentUpdateTrigger?: any; // Changes to this value will trigger re-render for the popup content
  triggerProps?: React.HTMLAttributes<HTMLSpanElement>;
}

interface PopupContentProps extends Pick<PopupProps, 'children'> {
  node: Element;
  onHide: UI.Callback;
  onShow: UI.Callback;
  hide: UI.Callback;
  contentUpdateTrigger?: any;
}

const PopupContent: React.FC<PopupContentProps> = (props) => {
  const content = useMemo<ChildType>(() => {
    const { children } = props;
    return typeof children === 'function' ? children(props.hide) : children;
  }, [props.contentUpdateTrigger]);

  useEffect(() => {
    props.onShow();
    return () => {
      props.onHide();
    };
  }, []);

  return ReactDOM.createPortal(content, props.node);
};

export interface PopupHandle {
  hide: UI.Callback;
}

const Popup = forwardRef<PopupHandle, PopupProps>(
  (
    {
      position = 'bottom left',
      triggerClassName = '',
      trigger,
      children,
      contentUpdateTrigger,
      onHover,
      className,
      settings,
      triggerProps: customTriggerProps,
    },
    handle,
  ) => {
    const instanceId = React.useContext(UIInstanceContext);
    const popupNodeId = appendInstanceId(POPUP_NODE_ID, instanceId);

    const [visible, setVisible] = useState(false);
    const nodeRef = useRef<Element | null>(null);
    const triggerNodeRef = useRef<Element | null>(null);

    // Create portal node
    const createPortalNode = useCallback(() => {
      if (!nodeRef.current) {
        const node = document.getElementById(popupNodeId)!;
        nodeRef.current = document.createElement('div');
        nodeRef.current.className = classNames('ui flowing popup', className);
        node.appendChild(nodeRef.current);
        setVisible(true);
      }
    }, [className]);

    // Destroy portal node
    const destroyPortal = useCallback(() => {
      if (!nodeRef.current) {
        return;
      }
      if (triggerNodeRef.current) {
        $(triggerNodeRef.current).popup('destroy');
      }

      nodeRef.current.parentElement?.removeChild(nodeRef.current);
      nodeRef.current = null;
      setVisible(false);
    }, []);

    // Hide popup
    const hide = useCallback(() => {
      if (triggerNodeRef.current) {
        $(triggerNodeRef.current).popup('hide');
      }
    }, []);

    // Show popup
    const show = useCallback(() => {
      if (!triggerNodeRef.current || !nodeRef.current) return;
      const popupSettings: SemanticUI.PopupSettings = {
        on: onHover ? 'hover' : 'click',
        movePopup: false,
        popup: nodeRef.current as any as JQuery<HTMLElement>,
        onHidden: () => setVisible(false),
        position,
        duration: AnimationConstants.popup,

        // debug: true,
        // verbose: true,

        ...settings,
      };
      $(triggerNodeRef.current).popup(popupSettings).popup('show');
    }, [onHover, position, settings]);

    // Handle click or hover to show popup
    const handleClick = useCallback(() => {
      if (!nodeRef.current) {
        createPortalNode();
      }
    }, [createPortalNode]);

    // Get trigger props
    const getTriggerProps = () => {
      const triggerProps: any = {
        ...customTriggerProps,
        ref: (c: any) => {
          if (c) {
            triggerNodeRef.current = c;
          }
        },
        className: classNames(triggerClassName, 'popup trigger'),
      };
      if (onHover) {
        triggerProps['onMouseEnter'] = handleClick;
      } else {
        triggerProps['onClick'] = handleClick;
      }
      return triggerProps;
    };

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        destroyPortal();
      };
    }, [destroyPortal]);

    React.useImperativeHandle(
      handle,
      () => ({
        hide,
      }),
      [triggerNodeRef.current],
    );

    return (
      <>
        <span role="button" tabIndex={0} {...getTriggerProps()}>
          {trigger}
        </span>
        {visible && nodeRef.current && (
          <PopupContent
            node={nodeRef.current}
            onShow={show}
            onHide={destroyPortal}
            hide={hide}
            contentUpdateTrigger={contentUpdateTrigger}
          >
            {children}
          </PopupContent>
        )}
      </>
    );
  },
);

export default Popup;
