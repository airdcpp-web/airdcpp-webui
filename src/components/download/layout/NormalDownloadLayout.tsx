import * as React from 'react';

import IconConstants from '@/constants/IconConstants';

import { translate } from '@/utils/TranslationUtils';

import Button from '@/components/semantic/Button';
import { Grid } from '@/components/semantic/Grid';

import * as UI from '@/types/ui';
import { DownloadLayoutProps } from '../types';

export const NormalDownloadLayout: React.FC<DownloadLayoutProps> = ({
  menuItems,
  title,
  handleBrowse,
  t,
  children,
}) => (
  <Grid className="normal layout">
    <div className="four wide column">
      <div className="ui vertical fluid tabular menu">{menuItems}</div>
      {!!handleBrowse && (
        <Button
          className="fluid basic"
          caption={translate('Browse', t, UI.Modules.COMMON)}
          onClick={handleBrowse}
          icon={IconConstants.BROWSE}
        />
      )}
    </div>
    <div className="twelve wide stretched column">
      <div className="ui segment main-content">{children}</div>
    </div>
  </Grid>
);
