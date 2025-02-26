import * as React from 'react';

import MenuItemLink from '@/components/semantic/MenuItemLink';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import {
  ActionHandlerDecorator,
  ActionClickHandler,
} from '@/decorators/ActionHandlerDecorator';
import {
  ShareProfileActionModule,
  ShareProfileCloneAction,
  ShareProfileCreateAction,
} from '@/actions/ui/share';
import SectionedDropdown from '@/components/semantic/SectionedDropdown';
import MenuSection from '@/components/semantic/MenuSection';
import IconConstants from '@/constants/IconConstants';
import { translateActionName } from '@/utils/ActionUtils';
import { formatProfileNameWithSize } from '@/utils/ShareProfileUtils';
import { Formatter, useFormatter } from '@/context/FormatterContext';
import { useSession } from '@/context/SessionContext';

const getProfileItem = (
  profile: API.ShareProfile,
  formatter: Formatter,
  onClickAction: ActionClickHandler<API.ShareProfile>,
) => {
  return (
    <MenuItemLink
      key={profile.id}
      onClick={() =>
        onClickAction({
          action: ShareProfileCloneAction,
          itemData: profile,
          moduleData: ShareProfileActionModule,
          entity: undefined,
        })
      }
      icon={IconConstants.COPY}
    >
      {formatProfileNameWithSize(profile, formatter)}
    </MenuItemLink>
  );
};

export interface ShareProfileCloneDropdownProps {
  profiles: API.ShareProfile[];
  moduleT: UI.ModuleTranslator;
}

const ShareProfileCloneDropdown: React.FC<ShareProfileCloneDropdownProps> = ({
  profiles,
  moduleT,
}) => {
  const { hasAccess } = useSession();
  const formatter = useFormatter();
  if (!hasAccess(ShareProfileCreateAction.access)) {
    return null;
  }

  return (
    <ActionHandlerDecorator<API.ShareProfile | void>>
      {({ onClickAction }) => {
        return (
          <SectionedDropdown
            caption={moduleT.translate('Add profile')}
            className="clone-profile"
            button={true}
          >
            <MenuItemLink
              onClick={() => {
                onClickAction({
                  itemData: undefined,
                  action: ShareProfileCreateAction,
                  entity: undefined,
                  moduleData: ShareProfileActionModule,
                });
              }}
              icon={IconConstants.CREATE}
            >
              {translateActionName(
                ShareProfileCreateAction,
                ShareProfileActionModule,
                moduleT.plainT,
              )}
            </MenuItemLink>
            <MenuSection caption={moduleT.translate('Clone from an existing profile')}>
              {profiles.map((profile) =>
                getProfileItem(profile, formatter, onClickAction),
              )}
            </MenuSection>
          </SectionedDropdown>
        );
      }}
    </ActionHandlerDecorator>
  );
};

export default ShareProfileCloneDropdown;
