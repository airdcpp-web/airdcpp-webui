import React from 'react';
import classNames from 'classnames';

import History from 'utils/History';
import tcomb from 'utils/tcomb-form';

import Button from 'components/semantic/Button';
import FileBrowserDialog from 'components/filebrowser/FileBrowserDialog';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface BrowseFieldConfig {
  historyId: string;
  isFile?: boolean;
}

export const BrowseField = tcomb.form.Form.templates.textbox.clone({
  // override default implementation
  renderInput: (locals: UI.FormLocals<any, string, BrowseFieldConfig>) => {
    let _input: HTMLInputElement;
    
    const onConfirm = (path: string) => {
      locals.onChange(path);
    };

    const parseHistoryId = () => {
      return (locals.config && !locals.value) ? locals.config.historyId : undefined;
    };

    const showBrowseDialog = () => {
      const { location } = locals.context;
      History.push(`${location.pathname}/browse`);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      locals.onChange(event.target.value);
      setTimeout(() => _input.focus());
    };

    const hasAccess = LoginStore.hasAccess(API.AccessEnum.FILESYSTEM_VIEW);
    const fieldStyle = classNames(
      'ui fluid input field',
      { 'action': hasAccess },
    );
    
    const { formT } = locals.context;
    return (
      <div className={ fieldStyle }>
        <input
          ref={ input => { 
            _input = input!;
          } }
          value={ locals.value }
          onChange={ onChange }
        />
        { hasAccess && (
          <Button
            caption={ formT.translate('Browse') }
            onClick={ showBrowseDialog }
          />
        ) }
        <FileBrowserDialog
          onConfirm={ onConfirm }
          subHeader={ locals.label }
          initialPath={ locals.value ? locals.value : '' }
          //isFile={ locals.config.isFile }
          historyId={ parseHistoryId() }
        />
      </div>
    );
  }
});
