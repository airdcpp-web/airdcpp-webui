import { SocketContext } from '@/context/SocketContext';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { APISocket } from '@/services/SocketService';
import { PropsWithChildren } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';

import * as UI from '@/types/ui';

import { MODAL_NODE_ID } from '@/components/semantic/effects/useModal';
import { createFormatter } from '@/utils/Formatter';
import { FormatterContext } from '@/context/FormatterContext';
import { StoreApi } from 'zustand';
import { appendInstanceId, UIInstanceContext } from '@/context/InstanceContext';
import { SessionStoreContext } from '@/context/SessionStoreContext';
import { AppStoreContext } from '@/context/AppStoreContext';
import { POPUP_NODE_ID } from '@/components/semantic/Popup';

import '@/style.css';
import '@/utils/semantic';

export interface ViewType {
  width: string;
  height: string;
}

export const VIEW_SCROLLABLE = {
  height: '100%',
  width: '100%',
};

export const VIEW_FIXED_HEIGHT = {
  height: '600px',
  width: '100%',
};

interface BaseComponentProps {
  instanceId: number;
  viewType: ViewType;
}

const BaseComponent: React.FC<PropsWithChildren<BaseComponentProps>> = ({
  instanceId,
  viewType,
  children,
}) => {
  const modalNodeId = appendInstanceId(MODAL_NODE_ID, instanceId);
  const popupNodeId = appendInstanceId(POPUP_NODE_ID, instanceId);
  return (
    <>
      <section
        className="ui dimmable blurring minimal"
        id="container-main"
        style={viewType}
      >
        {children}
      </section>
      <div id={modalNodeId} className={`ui dimmer ${modalNodeId}`} />
      <div id={popupNodeId} />
    </>
  );
};

const SimpleWrapper = ({ children }: React.PropsWithChildren) => <>{children}</>;

type UIBaseWrapperProps = PropsWithChildren<{
  formatter: ReturnType<typeof createFormatter>;
  i18n: typeof i18n;
  instanceId: number;
  appStore: StoreApi<UI.AppStore>;
  wrapper?: React.ComponentType;
  viewType: ViewType;
}>;

export const BaseTestWrapper: React.FC<UIBaseWrapperProps> = ({
  formatter,
  instanceId,
  appStore,
  wrapper: Wrapper = SimpleWrapper,
  viewType,
  i18n,
  children,
}) => {
  return (
    <ErrorBoundary>
      <UIInstanceContext.Provider value={instanceId}>
        <FormatterContext.Provider value={formatter}>
          <I18nextProvider i18n={i18n}>
            <AppStoreContext.Provider value={appStore}>
              <Wrapper>
                <BaseComponent viewType={viewType} instanceId={instanceId}>
                  {children}
                </BaseComponent>
              </Wrapper>
            </AppStoreContext.Provider>
          </I18nextProvider>
        </FormatterContext.Provider>
      </UIInstanceContext.Provider>
    </ErrorBoundary>
  );
};

type SessionWrapperProps = PropsWithChildren<{
  socket: APISocket;
  sessionStore: StoreApi<UI.SessionStore>;
}>;

export const SessionTestWrapper: React.FC<SessionWrapperProps> = ({
  socket,
  sessionStore,
  children,
}) => {
  return (
    <SocketContext.Provider value={socket}>
      <SessionStoreContext.Provider value={sessionStore}>
        {children}
      </SessionStoreContext.Provider>
    </SocketContext.Provider>
  );
};
