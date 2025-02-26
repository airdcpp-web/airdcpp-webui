import * as React from 'react';
import classNames from 'classnames';
import invariant from 'invariant';

import * as UI from '@/types/ui';

import { ActionUserData } from '@/actions/ui/user';
import { getFilePath } from '@/utils/FileUtils';

import UserIcon from '@/components/icon/UserIcon';

import Icon from '@/components/semantic/Icon';
import IconConstants from '@/constants/IconConstants';
import { ActionMenuDecoratorProps } from './ActionMenuDecorator';
import { UserActionMenu } from '@/actions/ui/user';

export type UserMenuDecoratorProps = Omit<
  ActionMenuDecoratorProps<ActionUserData, UI.ActionMenuItemEntityValueType>,
  'actions' | 'caption' | 'itemData'
> &
  React.PropsWithChildren<{
    user: UI.ActionUserType;
    directory?: string;
    userIcon?: string | boolean | null;
    text?: React.ReactNode;
    className?: string;
  }>;

type UserMenuDecoratorChildProps = ActionMenuDecoratorProps<
  ActionUserData,
  UI.ActionMenuItemEntityValueType
>;

export default function <DropdownPropsT extends object>(
  Component: React.ComponentType<UserMenuDecoratorChildProps & DropdownPropsT>,
) {
  class UserMenu extends React.PureComponent<UserMenuDecoratorProps & DropdownPropsT> {
    static readonly defaultProps: Pick<UserMenuDecoratorProps, 'directory'> = {
      directory: '/',
    };

    itemData: ActionUserData;

    constructor(props: UserMenuDecoratorProps & DropdownPropsT) {
      super(props);

      this.itemData = {} as ActionUserData;
      Object.defineProperty(this.itemData, 'id', {
        get: () => {
          return this.getUserId();
        },
      });
      Object.defineProperty(this.itemData, 'user', {
        get: () => {
          return this.props.user;
        },
      });
      Object.defineProperty(this.itemData, 'directory', {
        get: () => {
          const { directory } = this.props;
          return getFilePath(directory as any as string);
        },
      });
    }

    getUserId = () => {
      const { user } = this.props;

      // User/online user
      if (!!user.id) {
        return user.id;
      }

      // Hinted user
      if (!!user.hub_url) {
        return {
          cid: user.cid,
          hub_url: user.hub_url,
        };
      }

      invariant(
        false,
        'Invalid user object in UserMenuDecorator: id and hub_url missing',
      );
    };

    itemDataGetter = () => {
      return this.itemData;
    };

    render() {
      const { text, userIcon, user, className } = this.props;

      let nicks: React.ReactNode = text;
      if (!nicks) {
        nicks = user.nicks ? user.nicks : user.nick;
      }

      let caption = nicks;
      if (userIcon) {
        caption = (
          <div className={classNames('icon-caption', userIcon)}>
            {userIcon === 'simple' ? (
              <Icon icon={IconConstants.USER} color="blue" />
            ) : (
              <UserIcon size="large" flags={user.flags} />
            )}
            {nicks}
          </div>
        );
      }

      return (
        <Component
          {...this.props}
          className={classNames('user-menu', className)}
          caption={caption}
          actions={UserActionMenu}
          itemData={this.itemDataGetter}
        />
      );
    }
  }

  return UserMenu;
}
