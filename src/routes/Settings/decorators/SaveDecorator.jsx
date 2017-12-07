'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import { Prompt } from 'react-router-dom';
import invariant from 'invariant';

import Message from 'components/semantic/Message';
import SaveButton from '../components/SaveButton';
import NotificationActions from 'actions/NotificationActions';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


export default (Component) => {
  class SaveDecorator extends React.Component {
    static displayName = 'SaveDecorator';

    static propTypes = {
      currentMenuItem: PropTypes.object.isRequired,
    };

    static childContextTypes = {
      onFieldChanged: PropTypes.func.isRequired,
      addFormRef: PropTypes.func.isRequired,
    };

    static defaultProps = {
      saveable: true
    };

    componentWillMount() {
      this.forms = [];
      this.changedProperties = new Set();
    }

    getChildContext() {
      return {
        onFieldChanged: this.onSettingsChanged,
        addFormRef: this.saveFormRef,
      };
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.currentMenuItem.url !== this.props.currentMenuItem.url) {
        this.changedProperties.clear();
      }
    }

    onSettingsChanged = (id, value, hasChanges) => {
      if (hasChanges) {
        this.changedProperties.add(id);
      } else {
        this.changedProperties.delete(id);
      }

      this.forceUpdate();
    };

    onSettingsSaved = () => {
      NotificationActions.success({ 
        title: 'Saving completed',
        message: 'Settings were saved successfully',
      });

      this.forceUpdate();
    };

    handleSave = () => {
      invariant(this.forms.length > 0, 'No forms exist in SaveDecorator');
      const promises = this.forms.map(c => c.save());
      this.changedProperties.clear();

      return Promise.all(promises)
        .then(this.onSettingsSaved);
    };

    hasChanges = () => {
      return this.changedProperties.size > 0;
    };

    promptSave = () => {
      // Are we opening a dialog?
      // Check later if this is fixed by https://github.com/reactjs/react-router/pull/3107
      //if (nextLocation.pathname.indexOf(this.props.location.pathname) !== -1) {
      //  return null;
      //}

      const { currentMenuItem } = this.props;
      if (currentMenuItem.noSave) {
        return false;
      }

      return this.hasChanges() && LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT);
    };

    saveFormRef = (c) => {
      if (c) {
        invariant(c.hasOwnProperty('save'), 'Invalid setting form component supplied for SaveDecorator (save property missing)');
        this.forms.push(c);
      } else {
        // Switching to another page 
        // Single forms shouldn't be unmounted otherwise, but using identifiers would still be safer...
        this.forms = [];
      }
    };

    render() {
      const { currentMenuItem, children } = this.props;
      /*const children = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          formRef: this.saveFormRef,
        });
      });*/

      const message = currentMenuItem.local && (
        <Message 
          description="Settings listed on this page are browser-specific"
          icon="blue info"
        />
      );

      const saveButton = !currentMenuItem.noSave && (
        <SaveButton 
          saveHandler={ this.handleSave } 
          hasChanges={ this.hasChanges() }
          local={ currentMenuItem.local }
        />
      );

      return (
        <Component 
          { ...this.props }
          saveButton={ saveButton }
          message={ message }
        >
          <Prompt
            message="You have unsaved changes. Are you sure you want to leave?"
            when={ this.promptSave() }
          />
          { children }
        </Component>
      );
    }
  }

  return SaveDecorator;
};