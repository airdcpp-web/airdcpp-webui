import React from 'react';

export default function (store, fetchAction) {
	let sessions = [];

	fetchAction.listen(data => {
		sessions = data;
		store.trigger(sessions);
	});

	const countUnread = (type) => {
		return sessions.reduce((count, session) => session.unread_messages[type] > 0 ? count + 1 : count, 0);
	};

	store.getUnreadCounts = () => {
		return {
			user: countUnread('user'),
			bot: countUnread('bot'),
			status: countUnread('status'),
		};
	};

	store.getSession = (id) => {
		return sessions.find(session => session.id == id);
	};

	store.getSessions = () => {
		return sessions;
	};

	store._onSessionCreated = (data) =>	{
		sessions = React.addons.update(sessions, { $push: [ data ] });
		store.trigger(sessions);
	};

	store._onSessionUpdated = (data, id) => {
		const session = store.getSession(id);
		sessions[sessions.indexOf(session)] = React.addons.update(session, { $merge: data });
		store.trigger(sessions);
	};

	store._onSessionRemoved = (data) => {
		const index = sessions.indexOf(store.getSession(data.id));
		sessions = React.addons.update(sessions, { $splice: [ [ index, 1 ] ] });
		store.trigger(sessions);
	};

	return store;
};
