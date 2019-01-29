import React from 'react';
import classNames from 'classnames';

import History from 'utils/History';
import t from 'utils/tcomb-form';

import Button from 'components/semantic/Button';
import FileBrowserDialog from 'components/filebrowser/FileBrowserDialog';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import { FormContext } from './Form';


const BrowseField = t.form.Form.templates.textbox.clone({
  // override default implementation
  renderInput: (locals: any) => {
    let _input: HTMLInputElement;
    
    const onConfirm = (path: string) => {
      locals.onChange(path);
    };

    const parseHistoryId = () => {
      return (locals.config && !locals.value) ? locals.config.historyId : undefined;
    };

    const showBrowseDialog = () => {
      const { location } = locals.context as FormContext;
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
            caption="Browse"
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

export default BrowseField;