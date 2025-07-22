import { SocketContext } from '@/context/SocketContext';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { APISocket } from '@/services/SocketService';
import { PropsWithChildren } from 'react';

import '@/utils/semantic';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SessionContext } from '@/context/SessionContext';

import * as UI from '@/types/ui';

import { MODAL_NODE_ID } from '@/components/semantic/effects/useModal';
import { createFormatter } from '@/utils/Formatter';
import { FormatterContext } from '@/context/FormatterContext';
import { StoreApi } from 'zustand';
import { appendInstanceId, UIInstanceContext } from '@/context/InstanceContext';
import { SessionStoreContext } from '@/context/SessionStoreContext';
import { AppStoreProvider } from '@/context/AppStoreContext';

const BaseComponent: React.FC<PropsWithChildren<{ instanceId: number }>> = ({
  instanceId,
  children,
}) => {
  const modalNodeId = appendInstanceId(MODAL_NODE_ID, instanceId);
  return (
    <>
      <section
        className="ui dimmable blurring minimal"
        id="container-main"
        style={{ height: '100%', width: '100%' }}
      >
        {children}
      </section>
      <div id={modalNodeId} className={`ui dimmer ${modalNodeId}`} />
    </>
  );
};

const SimpleWrapper = ({ children }: React.PropsWithChildren) => <>{children}</>;

type UIBaseWrapperProps = PropsWithChildren<{
  formatter: ReturnType<typeof createFormatter>;
  i18n: typeof i18n;
  instanceId: number;
  wrapper?: React.ComponentType;
}>;

export const BaseTestWrapper: React.FC<UIBaseWrapperProps> = ({
  formatter,
  instanceId,
  wrapper: Wrapper = SimpleWrapper,
  children,
}) => {
  return (
    <ErrorBoundary>
      <UIInstanceContext.Provider value={instanceId}>
        <FormatterContext.Provider value={formatter}>
          <I18nextProvider i18n={i18n}>
            <AppStoreProvider>
              <Wrapper>
                <BaseComponent instanceId={instanceId}>{children}</BaseComponent>
              </Wrapper>
            </AppStoreProvider>
          </I18nextProvider>
        </FormatterContext.Provider>
      </UIInstanceContext.Provider>
    </ErrorBoundary>
  );
};

type SessionWrapperProps = PropsWithChildren<{
  socket: APISocket;
  session: UI.AuthenticatedSession;
  sessionStore: StoreApi<UI.SessionStore>;
}>;

export const SessionTestWrapper: React.FC<SessionWrapperProps> = ({
  socket,
  session,
  sessionStore,
  children,
}) => {
  return (
    <SocketContext.Provider value={socket}>
      <SessionContext.Provider value={session}>
        <SessionStoreContext.Provider value={sessionStore}>
          {children}
        </SessionStoreContext.Provider>
      </SessionContext.Provider>
    </SocketContext.Provider>
  );
};
