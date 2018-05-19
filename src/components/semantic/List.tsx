import React from 'react';
import classNames from 'classnames';
import Icon, { IconType } from 'components/semantic/Icon';


export interface ListItemProps {
  header: React.ReactNode;
  description: React.ReactNode;
  icon: IconType;
  className?: string;
}

export const ListItem: React.SFC<ListItemProps> = ({ header, description, icon, className, children }) => (
  <div className={ classNames('item', className) }>
    <Icon icon={ icon }/>
    <div className="content">
      <div className="header">
        { header }
      </div>
      { !!description && (
        <div className="description">
          { description }
        </div> 
      ) }
      { children }
    </div>
  </div>
);