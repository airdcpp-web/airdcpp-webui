'use strict';
//import PropTypes from 'prop-types';
import React from 'react';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';


export interface SessionActions {
  setRead: (id: API.IdType) => void;
  sessionChanged: (id: API.IdType | null) => void;
}

interface ActiveSessionDecoratorProps<SessionT> {
  actions: SessionActions;
  session: SessionT;
}

// This decorator will fire updates for currently active session
// and set them as read
export default function <PropsT, SessionT extends { id: API.IdType; }>(
  Component: React.ComponentType<PropsT>, 
  useReadDelay: boolean = false
) {
  class ActiveSessionDecorator extends React.Component<PropsT & ActiveSessionDecoratorProps<SessionT>> {
    /*static propTypes = {
      session: PropTypes.any, // Required (cloned)
      actions: PropTypes.object, // Required (cloned)
    };*/

    readTimeout: NodeJS.Timer | null;

    setRead = (id: API.IdType) => {
      this.props.actions.setRead(id);
      this.readTimeout = null;
    }

    setSession = (id: API.IdType | null) => {
      if (this.readTimeout) {
        clearTimeout(this.readTimeout);
        this.setRead(this.props.session.id);
      }

      this.props.actions.sessionChanged(id);
      if (!id) {
        return;
      }

      const timeout = !useReadDelay ? 0 : LocalSettingStore.getValue<number>(LocalSettings.UNREAD_LABEL_DELAY) * 1000;
      this.readTimeout = setTimeout(_ => this.setRead(id), timeout);
    }

    componentDidMount() {
      this.setSession(this.props.session.id);
    }

    componentWillUnmount() {
      this.setSession(null);
    }

    UNSAFE_componentWillReceiveProps(nextProps: ActiveSessionDecoratorProps<SessionT>) {
      if (this.props.session.id !== nextProps.session.id) {
        this.setSession(nextProps.session.id);
      }
    }

    render() {
      return <Component { ...this.props }/>;
    }
  }

  return ActiveSessionDecorator;
}
