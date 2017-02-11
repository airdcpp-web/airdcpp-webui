import React from 'react';

import TypeConvert from 'utils/TypeConvert';
import { UserMenu } from 'components/menu/DropdownMenu';
import UserIcon from 'components/icon/UserIcon';

export default (itemMenuIds) => {
	const UserItemHandlerDecorator = {
		itemNameGetter(session) {
			return session.user.nicks;
		},

		itemStatusGetter(session) {
			const { flags } = session.user;
			return TypeConvert.userOnlineStatusToColor(flags);
		},

		itemHeaderDescriptionGetter(session) {
			return session.user.hub_names;
		},

		itemHeaderIconGetter(session) {
			return <UserIcon size="large" flags={ session.user.flags } />;
		},

		itemHeaderTitleGetter(session, location, actionMenu) {
			const { user } = session;
			return (
				<UserMenu 
					user={ user } 
					ids={ itemMenuIds }
				>
					{ actionMenu }
				</UserMenu>
			);
		},
	};

	return UserItemHandlerDecorator;
};