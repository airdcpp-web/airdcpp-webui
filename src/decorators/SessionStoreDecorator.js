import update from 'react-addons-update';

const SessionStoreDecorator = function (store, actions) {
	let sessions = [];
	let activeSession = null;

	actions.sessionChanged.listen(id => {
		activeSession = id;
	});

	actions.fetchSessions.completed.listen(data => {
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

	store.getActiveSession = () => activeSession;

	store._onSessionCreated = (data) =>	{
		sessions = update(sessions, { $push: [ data ] });
		store.trigger(sessions);
	};

	store._onSessionUpdated = (data, id) => {
		const session = store.getSession(id);
		if (!session) {
			console.error('Update received for a non-existing session', id);
			return;
		}

		// Active tab?
		if (data.unread_messages && id === activeSession &&
			(data.unread_messages.user > 0 || 
				data.unread_messages.bot > 0 || 
				data.unread_messages.status > 0)) {

			actions.setRead(id);

			data.unread_messages.user = 0;
			data.unread_messages.bot = 0;
			data.unread_messages.status = 0;
		}

		sessions[sessions.indexOf(session)] = update(session, { $merge: data });
		store.trigger(sessions);
	};

	store._onSessionRemoved = (data) => {
		const index = sessions.indexOf(store.getSession(data.id));
		sessions = update(sessions, { $splice: [ [ index, 1 ] ] });
		store.trigger(sessions);
	};

	return store;
};

export default SessionStoreDecorator;
