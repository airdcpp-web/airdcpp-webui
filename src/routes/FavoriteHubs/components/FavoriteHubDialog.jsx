import React from 'react';
import Modal from '../../../components/semantic/Modal'
import { PROFILES_GET_URL, HIDDEN_PROFILE_ID } from '../../../constants/ShareConstants'
import { FAVORITE_HUB_URL } from '../../../constants/FavoriteHubConstants'
import SocketService from '../../../services/SocketService'
import { RouteContext } from 'react-router'

import t from 'tcomb-form';
import _ from 'lodash';

var semantic = require('tcomb-form/lib/templates/semantic');
t.form.Form.templates = semantic;

var Form = t.form.Form;
var Entry = t.struct({
  name: t.Str,
  hub_url: t.Str,
  hub_description: t.maybe(t.Str),
  share_profile: t.Num,
  auto_connect: t.Bool,
  nick: t.maybe(t.Str),
  user_description: t.maybe(t.Str),
});

export default React.createClass({
  mixins: [ RouteContext ],
  getInitialState() {
    this._isNew = !this.props.location.state.hubEntry;
    if (!this._isNew) {
      let value = _.clone(this.props.location.state.hubEntry);
      value["share_profile"] = value.share_profile.id;

      this.checkAdcHub(value.hub_url);
      return {
        value: value,
        profiles: []
      };
    } else {
      return {
        value: null,
        profiles: []
      };
    }

  },

  addProfile(profiles, rawItem) {
    if (rawItem.id != HIDDEN_PROFILE_ID) {
      if (rawItem.default) {
        this.defaultId = rawItem.id;
      }

      profiles.push({
        value:rawItem.id,
        text:rawItem.str
      });
    }
    return profiles;
  },

  componentDidMount() {
    SocketService.get(PROFILES_GET_URL)
      .then(data => {
        this.setState({ profiles: data.reduce(this.addProfile, this.state.profiles) });
      })
      .catch(error => 
        console.error("Failed to load profiles: " + error)
      );
  },

  checkAdcHub(hubUrl) {
    this.isAdcHub = hubUrl.indexOf("adc://") == 0 || hubUrl.indexOf("adcs://") == 0;
  },

  onChange(value, path) {
    if (path.indexOf("hub_url") > -1) {
      this.checkAdcHub(value.hub_url);
      if (!this.isAdcHub) {
        value.share_profile = this.defaultId;
      }
    }

    this.refs.form.getComponent(path).validate();
    this.setState({value});
  },

  save() {
    var value = this.refs.form.getValue();
    if (value) {
      if (this._isNew) {
        SocketService.post(FAVORITE_HUB_URL, value);
      } else {
        SocketService.put(FAVORITE_HUB_URL + "/" + this.props.location.state.hubEntry.id, value);
      }
      return true;
    }

    return false;
  },

  render: function() {
    var options = {
      fields: {
        share_profile: {
          factory: t.form.Select,
          options: this.state.profiles,
          nullOption: false,
          disabled: !this.isAdcHub,
          transformer: {
            format: v => String(v),
            parse: v => parseInt(v, 10)
          }
        }
      }
    }

    var title = this._isNew ? "Add favorite hub" : "Edit favorite hub";
    return (
      <Modal className="fav-hub" title={title} saveHandler={this.save} closable={false} icon="yellow star" {...this.props}>
        <Form
          ref="form"
          type={Entry}
          options={options}
          value={this.state.value}
          onChange={this.onChange}
        />
      </Modal>);
  }
});