import React from 'react';

import { LocalSettings } from '@/constants/SettingConstants';
import { LayoutWidthContext } from '@/context/LayoutWidthContext';
import LocalSettingStore from '@/stores/reflux/LocalSettingStore';
import { usingMobileLayout } from '@/utils/BrowserUtils';

import Background1500px from '../../../resources/images/background_winter_1500px.jpg';
import Background3840px from '../../../resources/images/background_winter_3840px.jpg';
import useMeasure from 'react-use-measure';

const getBackgroundImage = () => {
  const url = LocalSettingStore.getValue(LocalSettings.BACKGROUND_IMAGE_URL);
  if (url) {
    return url;
  }

  if (usingMobileLayout()) {
    return null;
  }

  return window.innerWidth < 1440 ? Background1500px : Background3840px;
};

const getBackgroundImageStyle = () => {
  const url = getBackgroundImage();
  return url ? `url(${url})` : undefined;
};

export const MeasuredBackground: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [measureRef, bounds] = useMeasure({
    debounce: 100,
  });
  return (
    <LayoutWidthContext.Provider value={bounds.width}>
      <div
        ref={measureRef}
        id="background-wrapper"
        style={{
          backgroundImage: getBackgroundImageStyle(),
          height: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {children}
      </div>
    </LayoutWidthContext.Provider>
  );
};
