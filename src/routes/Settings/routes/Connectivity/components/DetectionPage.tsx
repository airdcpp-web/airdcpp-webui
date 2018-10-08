import React from 'react';

import DetectPanel from 'routes/Settings/routes/Connectivity/components/DetectPanel';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';


class DetectionPage extends React.Component {
  render() {
    return (
      <div>
        <DetectPanel/>

        <Message 
          description={
            <span>
              In case of file transfer connectivity issues, please confirm that your TCP ports are really open by using 
              <ExternalLink url={ LinkConstants.PORTCHECK_URL }>an online port checker</ExternalLink>. Note that 
              validity of the UDP port (search) can't be checked online.

              For more information about different connectivity modes, please visit 
              { ' ' }
              <ExternalLink url={ LinkConstants.CONNECTIVITY_HELP_URL }>DC++'s connectivity FAQ</ExternalLink>.
            </span>
          }
          icon="blue info"
        />
      </div>
    );
  }
}

export default DetectionPage;