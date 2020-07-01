import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ElementEvent, FormDataRecord, UseFormOptions, ValuesAndErrors } from '../types';
import { getFormValues } from '../utils/getFormValues';
import { checkValidation } from '../utils/checkValidation';
import { useValidation } from './useValidation';


const getInputEventValue = (e: ElementEvent<HTMLInputElement>) => e.target.value;
const userDefaultConfig = {
  multipleValueInputs: [],
}

export const useForm = <F extends FormDataRecord<string>>(userConfig?: UseFormOptions<F>) => {
  const { onSubmit, validation, watchValuesOn, useDefaultSubmit, multipleValueInputs } = useMemo(() => ({ ...userDefaultConfig, ...userConfig, multipleValueInputs: (userConfig?.multipleValueInputs || userDefaultConfig.multipleValueInputs).join('') }), [userConfig, userConfig?.multipleValueInputs]);
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
    customFieldHandler,
    formValues,
    formRef,
    updateFieldValue,
    errors,
    getValuesAndErrors: updateValuesAndErrors
  }
}