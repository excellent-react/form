import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ObjectSchema, ValidationError } from 'yup';
import isEqual from 'lodash.isequal';

export type InputValueType = FormDataEntryValue | FormDataEntryValue[];
export type FormDataRecord<K extends string | number | symbol> = Record<K, InputValueType>;
export type ElementEvent<E extends HTMLElement> = React.ChangeEvent<E> | React.FocusEvent<E>
export type EventTarget = { target: HTMLInputElement | HTMLFormElement };
export type Errors<K extends string | number | symbol> = Partial<Record<K, string>> | undefined;
export type ValueTransform<K extends string | number | symbol> = Partial<Record<K, 'number' | 'boolean' | 'date'>> | undefined;

export type FormSubmitHandler<F extends FormDataRecord<string>> = (formData: F) => void | Promise<FormSubmitHandler<F>>

const getInputEventValue = (e: ElementEvent<HTMLInputElement>) => e.target.value;

const formToFormDataRecord = <F extends FormDataRecord<string>>(formElement: HTMLFormElement, multipleValueInputs: string): F => {
  const formData = new FormData(formElement);
  let formDataRecord: F;
  formData.forEach((value, key: keyof F) => {
    const inputAsCheckbox = formElement.querySelectorAll(`input[name="${key}"]:checked`);
    if (inputAsCheckbox.length === 1 && inputAsCheckbox.item(0)) {
      formDataRecord = {
        ...formDataRecord,
        [key]: (inputAsCheckbox.item(0) as HTMLInputElement).checked
      };
    } else {
      formDataRecord = {
        ...formDataRecord,
        [key]:
          multipleValueInputs.includes(key as string) ?
            formData.getAll(key as string).filter(v => v) :
            value || undefined
      };
    }
  });
  return formDataRecord;
}

const checkValidation = <F extends FormDataRecord<string>>(formData: F, validation: ObjectSchema<F>) => {
  let errors: Errors<keyof F> = undefined;
  try {
    if (validation) {
      validation.validateSync(formData, { abortEarly: false });
    }
  } catch (error) {
    (error as ValidationError).inner.forEach(e => {
      errors = { ...errors, [e.path]: e.message }
    })
  }
  return errors;
};

interface ValuesAndErrors<F extends FormDataRecord<string>> {
  values: F,
  errors: Errors<keyof F>
}

export type UseFormOptions<F extends FormDataRecord<string>> = undefined | {
  watchValuesOn?: 'input' | 'change';
  multipleValueInputs?: (keyof F)[];
  validation?: ObjectSchema<F>;
  onSubmit?: FormSubmitHandler<F>;
  valuesTransform?: ValueTransform<keyof F>
  useDefaultSubmit?: boolean;
};

const userDefaultConfig = {
  multipleValueInputs: [],
}

export const useValidation = <F extends FormDataRecord<string>>(validation?: ObjectSchema<F>): ObjectSchema<F> => {
  const validationRef = useRef<ObjectSchema<F>>(validation);
  useEffect(() => {
    if (isEqual(validation, validationRef)) {
      validationRef.current = validation;
    }
  }, [validation]);
  return validationRef.current;
}

export const useForm = <F extends FormDataRecord<string>>(userConfig?: UseFormOptions<F>) => {
  const { onSubmit, validation, watchValuesOn, useDefaultSubmit, multipleValueInputs } = useMemo(() => ({ ...userDefaultConfig, ...userConfig, multipleValueInputs: (userConfig.multipleValueInputs || userDefaultConfig.multipleValueInputs).join('') }), [userConfig]);
  const currentValidation = useValidation<F>(validation);
  const [eventAssigned, setEventAssigned] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement | undefined>();
  const [customFieldValues, setCustomFieldValues] = useState<Partial<F>>();

  const getValuesAndErrors = useCallback((): ValuesAndErrors<F> => {
    const values = customFieldValues || formRef.current ? { ...(formRef.current && formToFormDataRecord<F>(formRef.current, multipleValueInputs) as F), ...customFieldValues } : undefined;
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

  useEffect(() => {
    if (formRef.current && !formValues) {
      updateValuesAndErrors();
    }
  }, [formValues, updateValuesAndErrors]);

  useEffect(() => {
    if (formRef.current && !eventAssigned && watchValuesOn) {
      setEventAssigned(true);
      formRef.current.addEventListener(watchValuesOn, updateValuesAndErrors);
    }
  }, [watchValuesOn, eventAssigned, updateValuesAndErrors]);

  useEffect(() => {
    if (formRef.current && onSubmit) {
      formRef.current.onsubmit = submitHandler
    }
  }, [onSubmit, submitHandler]);

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