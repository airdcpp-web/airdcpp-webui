'use strict';

import React from 'react';

import { formatSize } from 'utils/ValueFormat';
import { Row, Header, Grid } from 'components/semantic/Grid';

import TransferConstants from 'constants/TransferConstants';
import StatisticsDecorator, { StatisticsDecoratorChildProps } from 'decorators/StatisticsDecorator';
import { SettingSectionChildProps } from 'routes/Settings/components/SettingSection';


interface TransferStatisticsPageProps extends SettingSectionChildProps {

}

const TransferStatisticsPage: React.FC<TransferStatisticsPageProps & StatisticsDecoratorChildProps<any>> = (
  { stats, moduleT }
) => {
  const { translate, plainT } = moduleT;

  const totalUp = stats.session_uploaded + stats.start_total_uploaded;
  const totalDown = stats.session_downloaded + stats.start_total_downloaded;

  return (
    <Grid columns="two" stackable={ true }>
      <Row 
        title={ translate('Total downloaded') } 
        text={ formatSize(totalDown, plainT) }
      />
      <Row 
        title={ translate('Total uploaded') } 
        text={ formatSize(totalUp, plainT) }
      />
      <Header title={ translate('Session') }/>
      <Row 
        title={ translate('Session downloaded') } 
        text={ formatSize(stats.session_downloaded, plainT) }
      />
      <Row 
        title={ translate('Session uploaded') } 
        text={ formatSize(stats.session_uploaded, plainT) }
      />
    </Grid>
  );
};

export default StatisticsDecorator(TransferStatisticsPage, TransferConstants.TRANSFERRED_BYTES_URL, null, 5);
