import * as React from 'react';

import SectionedDropdown, {
  SectionedDropdownProps,
} from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import ActionMenuDecorator, {
  ActionMenuDecoratorChildProps,
} from 'decorators/menu/ActionMenuDecorator';

export interface ActionMenuProps extends SectionedDropdownProps {
  header?: React.ReactNode;
}

const ActionDropdownMenu = ({
  header,
  children,
  ...other
}: ActionMenuProps & ActionMenuDecoratorChildProps) => (
  <SectionedDropdown {...other}>
    <MenuSection caption={header}>{children()}</MenuSection>
  </SectionedDropdown>
);

const ActionMenuDecorated = ActionMenuDecorator<ActionMenuProps, any>(ActionDropdownMenu);

export { ActionMenuDecorated as ActionMenu };
