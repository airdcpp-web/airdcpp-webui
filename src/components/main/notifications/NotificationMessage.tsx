import * as UI from '@/types/ui';

import Button from '@/components/semantic/Button';
import classNames from 'classnames';
import { NotificationLevel } from './types';

const getSeverityColor = (severity: NotificationLevel) => {
  switch (severity) {
    case 'info':
      return 'blue';
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    case 'success':
      return 'green';
    default:
      return '';
  }
};

export interface NotificationMessageProps {
  notification: UI.Notification;
  level: NotificationLevel;
}

export const NotificationMessage = ({
  notification,
  level,
}: NotificationMessageProps) => {
  const { title, message, action } = notification;
  const color = getSeverityColor(level);
  return (
    <div className="notification">
      <div className="content">
        <div className={classNames('ui tiny header', color)} style={{ margin: '0px' }}>
          {title}
        </div>
        <div>{message}</div>
      </div>
      {!!action && (
        <Button
          caption={action.label}
          onClick={action.callback}
          className="primary"
          style={{
            marginTop: '10px',
          }}
          color={color}
        />
      )}
    </div>
  );
};
