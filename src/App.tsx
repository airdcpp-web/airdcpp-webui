import { Suspense } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import SocketService from 'services/SocketService';

//@ts-ignore
import Reflux from 'reflux';
//@ts-ignore
import RefluxPromise from 'reflux-promise';
import Promise from 'utils/Promise';

import AuthenticatedApp from 'components/main/AuthenticatedApp';
import Login from 'routes/Login/components/Login';

import { I18nextProvider } from 'react-i18next';
import { i18n } from 'services/LocalizationService';
import Loader from 'components/semantic/Loader';
import { useInstallPrompt } from 'components/main/effects/InstallPromptEffect';
import { InstallPromptContext } from 'context/InstallPromptContext';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { MeasuredBackground } from 'components/main/MeasuredBackground';

import 'utils/semantic';

import 'style.css';
import { SocketContext } from 'context/SocketContext';

global.Promise = Promise as any;

Reflux.use(RefluxPromise(Promise));

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

const App = () => {
  const prompt = useInstallPrompt();
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader fullPage={true} text="" />}>
        <SocketContext.Provider value={SocketService}>
          <I18nextProvider i18n={i18n}>
            <InstallPromptContext.Provider value={prompt}>
              <MeasuredBackground>
                <RouterProvider router={router} />
              </MeasuredBackground>
            </InstallPromptContext.Provider>
          </I18nextProvider>
        </SocketContext.Provider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
