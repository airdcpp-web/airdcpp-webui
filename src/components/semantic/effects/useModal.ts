import { AnimationConstants } from '@/constants/UIConstants';
import { appendInstanceId, UIInstanceContext } from '@/context/InstanceContext';
import { useSidebarContext } from '@/context/SidebarContext';
import * as React from 'react';

export const MODAL_NODE_ID = 'modals-node';

export const MODAL_PAGE_DIMMER_ID = 'dimmable-page';

// wasClean is false when using browser navigation (or the modal had to be closed because of the sidebar)
export type ModalCloseHandler = (wasClean: boolean) => void;

export type ModalApproveHandler = () => Promise<void>;

export type CommonModalProps = {
  onClose?: ModalCloseHandler;
  onApprove?: ModalApproveHandler;
};

type ModalSettings = Partial<SemanticUI.ModalSettings>;

export const useModal = (props: CommonModalProps, customSettings: ModalSettings) => {
  const sidebarOpen = useSidebarContext();
  const ref = React.useRef<HTMLDivElement>(null);

  // Set to true when the modal is being closed cleanly (backdrop click/action buttons)
  // We need to clean the DOM for non-clean closures
  const closingCleanly = React.useRef(false);

  const [saving, setSaving] = React.useState(false);

  // We need to store the handlers in a ref because the props may change
  // (the handlers would be outdated otherwise when being called)
  const handlers = React.useRef<CommonModalProps>({
    onClose: props.onClose,
    onApprove: props.onApprove,
  });

  const onHide = () => {
    closingCleanly.current = true;
  };

  const hide = () => {
    if (ref.current) {
      $(ref.current).modal('hide');
    }
  };

  const onHidden = () => {
    const { onClose } = handlers.current;
    if (onClose) {
      onClose(closingCleanly.current);
    }

    if (ref.current) {
      ref.current.setAttribute('aria-hidden', 'true');
    }
  };

  const onApprove = () => {
    const { onApprove } = handlers.current;
    if (onApprove) {
      setSaving(true);

      onApprove()
        .then(hide)
        .catch(() => setSaving(false));

      return false;
    }

    return void 0;
  };

  const forceClose = () => {
    if (ref.current) {
      hide();
      closingCleanly.current = false;
    }
  };

  const instanceId = React.useContext(UIInstanceContext);
  const modalNodeId = appendInstanceId(MODAL_NODE_ID, instanceId);

  React.useLayoutEffect(() => {
    if (sidebarOpen) {
      return;
    }

    // We can't use the same context as for modals
    // because the dimmer wouldn't work correctly then
    // (the new dimmer would never be set active because the dimmable object is set to dimmed already)
    // Track https://github.com/Semantic-Org/Semantic-UI/issues/4055
    const settings: SemanticUI.ModalSettings = {
      context: `#${appendInstanceId(MODAL_PAGE_DIMMER_ID, instanceId)}`,
      detachable: false,
      allowMultiple: true,
      onHide,

      onHidden,
      onApprove,

      duration: AnimationConstants.modal,

      dimmerSettings: {
        dimmerName: modalNodeId,
        //selector: {
        //  dimmer: `> .ui.dimmer.${NODE_ID}`
        //},
        //namespace: NODE_ID,
      },
      // debug: true,
      // verbose: true,

      ...customSettings,
    };

    // Missing from type definitions
    // useFlex true in combination with detachable false is not supported
    Object.assign(settings, {
      useFlex: false,
    });

    ref.current!.removeAttribute('aria-hidden');
    $(ref.current!).modal(settings).modal('show');

    return () => {
      if (!closingCleanly.current) {
        // History navigation event, we still need to clean up the dimmer
        forceClose();
      }
    };
  }, [sidebarOpen]); // Re-open the modal if we are returning from the sidebar

  React.useEffect(() => {
    handlers.current = {
      onClose: props.onClose,
      onApprove: props.onApprove,
    };
  }, [props.onClose, props.onApprove]);

  React.useEffect(() => {
    if (sidebarOpen) {
      forceClose();
    }
  }, [sidebarOpen]);

  return { ref, hide, saving, modalNodeId };
};
