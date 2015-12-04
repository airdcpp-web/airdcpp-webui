import React from 'react';

import TypeConvert from 'utils/TypeConvert';
import { UserMenu } from 'components/Menu';
import { UserIconFormatter } from 'utils/IconFormat';

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
			if (!session) {
				return 'New';
			}

			return session.user.hub_names;
		},

		itemIconGetter(session) {
			if (!session) {
				return null;
			}

			return <UserIconFormatter size="large" flags={session.user.flags} />;
		},

		itemHeaderGetter(session, location) {
			if (!session) {
				return 'New';
			}

			const { user } = session;
			return (
				<UserMenu 
					location={ location }
					user={ user } 
					ids={ itemMenuIds }
				/>
			);
		},
	};

	return Object.assign(ItemHandler, UserItemHandlerDecorator);
};