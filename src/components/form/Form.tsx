import { Component } from 'react';
import classNames from 'classnames';

import NotificationActions from 'actions/NotificationActions';

import {
  normalizeSettingValueMap,
  parseDefinitions,
  parseFieldOptions,
  setFieldValueByPath,
  findFieldValueByPath,
  reduceChangedFieldValues,
  findFieldByKey,
  formValuesEqual,
  trimValue,
} from 'utils/FormUtils';
import tcomb from 'utils/tcomb-form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import './style.css';

import { ErrorResponse, FieldError } from 'airdcpp-apisocket';
import { Translation } from 'react-i18next';
import { FormContext } from 'types/ui';
import { getModuleT } from 'utils/TranslationUtils';

import { TextDecorator } from 'components/text';

const TcombForm = tcomb.form.Form;

const optionHelpFormatter = (text: string) => (
  <TextDecorator text={text} emojify={false} />
);

// Reduces an array of field setting objects by calling props.onFieldSetting
const fieldOptionReducer = (
  reducedOptions: Record<string, tcomb.form.TcombOptions>,
  fieldDefinitions: UI.FormFieldDefinition,
  onFieldSetting: FormFieldSettingHandler<UI.FormValueMap> | undefined,
  formT: UI.ModuleTranslator,
  formValue: Partial<UI.FormValueMap>,
  optionTitleFormatter: UI.OptionTitleParser | undefined,
): tcomb.form.TcombOptions => {
  reducedOptions[fieldDefinitions.key] = parseFieldOptions(
    fieldDefinitions,
    formT,
    optionTitleFormatter,
    optionHelpFormatter,
  );

  if (onFieldSetting) {
    onFieldSetting(fieldDefinitions.key, reducedOptions[fieldDefinitions.key], formValue);
  }

  if (fieldDefinitions.type === API.SettingTypeEnum.STRUCT) {
    // reducedOptions[fieldDefinitions.key].fields = {};
    reducedOptions[fieldDefinitions.key].fields = fieldDefinitions.definitions!.reduce(
      (reduced, cur) => {
        return fieldOptionReducer(
          reduced,
          cur,
          onFieldSetting,
          formT,
          formValue,
          optionTitleFormatter,
        );
      },
      {},
    );
  }

  return reducedOptions;
};

// Returns an options object for Tcomb form
const getFieldOptions = <ValueMapT extends UI.FormValueMap>(
  fieldDefinitions: UI.FormFieldDefinition[],
  onFieldSetting: FormFieldSettingHandler<ValueMapT> | undefined,
  formT: UI.ModuleTranslator,
  formValue: Partial<ValueMapT>,
  error: FieldError | null,
  optionTitleFormatter: UI.OptionTitleParser | undefined,
  moduleT: UI.ModuleTranslator,
): tcomb.form.TcombStructOptions => {
  const options: tcomb.form.TcombStructOptions = {
    // Parent handlers
    fields: fieldDefinitions.reduce(
      (reduced, cur) =>
        fieldOptionReducer(
          reduced,
          cur,
          onFieldSetting,
          formT,
          formValue,
          optionTitleFormatter,
        ),
      {},
    ),
    i18n: {
      add: moduleT.translate('Add'),
      down: moduleT.translate('Down'),
      optional: '', // Not being used
      required: '', // Not being used
      remove: moduleT.translate('Remove'),
      up: moduleT.translate('Up'),
    },
  };

  // Do we have an error object from the API?
  // Show the error message for the respective field
  if (!!error) {
    const field = findFieldByKey(options, error.field);
    console.assert(!!field, `Error field ${error.field} was not found`);
    if (!!field) {
      field.error = error.message;
      field.hasError = true;
    }
  }

  return options;
};

export type FormFieldSettingHandler<
  ValueType extends Partial<UI.FormValueMap> = UI.FormValueMap,
> = (
  key: string,
  definitions: tcomb.form.TcombOptions,
  formValue: Partial<ValueType>,
) => void;

export type FormSaveHandler<ValueType> = (
  changedFields: Partial<ValueType>,
  allFields: Partial<ValueType>,
) => Promise<void>;

export type FormFieldChangeHandler<ValueType = UI.FormValueMap> = (
  key: string,
  formValue: Partial<ValueType>,
  valueChanged: boolean,
) => null | void | Promise<Partial<ValueType>>;

export interface FormProps<ValueType extends Partial<UI.FormValueMap> = UI.FormValueMap>
  extends Pick<FormContext, 'location'> {
  // Form items to list
  fieldDefinitions: UI.FormFieldDefinition[];

  // Source value to use for initial data
  // If no value is provided, the initial value is initialized
  // with the default one from definitions
  sourceValue?: ValueType | null;

  // Called when the form is saved
  // Receives the changed fields as parameter
  // Must return promise
  onSave: FormSaveHandler<ValueType>;

  // Optional callback for appending field settings
  // Receives the field key, field definitions and the current form value as parameters
  onFieldSetting?: FormFieldSettingHandler<ValueType>;

  // Optional callback that is called when a field value was changed
  // Receives the field key, current form value value and boolean whether
  // the field value is different from the source value
  // The function may return a promise containing new setting objects to be set as user selections
  onFieldChanged?: FormFieldChangeHandler<ValueType>;

  // Header for the form
  title?: string;

  className?: string;
  optionTitleFormatter?: UI.OptionTitleParser;
  id?: string;
}

