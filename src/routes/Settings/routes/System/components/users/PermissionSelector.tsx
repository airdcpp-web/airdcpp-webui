'use strict';

import React from 'react';

import update from 'immutability-helper';
import t from 'utils/tcomb-form';

import Checkbox from 'components/semantic/Checkbox';
import Message from 'components/semantic/Message';


const ReactSelect = t.form.Form.templates.select.clone({
  renderSelect: (locals: UI.FormLocals<API.AccessId, API.AccessId[]>) => {
    const onChange = (access: API.AccessId, checked: boolean) => {
      let values: API.AccessId[] = locals.value;
      if (checked) {
        values = [ ...values, access ];
      } else {
        const index = values.indexOf(access);
        values = update(values, { $splice: [ [ index, 1 ] ] });
      }

      locals.onChange(values);
    };

    const mapPermission = ({ value, text }: UI.FormOption<API.AccessId>) => (
      <Checkbox 
        key={ value }
        className={ value }
        checked={ locals.value.indexOf(value) !== -1 } 
        onChange={ checked => onChange(value, checked) }
        caption={ text }
      />
    );

    const filterPermission = ({ value }: UI.FormOption<API.AccessId>) => {
      if (locals.value.indexOf(API.AccessId.ADMIN) !== -1 && value !== API.AccessId.ADMIN) {
        return false;
      }

      return true;
    };

    const permissions = locals.options
      .filter(filterPermission)
      .map(mapPermission);

    return (
      <div className="permission-select">
        <Message 
          description="Administrator permission is required in order to access the System section in settings"
          className="small"
        />
        { permissions }
      </div>
    );
  }
});

export default ReactSelect;
