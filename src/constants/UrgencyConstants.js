import { SeverityEnum } from 'constants/LogConstants';

const UrgencyEnum = {
	URGENCY_HIGH: 5,
	URGENCY_MEDIUM: 3,
	URGENCY_LOW: 2,
	URGENCY_INFO: 1,
	URGENCY_STATUS: 0,
};

export default {
	UrgencyEnum: UrgencyEnum,
	HubMessageUrgencies: {
		status: UrgencyEnum.URGENCY_STATUS,
		bot: UrgencyEnum.URGENCY_INFO,
		user: UrgencyEnum.URGENCY_LOW,
	},

	PrivateMessageUrgencies: {
		status: UrgencyEnum.URGENCY_STATUS,
		bot: UrgencyEnum.URGENCY_INFO,
		user: UrgencyEnum.URGENCY_HIGH,
	},

	LogMessageUrgencies: {
		[SeverityEnum.INFO]: UrgencyEnum.URGENCY_INFO,
		[SeverityEnum.WARNING]: UrgencyEnum.URGENCY_MEDIUM,
		[SeverityEnum.ERROR]: UrgencyEnum.URGENCY_HIGH,
	},
};