interface State<ValueType> {
  error: FieldError | null;
  formValue: Partial<ValueType>;
}

type Props<ValueType extends UI.FormValueMap> = FormProps<ValueType>;
class Form<ValueType extends UI.FormValueMap = UI.FormValueMap> extends Component<
  Props<ValueType>
> {
  state: State<ValueType>;

  sourceValue: Partial<ValueType>;
  form: tcomb.form.Form | null;

  constructor(props: Props<ValueType>) {
    super(props);

    this.sourceValue = normalizeSettingValueMap(
      props.sourceValue || undefined,
      this.props.fieldDefinitions,
    ) as Partial<ValueType>;

    this.state = {
      formValue: this.sourceValue,
      error: null,
    };
  }

  setSourceValue = (value?: Partial<ValueType> | null) => {
    this.sourceValue = this.mergeFields(this.state.formValue, value || undefined);
  };

  componentDidUpdate(prevProps: FormProps<ValueType>) {
    if (prevProps.sourceValue !== this.props.sourceValue) {
      this.setSourceValue(this.props.sourceValue);
    }
  }

  // Merge new fields into current current form value
  mergeFields = (
    formValue: Partial<ValueType>,
    updatedFields?: Partial<ValueType>,
  ): Partial<ValueType> => {
    const mergedValue: ValueType = {
      ...(formValue as any),
      ...normalizeSettingValueMap(updatedFields, this.props.fieldDefinitions),
    };

    this.setState({
      formValue: mergedValue,
    });

    return mergedValue;
  };

  onFieldValueChanged = (value: Partial<ValueType>, valueKeyPath: tcomb.form.Path) => {
    if (!this.props.onFieldChanged) {
      return;
    }

    const fieldKey = valueKeyPath[valueKeyPath.length - 1];

    // Check if the current value differs from the original one
    const equal = formValuesEqual(
      findFieldValueByPath(this.sourceValue, valueKeyPath),
      findFieldValueByPath(value, valueKeyPath),
    );

    const promise = this.props.onFieldChanged(fieldKey as string, value, !equal);
    if (!!promise) {
      promise.then(
        (updatedFields) => this.mergeFields(value, updatedFields),
        (error) => NotificationActions.apiError('Failed to update values', error),
      );
    }
  };

  onChange: tcomb.form.TCombFormProps['onChange'] = (
    value: Partial<ValueType>,
    valueKeyPath: tcomb.form.Path,
    kind,
  ) => {
    if (kind) {
      // List action
      if (kind === 'add') {
        const rootKey = valueKeyPath[0];

        // Set default fields for the newly added value
        const fieldDef = this.props.fieldDefinitions.find((def) => def.key === rootKey);
        if (!!fieldDef && !!fieldDef.definitions) {
          const list = value[rootKey]! as UI.FormValueMap[];
          if (!!list) {
            const listItemPos = valueKeyPath[1] as number;
            list[listItemPos] = normalizeSettingValueMap(
              list[listItemPos],
              fieldDef.definitions,
            );
          }
        }
      } else {
        // Remove/sort
        this.onFieldValueChanged(value, valueKeyPath);
      }
    } else if (this.form) {
      // Make sure that we have the converted value for the custom
      // change handler (in case there are transforms for this field)
      const result = this.form.getComponent(valueKeyPath).validate() as any;
      if (result.value !== findFieldValueByPath(this.state.formValue, valueKeyPath)) {
        setFieldValueByPath(value, result.value, valueKeyPath);
        this.onFieldValueChanged(value, valueKeyPath);
      }
    }

    this.setState({
      formValue: value,
    });
  };

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
  };

  // Calls props.onSave with changed form values
  save = () => {
    const rawValue: ValueType = this.form!.getValue();

    const validatedFormValue = trimValue(rawValue, this.props.fieldDefinitions);
    if (validatedFormValue) {
      // Get the changed fields
      const settingKeys = Object.keys(validatedFormValue);
      const changedFields = settingKeys.reduce(
        reduceChangedFieldValues.bind(this, {
          definitions: this.props.fieldDefinitions,
          sourceValue: this.sourceValue,
          currentFormValue: validatedFormValue,
        }),
        {},
      );

      return this.props
        .onSave(changedFields, validatedFormValue)
        .catch(this.onSaveFailed);
    }

    return Promise.reject(new Error('Validation failed'));
  };

  render() {
    return (
      <Translation>
        {(t) => {
          //const { location } = useRouter(); // TODO
          const {
            title,
            fieldDefinitions,
            className,
            onFieldSetting,
            location,
            optionTitleFormatter,
            id,
          } = this.props;
          const { formValue, error } = this.state;

          const formT = getModuleT(t, [UI.Modules.COMMON, UI.SubNamespaces.FORM]);
          const type = parseDefinitions(fieldDefinitions);
          const options = getFieldOptions(
            fieldDefinitions,
            onFieldSetting,
            formT,
            formValue,
            error,
            optionTitleFormatter,
            formT,
          );

          const context: FormContext = {
            location,
            formT,
          };

          return (
            <div className={classNames('form', className)}>
              {!!title && <div className="ui form header">{title}</div>}
              <TcombForm
                ref={(c) => {
                  this.form = c;
                }}
                id={id}
                type={type}
                options={options}
                value={formValue}
                onChange={this.onChange}
                context={context}
              />
            </div>
          );
        }}
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
