import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ElementEvent, FormDataRecord, UseFormOptions, ValuesAndErrors } from '../types';
import { getFormValues } from '../utils/getFormValues';
import { checkValidation } from '../utils/checkValidation';
import { useValidation } from './useValidation';


const getInputEventValue = (e: ElementEvent<HTMLInputElement>) => e.target.value;
const defaultOptions = {
  multipleValueInputs: [],
}

/**
 * ### Dead simple and excellent react hook for your React forms.
 * 
 * ## **➕ Integration**
 * Below example shows basic use of `useForm`.
 * ```
 * const MyForm = () => {
 *   const { formRef } = useForm({
 *      onSubmit: (data) => console.log(data),
 *    });
 * 
 *    return (
 *      <form ref={formRef}>
 *        <input type="text" name="aInput" />
 *        <button type="submit">submit</button>
 *      </form>
 *    );
 * };
 * ```
 */
export const useForm = <F extends FormDataRecord<string>>(options?: UseFormOptions<F>) => {
  const { onSubmit, validation, watchValuesOn, useDefaultSubmit, multipleValueInputs } = useMemo(() => ({ ...defaultOptions, ...options, multipleValueInputs: (options?.multipleValueInputs || defaultOptions.multipleValueInputs).join('') }), [options, options?.multipleValueInputs]);
  const currentValidation = useValidation<F>(validation);
  const [eventAssigned, setEventAssigned] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement | undefined>();
  const [customFieldValues, setCustomFieldValues] = useState<Partial<F>>();

  const getValuesAndErrors = useCallback((): ValuesAndErrors<F> => {
    const values = customFieldValues || formRef.current ? { ...(formRef.current && getFormValues<F>(formRef.current, multipleValueInputs) as F), ...customFieldValues } : undefined;
    const formData: ValuesAndErrors<F> = {
      values,
      errors: currentValidation && checkValidation(values, currentValidation)
    }
    return formData;
  }, [multipleValueInputs, currentValidation, customFieldValues]);

  const [{ values: formValues, errors }, setFormData] = useState<ValuesAndErrors<F>>(getValuesAndErrors());

  const updateValuesAndErrors = useCallback(() => {
    const formData = getValuesAndErrors();
    setFormData(formData);
    return formData;
  }, [getValuesAndErrors]);

  const updateFieldValue = useCallback(() => { setTimeout(() => formRef.current && formRef.current.dispatchEvent(new Event(watchValuesOn)), 1) }, [watchValuesOn, formRef]);

  const submitHandler = useCallback((e: Event) => {
    const { values, errors } = updateValuesAndErrors();
    if (errors === undefined) {
      if (onSubmit) {
        onSubmit(values);
      }
      if (!useDefaultSubmit) {
        e.preventDefault();
      }
    } else {
      e.preventDefault();
    }
  }, [updateValuesAndErrors, onSubmit, useDefaultSubmit]);

  // Default Values and Errors state update only on watch mode
  useEffect(() => {
    if (formRef.current && !formValues && watchValuesOn) {
      updateValuesAndErrors();
    }
  }, [formValues, updateValuesAndErrors, watchValuesOn]);

  // Assign Event to form to watch value changes if configed
  useEffect(() => {
    if (formRef.current && !eventAssigned && watchValuesOn) {
      setEventAssigned(true);
      formRef.current.addEventListener(watchValuesOn, updateValuesAndErrors);
    }
  }, [watchValuesOn, eventAssigned, updateValuesAndErrors]);

  // Submit handler event
  useEffect(() => {
    if (formRef.current && onSubmit) {
      formRef.current.onsubmit = submitHandler
    }
  }, [onSubmit, submitHandler]);

  // custom field handler
  const customFieldHandler = useCallback(<K extends keyof F, E, EF extends (e: E) => F[K] | undefined>(inputKey: K, eventValueCook?: EF) => (event: EF extends undefined ? ElementEvent<HTMLInputElement> : E) => {
    const customFieldValue = { [inputKey]: eventValueCook ? eventValueCook(event) : getInputEventValue(event as ElementEvent<HTMLInputElement>) }
    setCustomFieldValues((currentCustomFieldValues) => ({ ...currentCustomFieldValues, ...customFieldValue }));
    setFormData(formData => ({
      values: { ...formData.values, ...customFieldValue },
      errors: currentValidation && checkValidation({ ...formData.values, ...customFieldValue }, currentValidation)
    }));
  }, [setCustomFieldValues, currentValidation]);

  return {
    /**
     * ## **🕹 Custom form field handler**
     * 
     * Some react input components do not compile into valid native html input elements. 
     * For those kinds of components, `useForm` hook gives `customFieldHandler` to listen to the value changes.
     * 
     * # Example
     * ```jsx
     * const MyForm = () => {
     *   const { formRef, customFieldHandler, formValues } = useForm({
     *     onSubmit: (data) => console.log(data),
     *   });
     * 
     *   return (
     *     <form ref={formRef}>
     *       <DatePicker
     *         selected={formValues.aDate}
     *         onChange={customFieldHandler('aDate', date => date.toString())}
     *       />
     *       <button type="submit">submit</button>
     *     </form>
     *   );
     * };
     * ```
     */
    customFieldHandler,
    /**
     * This is a collection of form's inputs value.
     * ```js
     * {
     *    aInputName: "aInputValue"
     * }
     * ```
     */
    formValues,
    /**
     * This `formRef needs to be hooked on the form tag.
     * ```jsx
     * <form ref={formRef}>
     *   <input type="text" name="aInput" />
     *   <button type="submit">submit</button>
     * </form>
     * ```
     */
    formRef,
    /**
     * ## Update a Field Value
     * In order to work form values watching, change of any field in form should emit an event on form tag.
     * Most of all Input components do that but some custom input components that compiles to native input element but don't emit input changes event, where `updateFieldValue` can be use to watch the latest `formValues`.
     * 
     * ### Note : 
     * Custom input component that has `customFieldHandler` hooked, doesn't need to implement anything to update `formValues`. It would be updated always regardless of any watch mode.
     * 
     * # Example
     * ```jsx
      const options = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]

      const MyForm = () => {
        const { formRef, updateFieldValue, formValues } = useForm({
          watchValuesOn: 'change',
          onSubmit: console.log,
        });

        return (
          <form ref={formRef}>
            <Select
              options={options}
              name="gender"
              onChange={updateFieldValue}
            />
            <button type="submit">submit</button>
          </form>
        );
      };
      ```
     */
    updateFieldValue,
    /**
     * This is a collection of form's inputs validation error.
     * ```js
     * {
     *    aInputName: "a Input name filed is required"
     * }
     * ```
     */
    errors,
    /**
     * This is a function to get collection of value and error of inputs in the form. This can be useful to get latest values and error while under certain watch modes.
     * ```js
     * getValuesAndErrors();
     * ```
     * returns
     * ```js
     * {
     *   values: {
     *     aInputName: 'aInputValue'
     *   },
     *   errors: {
     *     aInputName: 'Invalid value'
     *   }
     * }
     * ```
     */
    getValuesAndErrors: updateValuesAndErrors
  }
}