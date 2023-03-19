import { Suspense } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import History from 'utils/History';

//@ts-ignore
import Reflux from 'reflux';
//@ts-ignore
import RefluxPromise from 'reflux-promise';
import Promise from 'utils/Promise';

import AuthenticatedApp from 'components/main/AuthenticatedApp';
import Login from 'routes/Login/components/Login';

import { LocalSettings } from 'constants/SettingConstants';
import LocalSettingStore from 'stores/LocalSettingStore';

import { useMobileLayout } from 'utils/BrowserUtils';

import Measure from 'react-measure';

import 'utils/semantic';

import 'style.css';

import Background1500px from '../resources/images/background_winter_1500px.jpg';
import Background3840px from '../resources/images/background_winter_3840px.jpg';
import { I18nextProvider } from 'react-i18next';
import { i18n } from 'services/LocalizationService';
import Loader from 'components/semantic/Loader';
import { useInstallPrompt } from 'components/main/effects/InstallPromptEffect';
import { InstallPromptContext } from 'context/InstallPromptContext';
import { LayoutWidthContext } from 'context/LayoutWidthContext';
import { ErrorBoundary } from 'components/ErrorBoundary';

global.Promise = Promise as any;

Reflux.use(RefluxPromise(Promise));

const getBackgroundImage = () => {
  const url = LocalSettingStore.getValue(LocalSettings.BACKGROUND_IMAGE_URL);
  if (url) {
    return url;
  }

  if (useMobileLayout()) {
    return null;
  }

  return window.innerWidth < 1440 ? Background1500px : Background3840px;
};

const getBackgroundImageStyle = () => {
  const url = getBackgroundImage();
  return url ? `url(${url})` : undefined;
};

const App = () => {
  const prompt = useInstallPrompt();
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader fullPage={true} text="" />}>
        <I18nextProvider i18n={i18n}>
          <InstallPromptContext.Provider value={prompt}>
            <Router history={History}>
              <Measure bounds={true}>
                {({ measureRef, contentRect }) => (
                  <LayoutWidthContext.Provider
                    value={!!contentRect.bounds ? contentRect.bounds.width : null}
                  >
                    <div
                      ref={measureRef}
                      id="background-wrapper"
                      style={{
                        backgroundImage: getBackgroundImageStyle(),
                        height: '100%',
                      }}
                    >
                      <Switch>
                        <Route path="/login" component={Login} />
                        <Route exact path="/" component={() => <Redirect to="/home" />} />
                        <Route path="/" component={AuthenticatedApp} />
                      </Switch>
                    </div>
                  </LayoutWidthContext.Provider>
                )}
              </Measure>
            </Router>
          </InstallPromptContext.Provider>
        </I18nextProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
