import { DupeEnum } from 'constants/DupeConstants';
import { UrgencyEnum } from 'constants/UrgencyConstants';

export default {
	dupeToStringType: function (dupeEnum) {
		switch (dupeEnum) {
			case DupeEnum.SHARE_PARTIAL: return 'dupe share partial';
			case DupeEnum.SHARE_FULL: return 'dupe share full';
			case DupeEnum.QUEUE_PARTIAL: return 'dupe queue partial';
			case DupeEnum.QUEUE_FULL: return 'dupe queue full';
			case DupeEnum.QUEUE_FINISHED: return 'dupe queue finished';
			case DupeEnum.SHARE_QUEUE: return 'dupe share queue';
			default: return '';
		}
	},

	userOnlineStatusToColor: function (flags) {
		if (flags.indexOf('bot') != -1) {
			return 'blue';
		}

		if (flags.indexOf('offline') != -1) {
			return 'lightgrey';
		}

		if (flags.indexOf('away') != -1) {
			return 'yellow';
		}

		return 'green';
	},

	hubOnlineStatusToColor: function (connectState) {
		if (connectState === 'connected') {
			return 'green';
		}

		if (connectState === 'connecting') {
			return 'yellow';
		}
		
		return 'lightgrey';
	},

	urgencyToColor: function (urgencyMap) {
		switch (urgencyMap) {
			case UrgencyEnum.URGENCY_HIGH: return 'red';
			case UrgencyEnum.URGENCY_MEDIUM: return 'yellow';
			case UrgencyEnum.URGENCY_LOW: return 'blue';
			case UrgencyEnum.URGENCY_INFO: return 'grey';
			default: return '';
		}
	},
};
