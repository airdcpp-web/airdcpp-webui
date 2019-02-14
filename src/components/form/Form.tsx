//import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import NotificationActions from 'actions/NotificationActions';

import { 
  normalizeSettingValueMap, parseDefinitions, parseFieldOptions, 
  setFieldValueByPath, findFieldValueByPath, reduceChangedFieldValues, 
  //translateFormProperty 
} from 'utils/FormUtils';
import tcomb from 'utils/tcomb-form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import './style.css';

import { ErrorResponse, FieldError } from 'airdcpp-apisocket';
import { Translation } from 'react-i18next';
import { FormContext } from 'types/ui';
import i18next from 'i18next';

const TcombForm = tcomb.form.Form;


// Reduces an array of field setting objects by calling props.onFieldSetting
const fieldOptionReducer = (
  reducedOptions: { [key: string]: any }, 
  fieldDefinitions: UI.FormFieldDefinition,
  onFieldSetting: FormFieldSettingHandler<UI.FormValueMap> | undefined,
  t: i18next.TFunction,
  formValue: Partial<UI.FormValueMap>
) => {
  //const { onFieldSetting, t } = props;
  reducedOptions[fieldDefinitions.key] = parseFieldOptions(fieldDefinitions, t);

  /*const tmp = (
    name: UI.TranslatableFormDefinitionProperties, 
    caption: string, 
    extraKeyPostfix: string | undefined
  ) => {
    translateFormProperty(name, caption, extraKeyPostfix, fieldDefinitions, t);
  };*/

  if (onFieldSetting) {
    onFieldSetting(fieldDefinitions.key, reducedOptions[fieldDefinitions.key], formValue);
  }

  if (fieldDefinitions.type === API.SettingTypeEnum.STRUCT) {
    reducedOptions[fieldDefinitions.key].fields = {};
    fieldDefinitions.definitions!.reduce(
      (reduced, cur) => fieldOptionReducer(reduced, cur, onFieldSetting, t, formValue), 
      reducedOptions[fieldDefinitions.key].fields
    );
  }

  return reducedOptions;
};

// Returns an options object for Tcomb form
const getFieldOptions = (
  fieldDefinitions: UI.FormFieldDefinition[],
  onFieldSetting: FormFieldSettingHandler<UI.FormValueMap> | undefined,
  t: i18next.TFunction,
  formValue: Partial<UI.FormValueMap>,
  error: FieldError | null
) => {
  const options = {
    // Parent handlers
    fields: fieldDefinitions.reduce(
      (reduced, cur) => fieldOptionReducer(reduced, cur, onFieldSetting, t, formValue), 
      {}
    ),
  };

  // Do we have an error object from the API?
  // Show the error message for the respective field
  //const { error } = this.state;
  if (!!error) {
    options.fields[error.field] = {
      ...options.fields[error.field],
      error: error.message,
      hasError: true,
    };
  }

  return options;
};


export type FormFieldSettingHandler<ValueType = UI.FormValueMap> = (
  key: string, 
  definitions: UI.FormFieldDefinition[], 
  formValue: Partial<ValueType>,
  /*translationHandler: (
    propName: UI.TranslatableFormDefinitionProperties, 
    caption: string, 
    extraKeyPostfix: string
  ) => string*/
) => void;

export type FormSaveHandler<ValueType> = (
  changedFields: Partial<ValueType>, 
  allFields: Partial<ValueType>
) => Promise<void>;

export type FormFieldChangeHandler<ValueType = UI.FormValueMap> = (
  key: string, 
  formValue: Partial<ValueType>, 
  valueChanged: boolean
) => null | void | Promise<Partial<ValueType>>;

export type FormSourceValueUpdateHandler<ValueType = UI.FormValueMap> = (sourceValue: Partial<ValueType>) => void;

export interface FormProps<ValueType extends Partial<UI.FormValueMap> = UI.FormValueMap> 
  extends Pick<FormContext, 'location'> {

  fieldDefinitions: UI.FormFieldDefinition[];
  value?: ValueType;
  onSave: FormSaveHandler<ValueType>;
  onSourceValueUpdated?: FormSourceValueUpdateHandler<ValueType>;
  onFieldSetting?: FormFieldSettingHandler<ValueType>;
  onFieldChanged?: FormFieldChangeHandler<ValueType>;
  title?: string;
  className?: string;
}

interface State<ValueType> {
  error: FieldError | null;
  formValue: Partial<ValueType>;
}

type Props<ValueType> = FormProps<ValueType>;
class Form<ValueType extends Partial<UI.FormValueMap> = UI.FormValueMap> extends React.Component<Props<ValueType>> {
  /*static propTypes = {
    // Form items to list
    fieldDefinitions: PropTypes.array.isRequired,

    // Optional callback for appending field settings
    // Receives the field key, field definitions and the current form value as parameters
    onFieldSetting: PropTypes.func,

    // Called when the form is saved
    // Receives the changed fields as parameter
    // Must return promise
    onSave: PropTypes.func.isRequired,

    // Optional callback that is called when a field value was changed
    // Receives the field key, current form value value and boolean whether 
    // the field value is different from the source value
    // The function may return a promise containing new setting objects to be set as user selections
    onFieldChanged: PropTypes.func,

    // Optional callback that is called when the settings are received from the server
    // Receives the new source value object as parameter
    onSourceValueUpdated: PropTypes.func,

    // Source value to use for initial data
    // If no value is provided, the initial value is initialized
    // with the default one from definitions
    value: PropTypes.object,

    // Header for the form
    title: PropTypes.node,
  };*/

