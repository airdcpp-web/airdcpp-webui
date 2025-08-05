import * as API from '@/types/api';

export const toMockUser = (users: API.HubUser[]): API.User => {
  const nicks = users.map((user) => user.nick).join(', ');
  const hubNames = users.map((user) => user.hub_name).join(', ');
  const hubUrls = users.map((user) => user.hub_url);

  const mainUser = users[0];
  return {
    id: mainUser.cid,
    cid: mainUser.cid,
    nicks,
    hub_names: hubNames,
    hub_urls: hubUrls,
    flags: mainUser.flags as API.UserFlag[],
  };
};

export const toMockHintedUser = (
  mainUser: API.HubUser,
  otherUsers: API.HubUser[] = [],
): API.HintedUser => {
  const hubUrls = [mainUser.hub_url, ...otherUsers.map((user) => user.hub_url)];

  let hubName = mainUser.hub_name;
  if (otherUsers.length > 0) {
    hubName += ' (' + otherUsers.map((user) => user.hub_name).join(', ') + ')';
  }

  let nicks = mainUser.nick;
  if (otherUsers.length > 0) {
    nicks += ' (' + otherUsers.map((user) => user.nick).join(', ') + ')';
  }

  return {
    cid: mainUser.cid,
    flags: mainUser.flags,
    hub_names: hubName,
    hub_url: mainUser.hub_url,
    hub_urls: hubUrls,
    nicks,
  };
};
