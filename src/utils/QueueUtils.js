module.exports = {

  convertRawBundle: function(bundleJson) {
    //var obj = JSON.parse(bundleJson);
    //obj["added"] = new Date(bundleJson.added*1000);
    //return obj;
    return {
      token: bundleJson.token,
      target: bundleJson.target,
      size: bundleJson.size,
      time_added: new Date(bundleJson.time_added*1000),
      time_finished: bundleJson.time_finished == 0 ? 0 : new Date(bundleJson.time_finished*1000),
      status: {
        id: bundleJson.status.id,
        str: bundleJson.status.str
      },
      priority: bundleJson.priority,
      downloaded_bytes: bundleJson.downloaded_bytes,
      time_left: (bundleJson.size - bundleJson.downloaded_bytes) / bundleJson.speed,
      speed: bundleJson.speed
    };
  },

  getCreatedMessageData: function(text, currentThreadID) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      threadID: currentThreadID,
      authorName: 'Bill', // hard coded for the example
      date: new Date(timestamp),
      text: text,
      isRead: true
    };
  }

};
