import React from 'react';

import TypeConvert from 'utils/TypeConvert';
import { UserMenu } from 'components/menu/DropdownMenu';
import UserIcon from 'components/icon/UserIcon';

export default (ItemHandler, itemMenuIds) => {
	const UserItemHandlerDecorator = {
		itemNameGetter(session) {
			return session.user.nicks;
		},

		itemStatusGetter(session) {
			const { flags } = session.user;
			return TypeConvert.userOnlineStatusToColor(flags);
		},

		itemDescriptionGetter(session) {
			return session.user.hub_names;
		},

		itemIconGetter(session) {
			return <UserIcon size="large" flags={session.user.flags} />;
		},

		itemHeaderGetter(session, location, actionMenu) {
			const { user } = session;
			return (
				<UserMenu 
					location={ location }
					user={ user } 
					ids={ itemMenuIds }
				>
					{ actionMenu }
				</UserMenu>
			);
		},
	};

	return Object.assign(ItemHandler, UserItemHandlerDecorator);
};