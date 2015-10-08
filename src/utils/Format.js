import React from 'react';
import Moment from 'moment';
import { Icon, Flag } from 'react-semantify'

export default {
  formatSize: function(fileSizeInBytes) {
    if (fileSizeInBytes === undefined) {
      return undefined;
    }

    let i = 0;
    const byteUnits = [' b', ' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
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

    let bits = bytes*8;
    let i = 0;

    const bitUnits = [' bit', ' Kbit', ' Mbit', ' Gbit', ' Tbit', ' Pbit'];
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
    })
};
