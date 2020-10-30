import * as React from 'react';
import classNames from 'classnames';
import Icon, { IconType } from 'components/semantic/Icon';


export interface ListItemProps {
  header: React.ReactNode;
  description: React.ReactNode;
  icon?: IconType;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ header, description, icon, className, children }) => (
  <div className={ classNames('item', className) }>
    <Icon icon={ icon }/>
    <div className="content">
      <div className="header">
        { header }
      </div>
      { (description !== null && description !== undefined) && (
        <div className="description">
          { description }
        </div> 
      ) }
      { children }
    </div>
  </div>
);