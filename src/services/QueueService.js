import {BUNDLES_URL, BUNDLE_URL} from '../constants/QueueConstants';
import QueueActions from '../actions/QueueActions';
import QueueStore from '../stores/QueueStore.js';
import { del, post, get, put } from '../utils/RestAPI';

class QueueService {

  getBundles() {
    var request = get(BUNDLES_URL + "/0/100");
    request.end(function(err, res){
      if (err) {
        alert("Failed to receive bundles: " + err);
        return;
      }

      QueueActions.gotBundles(res.body);
    });
  }

  setBundlePriority(priorityId, bundleToken) {
    var request = put(BUNDLE_URL + '/' + bundleToken);
    request.send({ priority: priorityId });
    request.end(function(err, res){
      if (err) {
        alert("Failed to set bundle priority: " + err);
        return;
      }
    });
  }
}

export default new QueueService()
