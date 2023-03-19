import * as React from 'react';

const MultiValueContainer: React.FC<any> = ({ css, children, innerProps }) => {
  return (
    <a {...innerProps} className="ui label">
      {children}
    </a>
  );
};

const MultiValueLabel: React.FC<any> = ({ children }) => {
  return children;
};

const MultiValueRemove: React.FC<any> = ({ css, innerProps }) => {
  return <i {...innerProps} className="delete icon" />;
};

export const MultiSelectComponents = {
  MultiValueContainer,
  MultiValueRemove,
  MultiValueLabel,
};
