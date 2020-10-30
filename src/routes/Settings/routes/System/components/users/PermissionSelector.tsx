'use strict';;
import t from 'utils/tcomb-form';

import Checkbox from 'components/semantic/Checkbox';
import Message from 'components/semantic/Message';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { updateMultiselectValues } from 'utils/FormUtils';


type AccessOptionType = {
  value: API.AccessEnum;
  text: string;
};

const PermissionSelector = (moduleT: UI.ModuleTranslator) => {
  return t.form.Form.templates.select.clone({
    renderSelect: (locals: UI.FormLocals<AccessOptionType, API.AccessEnum[]>) => {
      const onChange = (access: API.AccessEnum, checked: boolean) => {
        locals.onChange(
          updateMultiselectValues(locals.value, access, checked)
        );
      };

      const mapPermission = ({ value, text }: UI.FormOption<API.AccessEnum>) => (
        <Checkbox 
          key={ value }
          className={ value }
          checked={ locals.value.indexOf(value) !== -1 } 
          onChange={ checked => onChange(value, checked) }
          caption={ text }
        />
      );

      const filterPermission = ({ value }: UI.FormOption<API.AccessEnum>) => {
        if (locals.value.indexOf(API.AccessEnum.ADMIN) !== -1 && value !== API.AccessEnum.ADMIN) {
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
            description={ moduleT.t<string>(
              'adminPermissionNote',
              'Administrator permission is required in order to access the System section in settings'
            ) }
            className="small"
          />
          { permissions }
        </div>
      );
    }
  });
};


export default PermissionSelector;