  state: State<ValueType> = {
    error: null,
    formValue: {},
  };

  sourceValue: Partial<ValueType>;
  form: any;

  setSourceValue = (value?: Partial<ValueType>) => {
    this.sourceValue = this.mergeFields(this.state.formValue, value);

    if (this.props.onSourceValueUpdated) {
      this.props.onSourceValueUpdated(this.sourceValue);
    }
  }

  componentDidMount() {
    this.setSourceValue(this.props.value);
  }

  componentDidUpdate(prevProps: FormProps<ValueType>) {
    if (prevProps.value !== this.props.value) {
      this.setSourceValue(this.props.value);
    }
  }

  // Merge new fields into current current form value
  mergeFields = (formValue: Partial<ValueType>, updatedFields?: Partial<ValueType>): Partial<ValueType> => {
    const mergedValue: ValueType = {
      ...formValue as any, 
      ...normalizeSettingValueMap(updatedFields, this.props.fieldDefinitions)
    };

    this.setState({ 
      formValue: mergedValue 
    });

    return mergedValue;
  }

  onFieldChanged = (value: Partial<ValueType>, valueKeyPath: string[], kind: string) => {
    const rootKey = valueKeyPath[0];
    const fieldKey = valueKeyPath[valueKeyPath.length - 1];
    if (kind) {
      // List action
      if (kind === 'add') {
        // Set default fields for the newly added value
        const fieldDef = this.props.fieldDefinitions.find(def => def.key === rootKey);
        if (!!fieldDef && !!fieldDef.definitions) {
          const list = value[rootKey];
          if (!!list) {
            const listItemPos = valueKeyPath[1];
            list[listItemPos] = normalizeSettingValueMap(list[listItemPos], fieldDef.definitions);
          }
        }
      }
    } else {
      // Make sure that we have the converted value for the custom 
      // change handler (in case there are transforms for this field) 
      const result = this.form.getComponent(valueKeyPath).validate();
      setFieldValueByPath(value, result.value, valueKeyPath);

      const equal = isEqual(
        findFieldValueByPath(this.sourceValue, valueKeyPath), 
        findFieldValueByPath(value, valueKeyPath)
      );

      if (this.props.onFieldChanged) {
        const promise = this.props.onFieldChanged(fieldKey, value, !equal);

        if (!!promise) {
          promise
            .then(
              updatedFields => this.mergeFields(value, updatedFields), 
              error => NotificationActions.apiError('Failed to update values', error)
            );
        }
      }
    }

    this.setState({ 
      formValue: value 
    });
  }

  // Handle an API error
  onSaveFailed = (error: ErrorResponse) => {
    if (error.code === 422) {
      this.setState({ 
        error: error.json,
      });
    } else {
      NotificationActions.apiError('Failed to save the form', error);
    }

    throw error;
  }


  // Calls props.onSave with changed form values
  save = () => {
    const validatedFormValue: Partial<ValueType> = this.form.getValue();
    if (validatedFormValue) {
      // Get the changed fields
      const settingKeys = Object.keys(validatedFormValue);
      const changedFields = settingKeys.reduce(
        reduceChangedFieldValues.bind(this, this.sourceValue, validatedFormValue), 
        {}
      );

      return this.props.onSave(changedFields, validatedFormValue)
        .catch(this.onSaveFailed);
    }

    return Promise.reject(new Error('Validation failed'));
  }

  render() {
    return (
      <Translation>
        { t => {
          //const { location } = useRouter(); // TODO
          const { title, fieldDefinitions, className, onFieldSetting, location } = this.props;
          const { formValue, error } = this.state;

          const type = parseDefinitions(fieldDefinitions);
          const options = getFieldOptions(fieldDefinitions, onFieldSetting, t, formValue, error);

          const context: FormContext = {
            location,
            t
          };

          return (
            <div className={ classNames('form', className) }>
              { !!title && (
                <div className="ui form header">
                  { title } 
                </div>
              ) }
              <TcombForm
                ref={ (c: any) => this.form = c }
                type={ type }
                options={ options }
                value={ formValue }
                onChange={ this.onFieldChanged }
                context={ context }
              />
            </div>
          );
        } }
      </Translation>
    );
  }
}

export default Form;

/*const FormWrapper = React.forwardRef(<ValueT extends Partial<UI.FormValueMap> = UI.FormValueMap>
  (props: FormProps<ValueT>, ref: any) => {
    const { t } = useTranslation();
    const { location } = useRouter();
    return (
      <Form<ValueT>
        ref={ ref }
        t={ t }
        location={ location }
        { ...props }
      />
    );
  }
);

export default FormWrapper;*/

/*const FormWrapper = <ValueT extends Partial<UI.FormValueMap> = UI.FormValueMap>(props: FormProps<ValueT>) => {
  const { t } = useTranslation();
  const { location } = useRouter();
  return (
    <Form<ValueT>
      t={ t }
      location={ location }
      { ...props }
    />
  );
};

export default FormWrapper;*/
