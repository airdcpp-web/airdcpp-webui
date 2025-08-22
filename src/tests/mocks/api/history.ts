import { HubADC1 } from './hubs';
import { PrivateChat1, PrivateChat2, PrivateChat3 } from './private-chat';

export const HistoryStringPathResponse = [
  '/home/airdcpp/Downloads/',
  '/mnt/disk1/Images/',
];

export const HistoryPrivateChatResponse = [
  {
    description: '',
    hub_url: 'adcs://web-dev.airdcpp.net:1511',
    last_opened: 1754075755,
    name: PrivateChat1.user.nicks,
    user: PrivateChat1.user,
  },
  {
    description: '',
    hub_url: 'adcs://web-dev.airdcpp.net:1511',
    last_opened: 1754075751,
    name: PrivateChat2.user.nicks,
    user: PrivateChat2.user,
  },
  {
    description: '',
    hub_url: 'adcs://webdemo.airdcpp.net:2780',
    last_opened: 1754075744,
    name: PrivateChat3.user.nicks,
    user: PrivateChat3.user,
  },
];

export const HistoryHubResponse = [
  {
    description: 'This is a NMDC hub description',
    hub_url: 'hub_history_nmdc.org',
    last_opened: 1731070959,
    name: 'NMDC hub',
    user: null,
  },
  {
    description: '',
    hub_url: 'adc://[::1]:2780',
    last_opened: 1726396718,
    name: 'adc://[::1]:2780',
    user: null,
  },
  {
    description: 'https://www.google.com',
    hub_url: 'adcs://adc_history2.org',
    last_opened: 1726391743,
    name: 'ADCH++',
    user: null,
  },
];

export const HistoryHubSearchResponse = [
  {
    description: HubADC1.identity.description,
    hub_url: HubADC1.hub_url,
    last_opened: 1731070959,
    name: HubADC1.identity.name,
    user: null,
  },
  ...HistoryHubResponse,
];
