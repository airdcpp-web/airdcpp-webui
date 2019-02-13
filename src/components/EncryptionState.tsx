import PropTypes from 'prop-types';
import React from 'react';

import Popup from 'components/semantic/Popup';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { Trans } from 'react-i18next';
import { toI18nKey } from 'utils/TranslationUtils';


interface Info {
  iconColor: string;
  messageColor: string;
  message: string;
  icon: string;
  translationKey: string;
}

const encryptionToInfo = (encryption: API.EncryptionInfo): Info => {
  const tlsVersion = encryption.str.match(/TLSv([\d\.]+)/);
  if (tlsVersion && tlsVersion.length === 2 && parseFloat(tlsVersion[1]) < 1.2) {
    return {
      iconColor: 'orange',
      messageColor: 'red',
      message: 'Outdated cryptographic protocol with known security vulnerabilities',
      icon: 'orange warning',
      translationKey: 'tlsOutdatedWarning',
    };
  }

  if (!encryption.trusted) {
    return {
      iconColor: 'yellow',
      messageColor: 'orange',
      message: 'Authenticity of the certificate could not be validated',
      icon: 'blue help',
      translationKey: 'tlsAuthenticityWarning',
    };
  }

  return {
    iconColor: 'green',
    messageColor: 'green',
    message: 'Authenticity of the certificate is validated',
    icon: '',
    translationKey: 'tlsOk',
  };
};


interface InfoMessageProps {
  info: Info;
  encryption: API.EncryptionInfo;
}

const InfoMessage: React.FC<InfoMessageProps> = ({ info, encryption }) => (
  <div>
    <p>
      { encryption.str }
    </p>
    <p style={ { color: info.messageColor } }>
      <Trans i18nKey={ toI18nKey(info.translationKey, UI.Modules.COMMON) }>
        { info.message }
      </Trans>
    </p>
  </div>
);

interface EncryptionStateProps extends Partial<Pick<SemanticUI.PopupSettings, 'boundary'>> {
  encryption?: API.EncryptionInfo;
  alwaysVisible?: boolean;
}

class EncryptionState extends React.PureComponent<EncryptionStateProps> {
  static propTypes = {
    encryption: PropTypes.object,
    boundary: PropTypes.string,

    // Show the lock icon even when there is no encryption
    alwaysVisible: PropTypes.bool,
  };

  getChildren = () => {
    const { encryption } = this.props;

    const info = encryptionToInfo(encryption!);
    return <InfoMessage info={ info } encryption={ encryption! }/>;
  }

  render() {
    const { encryption, alwaysVisible, boundary } = this.props;
    if (!encryption) {
      return alwaysVisible ? <i className="grey lock icon"/> : null;
    }

    const info = encryptionToInfo(encryption);
    return (
      <Popup 
        triggerClassName="encryption" 
        className="basic encryption content" 
        trigger={ 
          <i className="link icons">
            <i className={ `${info.iconColor} lock icon` }/>
            <i className={ `${info.icon} corner icon` }/>
          </i>
        }
        settings={ {
          boundary,
        } as SemanticUI.PopupSettings }
      >
        { this.getChildren }
      </Popup>
    );
  }
}

export default EncryptionState;