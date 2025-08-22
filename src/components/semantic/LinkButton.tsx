import * as React from 'react';

import classNames from 'classnames';

import 'fomantic-ui-css/components/button.min.css';

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  caption: React.ReactNode;
}

// There's no link button style in Semantic UI at the moment
// https://github.com/Semantic-Org/Semantic-UI/issues/4805
const LinkButton: React.FC<LinkButtonProps> = ({ className, caption, ...other }) => {
  const buttonStyle = classNames('button link', className);
  const onKeyDown = (evt: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      // Trigger the click event
      evt.currentTarget.click();
    }
  };

  return (
    <a
      className={buttonStyle}
      tabIndex={0}
      role="button"
      onKeyDown={onKeyDown}
      {...other}
    >
      {caption}
    </a>
  );
};

export default LinkButton;
