import React from 'react';

import { LayoutWidthContext } from '@/context/LayoutWidthContext';
import { usingMobileLayout } from '@/utils/BrowserUtils';

import Background1500px from '../../../resources/images/background_winter_1500px.jpg';
import Background3840px from '../../../resources/images/background_winter_3840px.jpg';
import useMeasure from 'react-use-measure';
import { useAppStoreProperty } from '@/context/AppStoreContext';
import { LocalSettings } from '@/constants/LocalSettingConstants';

const getDefaultBackgroundImage = () => {
  if (usingMobileLayout()) {
    return null;
  }

  return window.innerWidth < 1440 ? Background1500px : Background3840px;
};

const getBackgroundImageStyle = (customImageUrl: string | null) => {
  const url = customImageUrl || getDefaultBackgroundImage();
  return url ? `url(${url})` : undefined;
};

export const MeasuredBackground: React.FC<React.PropsWithChildren> = ({ children }) => {
  const customImageUrl = useAppStoreProperty((state) =>
    state.settings.getValue<string | null>(LocalSettings.BACKGROUND_IMAGE_URL),
  );
  const darkMode = useAppStoreProperty(
    (state) => state.settings.settings.dark_mode === true,
  );
  const [measureRef, bounds] = useMeasure({
    debounce: 100,
  });
  const backgroundImage = getBackgroundImageStyle(customImageUrl);
  return (
    <LayoutWidthContext.Provider value={bounds.width}>
      <div
        ref={measureRef}
        id="background-wrapper"
        style={{
          backgroundImage: darkMode && backgroundImage
            ? `linear-gradient(rgba(24, 24, 24, 0.86), rgba(24, 24, 24, 0.86)), ${backgroundImage}`
            : backgroundImage,
          backgroundColor: darkMode ? '#181818' : undefined,
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
