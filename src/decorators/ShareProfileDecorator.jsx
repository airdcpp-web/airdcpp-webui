import ShareProfileConstants from 'constants/ShareProfileConstants';

import DataProviderDecorator from 'decorators/DataProviderDecorator';
import ValueFormat from 'utils/ValueFormat';


const ShareProfileDecorator = function (Component, listHidden, addSize = true) {
	const convertProfile = (profile) => {
		let name = profile.name;
		if (addSize && profile.id !== ShareProfileConstants.HIDDEN_PROFILE_ID) {
			name += ' (' + ValueFormat.formatSize(profile.size) + ')';
		}

		return {
			...profile,
			name,
		};
	};

	const onProfilesReceived = (data) => {
		const profiles = [];
		profiles.push(...data
			.filter(p => listHidden || p.id !== ShareProfileConstants.HIDDEN_PROFILE_ID)
			.map(convertProfile)
		);

		return profiles;
	};

	return DataProviderDecorator(Component, {
		urls: {
			profiles: ShareProfileConstants.PROFILES_URL,
		},
		dataConverters: {
			profiles: onProfilesReceived,
		},
		onSocketConnected: (addSocketListener, { refetchData }) => {
			addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_ADDED, refetchData);
			addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_UPDATED, refetchData);
			addSocketListener(ShareProfileConstants.MODULE_URL, ShareProfileConstants.PROFILE_REMOVED, refetchData);
		},
	});
};

export default ShareProfileDecorator;
