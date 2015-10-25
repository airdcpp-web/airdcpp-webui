import React from 'react';
import Moment from 'moment';
import { Icon, Flag } from 'react-semantify'

import DupeEnum from 'constants/DupeConstants'

export default {
	dupeToStringType: function(dupeEnum) {
		switch(dupeEnum) {
			case DupeEnum.SHARE_PARTIAL: return 'dupe share partial';
			case DupeEnum.SHARE_FULL: return 'dupe share full';
			case DupeEnum.QUEUE_PARTIAL: return 'dupe queue partial';
			case DupeEnum.QUEUE_FULL: return 'dupe queue full';
			case DupeEnum.QUEUE_FINISHED: return 'dupe queue finished';
			case DupeEnum.SHARE_QUEUE: return 'dupe share queue';
			default: return '';
		}
	},

	userOnlineStatusToColor: function(flags) {
		if (flags.indexOf("offline") != -1) {
			return "lightgrey";
		}

		if (flags.indexOf("away") != -1) {
			return "yellow";
		}

		return "green";
	},

	hubOnlineStatusToColor: function(connectState) {
		if (connectState === "connected") {
			return "green";
		}

		if (connectState === "connecting") {
			return "yellow";
		}
		
		return "lightgrey";
	},	
};
