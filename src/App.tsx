import { Suspense, useMemo } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router';

import { I18nextProvider } from 'react-i18next';
import { enableMapSet } from 'immer';

//@ts-ignore
import Reflux from 'reflux';
//@ts-ignore
import RefluxPromise from 'reflux-promise';

import Promise from '@/utils/Promise';

import AuthenticatedApp from '@/components/main/AuthenticatedApp';
import Login from '@/routes/Login/components/Login';
import Loader from '@/components/semantic/Loader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MeasuredBackground } from '@/components/main/MeasuredBackground';

import SocketService from '@/services/SocketService';
import { initI18n } from '@/services/LocalizationService';

import { useInstallPrompt } from '@/components/main/effects/InstallPromptEffect';
import { InstallPromptContext } from '@/context/InstallPromptContext';

import { SocketContext } from '@/context/SocketContext';
import { FormatterContext } from '@/context/FormatterContext';
import { createFormatter } from '@/utils/Formatter';
import LoginStore from '@/stores/reflux/LoginStore';
import { SessionContext } from '@/context/SessionContext';

import '@/utils/semantic';

import './style.css';
import { AppStoreProvider } from './context/AppStoreContext';

global.Promise = Promise as any;

Reflux.use(RefluxPromise(Promise));
enableMapSet();

// TODO: migrate other routes to use the new features
// after https://github.com/remix-run/react-router/discussions/9864 has been resolved
const router = createBrowserRouter(
  [
    {
      path: '/login',
      Component: Login,
    },
    {
      index: true,
      element: <Navigate to="/home" replace />,
    },
    {
      path: '*',
      Component: AuthenticatedApp,
    },
  ],
  {
    basename: getBasePath(),
  },
);

const i18n = initI18n();
const App = () => {
  const prompt = useInstallPrompt();
  const formatter = useMemo(() => createFormatter(i18n), []);
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader fullPage={true} text="" />}>
        <FormatterContext.Provider value={formatter}>
          <AppStoreProvider>
            <SocketContext.Provider value={SocketService}>
              <I18nextProvider i18n={i18n}>
                <InstallPromptContext.Provider value={prompt}>
                  <MeasuredBackground>
                    <SessionContext.Provider value={LoginStore}>
                      <RouterProvider router={router} />
                    </SessionContext.Provider>
                  </MeasuredBackground>
                </InstallPromptContext.Provider>
              </I18nextProvider>
            </SocketContext.Provider>
          </AppStoreProvider>
        </FormatterContext.Provider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
