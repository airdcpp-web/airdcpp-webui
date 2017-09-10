import PropTypes from 'prop-types';
import React from 'react';

import FormattedFile from 'components/format/FormattedFile';
import ValueFormat from 'utils/ValueFormat';


const FileItem = ({ item, itemClickHandler, itemIconGetter }) => {
  const isFile = item.type.id === 'file';
  return (
    <tr>
      <td>
        <FormattedFile 
          typeInfo={ item.type } 
          onClick={ isFile ? null : evt => itemClickHandler(item.name) }
          caption={ item.name }
        />
        { !!itemIconGetter && itemIconGetter(item) }
      </td>
      <td>
        { !!isFile && ValueFormat.formatSize(item.size) }
      </td>
    </tr>
  );
};

const FileItemList = React.createClass({
  propTypes: {
    /**
		 * Function handling the path selection. Receives the selected path as argument.
		 */
    itemClickHandler: PropTypes.func.isRequired,

    /**
		 * Function handling the path selection. Receives the selected path as argument.
		 */
    itemIconGetter: PropTypes.func,

    /**
		 * Array of path objects to list
		 */
    items: PropTypes.array.isRequired,
  },

  sort(a, b) {
    if (a.type.id !== b.type.id && (a.type.id === 'directory' || b.type.id === 'directory')) {
      return a.type.id === 'directory' ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  },

  render: function () {
    const { items, itemClickHandler, itemIconGetter } = this.props;
    return (
      <div className="table-container">
        <table className="ui striped compact table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            { items.sort(this.sort).map(item => (
              <FileItem 
                key={ item.name }
                item={ item }
                itemClickHandler={ itemClickHandler }
                itemIconGetter={ itemIconGetter }
              />
            )) }
          </tbody>
        </table>
      </div>
    );
  }
});

export default FileItemList;