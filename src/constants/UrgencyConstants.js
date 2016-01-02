import { SeverityEnum } from 'constants/LogConstants';

export const UrgencyEnum = {
	HIGH: 5,
	MEDIUM: 3,
	LOW: 2,
	INFO: 1,
	STATUS: 0,
};

export const HubMessageUrgencies = {
	status: UrgencyEnum.STATUS,
	bot: UrgencyEnum.INFO,
	user: UrgencyEnum.LOW,
};

export const PrivateMessageUrgencies = {
	status: UrgencyEnum.STATUS,
	bot: UrgencyEnum.INFO,
	user: UrgencyEnum.HIGH,
};

export const LogMessageUrgencies = {
	[SeverityEnum.INFO]: UrgencyEnum.INFO,
	[SeverityEnum.WARNING]: UrgencyEnum.MEDIUM,
	[SeverityEnum.ERROR]: UrgencyEnum.HIGH,
};
