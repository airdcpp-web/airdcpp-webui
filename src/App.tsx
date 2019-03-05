import React, { useEffect, useState, createContext, Suspense } from 'react';
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

import 'array.prototype.find';
import 'utils/semantic';

import 'style.css';

import Background1500px from '../resources/images/background_winter_1500px.jpg';
import Background3840px from '../resources/images/background_winter_3840px.jpg';
import { I18nextProvider } from 'react-i18next';
import { i18n } from 'services/LocalizationService';
import Loader from 'components/semantic/Loader';


global.Promise = Promise;


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

export type InstallPromptContextType = (() => void) | null;
export const InstallPromptContext = createContext<InstallPromptContextType>(null);

const useInstallPrompt = () => {
  const [ prompt, setPrompt ] = useState<null | Event>(null);

  useEffect(
    () => {
      function handleBeforeInstallPrompt(e: Event) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        setPrompt(e);

        //console.log(`beforeinstallprompt`, e);
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    },
    []
  );

  return !prompt ? null : () => {
    (prompt as any).prompt();
    setPrompt(null);
  };
};

const App = () => {
  const prompt = useInstallPrompt();
  return (
    <Suspense fallback={ <Loader fullPage={ true } text=""/> }>
      <I18nextProvider i18n={ i18n }>
        <InstallPromptContext.Provider value={ prompt }>
          <Router history={ History }>
            <Measure
              bounds={ true }
            >
              { ({ measureRef }) => (
                <div 
                  ref={ measureRef } 
                  id="background-wrapper" 
                  style={{
                    backgroundImage: 'url(' + getBackgroundImage() + ')',
                    height: '100%',
                  }}
                >
                  <Switch>
                    <Route path="/login" component={ Login }/>
                    <Route exact path="/" component={() => <Redirect to="/home" />}/>
                    <Route path="/" component={ AuthenticatedApp }/>
                  </Switch>
                </div>
              ) }
            </Measure>
          </Router>
        </InstallPromptContext.Provider>
      </I18nextProvider>
    </Suspense>
  );
};

export default App;
