import {SeverityEnum} from 'constants/LogConstants';

export default {
  getLogUnreadInfo: function(unreadCounts) {
    if (unreadCounts[SeverityEnum.ERROR] > 0) {
      return { count: unreadCounts[SeverityEnum.ERROR], color: "red" }
    } else if (unreadCounts[SeverityEnum.WARNING] > 0) {
      return { count: unreadCounts[SeverityEnum.WARNING], color: "yellow" }
    } else if (unreadCounts[SeverityEnum.INFO] > 0) {
      return { count: unreadCounts[SeverityEnum.INFO], color: "gray" }
    }

    return null;
  },

  getPrivateChatUnreadInfo: function(unreadCounts) {
    if (unreadCounts.user > 0) {
      return { count: unreadCounts.user, color: "red" }
    }

    if (unreadCounts.bot > 0) {
      return { count: unreadCounts.bot, color: "lightgray" }
    }
    
    return null;
  },

  getHubUnreadInfo: function(unreadCounts) {
    if (unreadCounts.user > 0) {
      return { count: unreadCounts.user, color: "blue" }
    }

    if (unreadCounts.bot > 0) {
      return { count: unreadCounts.bot, color: "lightgray" }
    }
    
    return null;
  },
}