import * as React from 'react';

export const MODAL_NODE_ID = 'modals-node';

export const MODAL_PAGE_DIMMER_ID = 'dimmable-page';

export type CloseHandler = (wasClean: boolean) => void;
export type ApproveHandler = () => Promise<void>;

export type CommonModalProps = {
  // wasClean is false when using browser navigation
  onClose?: CloseHandler;
  onApprove?: ApproveHandler;
};

type ModalSettings = Partial<SemanticUI.ModalSettings>;

export const useModal = (props: CommonModalProps, customSettings: ModalSettings) => {
  const ref = React.useRef<HTMLDialogElement>(null);

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
    closingCleanly.current = true;
    if (ref.current) {
      $(ref.current).modal('hide');
    }
  };

  const onHidden = () => {
    const { onClose } = handlers.current;
    if (onClose) {
      onClose(closingCleanly.current);
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

  React.useLayoutEffect(() => {
    // We can't use the same context as for modals
    // because the dimmer wouldn't work correctly then
    // (the new dimmer would never be set active because the dimmable object is set to dimmed already)
    // Track https://github.com/Semantic-Org/Semantic-UI/issues/4055
    const settings: SemanticUI.ModalSettings = {
      context: `#${MODAL_PAGE_DIMMER_ID}`,
      detachable: false,
      allowMultiple: true,
      onHide,

      onHidden,
      onApprove,

      dimmerSettings: {
        dimmerName: MODAL_NODE_ID,
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

    $(ref.current!).modal(settings).modal('show');

    return () => {
      if (!closingCleanly.current) {
        // History navigation event, we still need to clean up the dimmer
        if (ref.current) {
          hide();
          closingCleanly.current = false;
        }
      }
    };
  }, []);

  React.useEffect(() => {
    handlers.current = {
      onClose: props.onClose,
      onApprove: props.onApprove,
    };
  }, [props.onClose, props.onApprove]);

  return { ref, hide, saving };
};
