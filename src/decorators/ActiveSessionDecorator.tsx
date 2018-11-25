'use strict';
//import PropTypes from 'prop-types';
import React from 'react';

import * as UI from 'types/ui';
import { SessionChildProps } from 'routes/Sidebar/components/SessionLayout';
import { useActiveSessionEffect } from 'effects';


type SessionType = UI.SessionItemBase;

interface ActiveSessionDecoratorProps<SessionT extends SessionType, ActionT extends object> 
  extends Pick<SessionChildProps<SessionT, ActionT>, 'actions' | 'session'> {

}


// This decorator will fire updates for currently active session
// and set them as read
export default function <PropsT, SessionT extends SessionType, ActionT extends object = {}>(
  Component: React.ComponentType<PropsT>, 
  useReadDelay: boolean = false
) {
  const Decorator: React.FC<PropsT & ActiveSessionDecoratorProps<SessionT, ActionT>> = (props) => {
    useActiveSessionEffect(props.session, props.actions, useReadDelay);
    return <Component { ...props }/>;
  };

  return React.memo(Decorator);
}
