import React from 'react';

import { LocalSettings } from 'constants/SettingConstants';
import LocalSettingStore from 'stores/LocalSettingStore';

import Background1500px from '../../../resources/images/background_1500px.jpg';
import Background3460px from '../../../resources/images/background_3460px.jpg';
import BrowserUtils from 'utils/BrowserUtils';

//import Measure from 'react-measure';
import { withContentRect } from 'react-measure';


const getBackgroundImage = () => {
  const url = LocalSettingStore.getValue(LocalSettings.BACKGROUND_IMAGE_URL);
  if (url) {
    return url;
  }

  if (BrowserUtils.useMobileLayout()) {
    return null;
  }

  return window.innerWidth < 1440 ? Background1500px : Background3460px;
};


const BackgroundWrapper = withContentRect('bounds')(({ measureRef, children }) => (
  <div 
    ref={ measureRef } 
    id="background-wrapper" 
    style={{
      backgroundImage: 'url(' + getBackgroundImage() + ')',
      height: '100%',
    }}
  >
    { children }
  </div>
));

export default BackgroundWrapper;
