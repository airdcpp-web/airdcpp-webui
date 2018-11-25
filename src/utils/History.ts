import invariant from 'invariant';

import { createBrowserHistory } from 'history';

import { Location, LocationDescriptorObject } from 'history';


const History = createBrowserHistory({
  // Remove the trailing slash from base path
  basename: getBasePath().slice(0, -1),		
});

const Helpers = {
  // Uses replace instead if the next path matches the current one regardless of the state or other properties
  // Note that the regular history functions will ignore fully identical locations in 
  // any case so there's no need to check that manually
  pushUnique(nextLocation: LocationDescriptorObject, currentLocation: Location) {
    invariant(currentLocation, 'pushUnique: current location was not supplied');
    if (nextLocation.pathname !== currentLocation.pathname) {
      History.push(nextLocation);
    } else {
      History.replace(nextLocation);
    }
  },
};

export default Object.assign(History, Helpers);
