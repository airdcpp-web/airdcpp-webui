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
import { StoreContext } from '@/context/StoreContext';
import { StoreApi } from 'zustand';
import { appendInstanceId, UIInstanceContext } from '@/context/InstanceContext';

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
            <Wrapper>
              <BaseComponent instanceId={instanceId}>{children}</BaseComponent>
            </Wrapper>
          </I18nextProvider>
        </FormatterContext.Provider>
      </UIInstanceContext.Provider>
    </ErrorBoundary>
  );
};

type SessionWrapperProps = PropsWithChildren<{
  socket: APISocket;
  session: UI.AuthenticatedSession;
  store: StoreApi<UI.Store>;
}>;

export const SessionTestWrapper: React.FC<SessionWrapperProps> = ({
  socket,
  session,
  store,
  children,
}) => {
  return (
    <SocketContext.Provider value={socket}>
      <SessionContext.Provider value={session}>
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
      </SessionContext.Provider>
    </SocketContext.Provider>
  );
};

/*type TestWrapperProps = PropsWithChildren<
  UIBaseWrapperProps & {
    socket: APISocket;
    session: UI.AuthenticatedSession;
    store: StoreApi<UI.Store>;
  }
>;

export const DataTestWrapper: React.FC<TestWrapperProps> = ({
  children,
  socket,
  i18n,
  formatter,
  session,
  store,
  instanceId,
}) => {
  return (
    <BaseTestWrapper instanceId={instanceId} formatter={formatter} i18n={i18n}>
      <SessionWrapper socket={socket} session={session} store={store}>
        <BaseComponent instanceId={instanceId}>{children}</BaseComponent>
      </SessionWrapper>
    </BaseTestWrapper>
  );
};*/

/*type DataTestWrapperProps = PropsWithChildren<
  {
    socket: APISocket;
    session: UI.AuthenticatedSession;
    store: StoreApi<UI.Store>;
  }
>;

export const DataTestWrapper: React.FC<DataTestWrapperProps> = ({
  children,
  socket,
  // i18n,
  // formatter,
  session,
  store,
  // instanceId,
}) => {
  return (
    <SessionWrapper socket={socket} session={session} store={store}>
      {children}
    </SessionWrapper>
  );
};*/
