import * as React from 'react';

import Icon, { IconType } from '@/components/semantic/Icon';

import classNames from 'classnames';

export type MessageDescriptionType =
  | React.ReactElement<React.HTMLAttributes<HTMLDivElement>>
  | string
  | null
  | undefined;

type MessageProps = React.PropsWithChildren<{
  className?: string;
  title?: React.ReactNode;
  description?: MessageDescriptionType;
  icon?: IconType;
  isError?: boolean;
}>;

const Message: React.FC<MessageProps> = ({
  className,
  title,
  description,
  icon,
  isError,
  children,
}) => {
  const style = classNames(
    'ui message',
    { negative: isError },
    { icon: !!icon },
    className,
  );

  if (description && typeof description !== 'string') {
    description = React.cloneElement(description, {
      className: classNames(description.props.className, 'description'),
    });
  }

  return (
    <div className={style}>
      <Icon icon={icon} />
      <div className="content">
        <div className="header">{title}</div>
        {description}
        {children}
      </div>
    </div>
  );
};

export default Message;
