import React from 'react';
import Moment from 'moment';
import { Icon, Flag } from 'react-semantify'

import ActionMenu from '../components/ActionMenu'
import UserActions from '../actions/UserActions'
import DownloadActions from '../actions/DownloadActions'

module.exports = {
  formatSize: function(fileSizeInBytes) {
    if (fileSizeInBytes === undefined) {
      return undefined;
    }

    var i = 0;
    var byteUnits = [' b', ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.0).toFixed(2) + byteUnits[i];
  },

  formatSpeed: function(bytesPerSecond, formatter) {
    if (bytesPerSecond === undefined) {
      return undefined;
    }
    
    return formatter.formatSize(bytesPerSecond) + "/s";
  },

  formatSpeedIfRunning: function(bytesPerSecond) {
    if (bytesPerSecond === undefined) {
      return undefined;
    }

    if (bytesPerSecond == 0) {
      return '';
    }

    return this.formatSize(bytesPerSecond) + "/s";
  },

  formatConnection: function(bytes) {
    if (bytes === undefined) {
      return undefined;
    }

    var bits = bytes*8;

    var i = 0;
    var bitUnits = [' bit', ' Kbit', ' Mbit', ' Gbit', ' Tbit', ' Pbit'];
    do {
        bits = bits / 1000;
        i++;
    } while (bits > 1000);

    return Math.max(bits, 0.0).toFixed(2) + bitUnits[i] + "/s";
  },

  formatDateTime: function(time) {
    if (time === undefined) {
      return undefined;
    }

    if (time == 0) {
      return '';
    }

    return Moment.unix(time).format("LLL");
  },

  formatTimestamp: function(time) {
    if (time === undefined) {
      return undefined;
    }

    if (time == 0) {
      return '';
    }

    //return Moment.unix(time).format("LTS");
    return Moment.unix(time).format("HH:mm:ss");
  },

  formatBool: function(value) {
    return value ? "Yes" : "No";
  },

  formatDecimal: function(value) {
    if (!value) {
      return undefined;
    }

    return parseFloat(Math.round(value * 100) / 100).toFixed(2);
  },

  FileNameFormatter: React.createClass({
      typeToIcon: function(name) {
        switch(name) {
          case "directory": return "file outline yellow folder";
          case "audio": return "file outline audio";
          case "compressed": return "file outline archive";
          case "document": return "edit";
          case "executable": return "browser";
          case "picture": return "file outline image";
          case "video": return "file outline video";
          default: return "file outline";
        }
      },

      render: function() {
        return (
          <div>
          <Icon className={ "large " + this.typeToIcon(this.props.type) }/>
          { this.props.children }
          </div>
        );
      }
    }),

  IpFormatter: React.createClass({
      render: function() {
        const { country_id } = this.props.item;
        return (
          <div>
          <Flag className={ country_id.length === 0 ? "icon grey " : country_id.toLowerCase() }/>
          { this.props.item.str }
          </div>
        );
      }
    }),

    UserFormatter: React.createClass({
      propTypes: {

        /**
         * Filelist directory to use for browsing the list
         */
        directory: React.PropTypes.string,

        /**
         * Hinted user
         */
        user: React.PropTypes.shape({
          cid: React.PropTypes.string,
          hub_url: React.PropTypes.string
        }).isRequired
      },

      getDefaultProps() {
        return {
          directory: '/'
        }
      },

      render: function() {
        const { directory, user } = this.props;
        const data = {
          user: user,
          directory: directory
        }

        var caption = (
          <div>
            <Icon className="blue user"/>
            { user.nicks }
          </div>);

        return <ActionMenu caption={ caption } actions={ UserActions } ids={[ "browse", "message" ]} itemData={ data }/>;
      }
    }),

  DownloadMenu: React.createClass({
      propTypes: {

        /**
         * Item ID to be passed to the handler
         */
        id: React.PropTypes.number,

        /**
         * Function for handling the download
         */
        handler: React.PropTypes.func.isRequired
      },

      render: function() {
        const { handler, id } = this.props;
        const data = {
          id: id,
          handler: handler
        }

        return <ActionMenu caption={ this.props.caption } actions={ DownloadActions } ids={[ "download", "downloadTo" ]} itemData={ data }/>;
      }
    })
};
