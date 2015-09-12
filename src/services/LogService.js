import {LOG_URL} from '../constants/MainConstants';
import QueueActions from '../actions/QueueActions';
import QueueStore from '../stores/QueueStore.js';
import { del, post, get, put } from '../service/SocketService';

class QueueService {

  getBundles() {
    get(SocketStore.socket, LOG_URL);
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
