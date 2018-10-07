//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import UserActions, { ActionUserType, ActionUserData } from 'actions/UserActions';
import { getFilePath } from 'utils/FileUtils';

import UserIcon from 'components/icon/UserIcon';
import { ActionMenuDecoratorProps } from 'decorators/menu/ActionMenuDecorator';

import Icon from 'components/semantic/Icon';


export interface UserMenuDecoratorProps extends 
  Omit<ActionMenuDecoratorProps<ActionUserData>, 'actions' | 'caption' | 'itemData'> {

  user: ActionUserType;
  directory?: string;
  userIcon?: string | boolean | null;
  text?: React.ReactNode;
  className?: string;
}

type UserMenuDecoratorChildProps = ActionMenuDecoratorProps<ActionUserData>;

export default function <DropdownPropsT extends object>(
  Component: React.ComponentType<UserMenuDecoratorChildProps & DropdownPropsT>
) {
  class UserMenu extends React.PureComponent<UserMenuDecoratorProps & DropdownPropsT> {
    static defaultProps: Pick<UserMenuDecoratorProps, 'directory'> = {
      directory: '/',
    };
  
    /*static propTypes = {
      // Filelist directory to use for browsing the list
      directory: PropTypes.string,
  
      // Hinted user
      user: PropTypes.shape({
        cid: PropTypes.string,
        hub_url: PropTypes.string
      }).isRequired,
  
      // No icon is added by default
      // Set the 'simple' to use a single color icon for all users
      userIcon: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
      ]),
  
      // Optional custom caption to use
      text : PropTypes.node,
    };*/

    itemData: ActionUserData;

    constructor(props: UserMenuDecoratorProps & DropdownPropsT) {
      super(props);

      this.itemData = {} as ActionUserData;
      Object.defineProperty(this.itemData, 'user', {
        get: () => {
          return this.props.user;
        }
      });
      Object.defineProperty(this.itemData, 'directory', {
        get: () => {
          const { directory } = this.props;
          return getFilePath(directory as any as string);
        }
      });
    }

    itemDataGetter = () => {
      return this.itemData;
    }

    render() {
      const { 
        text, userIcon, user, className, 
        //@ts-ignore
        ...other 
      } = this.props;

      let nicks: React.ReactNode = text;
      if (!nicks) {
        nicks = user.nicks ? user.nicks : user.nick;
      }

      let caption = nicks;
      if (userIcon) {
        caption = (
          <div className={ classNames('icon-caption', userIcon) }>
            { userIcon === 'simple' ? <Icon icon="blue user icon"/> : <UserIcon size="large" flags={ user.flags }/> }
            { nicks }
          </div>
        );
      }

      return (
        <Component 
          { ...other }
          className={ classNames('user-menu', className) }
          caption={ caption }
          actions={ UserActions } 
          itemData={ this.itemDataGetter }
        />
      );
    }
  }

  return UserMenu;
}
