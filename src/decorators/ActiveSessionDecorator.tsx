'use strict';
import PropTypes from 'prop-types';
import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';


interface ActiveSessionDecoratorProps<SessionT> {
  actions: {
    setRead: (id: any) => void;
    sessionChanged: (id: any) => void;
  };
  session: SessionT;
}

// This decorator will fire updates for currently active session
// and set them as read
export default function <PropsT, SessionT extends { id: any; }>(Component: React.ComponentType<PropsT>, useReadDelay: boolean) {
  class ActiveSessionDecorator extends React.Component<ActiveSessionDecoratorProps<SessionT>> {
    static propTypes = {
      session: PropTypes.any, // Required (cloned)
      actions: PropTypes.object, // Required (cloned)
    };

    readTimeout: any;

    setRead = (id: any) => {
      this.props.actions.setRead(id);
      this.readTimeout = null;
    };

    setSession = (id: any) => {
      if (this.readTimeout) {
        clearTimeout(this.readTimeout);
        this.setRead(this.props.session.id);
      }

      this.props.actions.sessionChanged(id);
      if (!id) {
        return;
      }

      const timeout = !useReadDelay ? 0 : LocalSettingStore.getValue(LocalSettings.UNREAD_LABEL_DELAY) * 1000;
      this.readTimeout = setTimeout(_ => this.setRead(id), timeout);
    };

    componentDidMount() {
      this.setSession(this.props.session.id);
    }

    componentWillUnmount() {
      this.setSession(null);
    }

    componentWillReceiveProps(nextProps: ActiveSessionDecoratorProps<SessionT>) {
      if (this.props.session.id != nextProps.session.id) {
        this.setSession(nextProps.session.id);
      }
    }

    render() {
      return <Component { ...this.props }/>;
    }
  }

  return ActiveSessionDecorator;
}
