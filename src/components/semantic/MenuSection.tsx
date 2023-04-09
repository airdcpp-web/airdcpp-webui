import * as React from 'react';
import Icon, { IconType } from './Icon';

export type MenuSectionProps = React.PropsWithChildren<{
  caption?: React.ReactNode;
  icon?: IconType;
}>;

const MenuSection: React.FC<MenuSectionProps> = ({ caption, icon, children }) => {
  if (React.Children.count(children) === 0) {
    return null;
  }

  return (
    <>
      {!!caption && (
        <div className="header">
          {!icon ? (
            caption
          ) : (
            <>
              <Icon icon={icon} />
              {caption}
            </>
          )}
        </div>
      )}
      {children}
    </>
  );
};

export default MenuSection;
