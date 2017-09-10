import PropTypes from 'prop-types';
import React from 'react';

import Popup from 'components/semantic/Popup';


const encryptionToInfo = (encryption) => {
  if (encryption.str.indexOf('TLSv1.2') === -1 && encryption.str.indexOf('TLSv1.1') === -1) {
    return {
      iconColor: 'orange',
      messageColor: 'red',
      message: 'Outdated cryptographic protocol with known security vulnerabilities',
      icon: 'orange warning',
    };
  }

  if (!encryption.trusted) {
    return {
      iconColor: 'yellow',
      messageColor: 'orange',
      message: 'Authenticity of the certificate could not be validated',
      icon: 'blue help',
    };
  }

  return {
    iconColor: 'green',
    messageColor: 'green',
    message: 'Authenticity of the certificate is validated',
    icon: '',
  };
};

const InfoMessage = ({ info, encryption }) => (
  <div>
    <p>
      { encryption.str }
    </p>
    <p style={ { color: info.messageColor } }>
      { info.message }
    </p>
  </div>
);

class EncryptionState extends React.PureComponent {
 getChildren = () => {
   const { encryption } = this.props;

   const info = encryptionToInfo(encryption);
   return <InfoMessage info={ info } encryption={ encryption }/>;
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
         <i className="link icon icons">
           <i className={ info.iconColor + ' lock icon' }/>
           <i className={ info.icon + ' corner icon' }/>
         </i>
       }
       settings={ {
         boundary,
       } }
     >
       { this.getChildren }
     </Popup>
   );
 }
};

EncryptionState.propTypes = {
  encryption: PropTypes.object,
  boundary: PropTypes.string,

  /* Show the lock icon even when there is no encryption */
  alwaysVisible: PropTypes.bool,
};

export default EncryptionState;