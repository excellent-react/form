import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ObjectSchema, ValidationError } from 'yup';

export type InputValueType = FormDataEntryValue | FormDataEntryValue[];
export type FormDataRecord<K extends string | number | symbol> = Record<K, InputValueType>;
export type ElementEvent<E extends HTMLElement> = React.ChangeEvent<E> | React.FocusEvent<E>
export type EventTarget = { target: HTMLInputElement | HTMLFormElement };
export type Errors<K extends string | number | symbol> = Partial<Record<K, string>> | undefined;
export type ValueTransform<K extends string | number | symbol> = Partial<Record<K, 'number' | 'boolean' | 'date'>> | undefined;

export type FormSubmitHandler<F extends FormDataRecord<string>> = (formData: F) => void | Promise<FormSubmitHandler<F>>

const getInputEventValue = (e: ElementEvent<HTMLInputElement>) => e.target.value;

const formToFormDataRecord = <F extends FormDataRecord<string>>(formElement: HTMLFormElement, multipleValueInputs: (keyof F)[]): F => {
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
          multipleValueInputs.includes(key) ? 
            formData.getAll(key as string).filter(v => v) : 
            value || undefined
        };
    }
  });
  return formDataRecord;
}

export type UseFormOptions<F extends FormDataRecord<string>> = undefined | {
  mode?: 'input' | 'change';
  multipleValueInputs?: (keyof F)[];
  validation?: ObjectSchema<F>;
  onSubmit?: FormSubmitHandler<F>;
  valuesTransform?: ValueTransform<keyof F>
  useDefaultSubmit?: boolean;
};

export const useForm = <F extends FormDataRecord<string>>(userOption?: UseFormOptions<F>) => {
  const eventType = userOption?.mode || 'change';
  const onSubmit = userOption?.onSubmit;
  const useDefaultSubmit = userOption?.useDefaultSubmit;
  const multipleValueInputs = userOption?.multipleValueInputs || [];

  const [formData, setFormData] = useState<F>();
  const [eventAssigned, setEventAssigned] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement | undefined>();

  const errors: Errors<keyof F> = useMemo(() => {
    let errors: Errors<keyof F> = undefined;
    if (userOption && userOption.validation) {
      try {
        userOption.validation.validateSync(formData, { abortEarly: false });
      } catch (error) {
        (error as ValidationError).inner.forEach(e => {
          errors = { ...errors, [e.path]: e.message }
        })
      }
    }
    return errors;
  }, [formData, userOption]);

  const updateInput = useCallback(() => { setTimeout(() => formRef.current && formRef.current.dispatchEvent(new Event(eventType)), 1) }, [eventType, formRef]);
  const submitHandler = useCallback((e: Event) => {
    if (errors === undefined) {
      if (onSubmit) {
        onSubmit(formData);
      }
      if (!useDefaultSubmit) {
        e.preventDefault();
      }
    } else {
      e.preventDefault();
    }
  }, [formData, onSubmit, errors, useDefaultSubmit]);

  useEffect(() => {
    if (formRef.current && !eventAssigned) {
      setEventAssigned(true);
      setFormData(formToFormDataRecord(formRef.current as HTMLFormElement, multipleValueInputs));
      formRef.current.addEventListener(eventType, (e) => {
        setFormData(formToFormDataRecord(e.currentTarget as HTMLFormElement, multipleValueInputs));
      });
    }
  }, [eventType, multipleValueInputs, eventAssigned]);

  useEffect(() => {
    if (formRef.current && onSubmit) {
      formRef.current.onsubmit = submitHandler
    }
  }, [formData, onSubmit, submitHandler]);

  const fieldHandler = useCallback(<K extends keyof F, E, EF extends (e: E) => F[K] | undefined>(inputKey: K, eventValueCook?: EF) => (event: EF extends undefined ? ElementEvent<HTMLInputElement> : E) => {
    const inputValue = eventValueCook ? eventValueCook(event) : getInputEventValue(event as ElementEvent<HTMLInputElement>)
    setFormData(currentFormData => ({ ...currentFormData, [inputKey]: inputValue }));
  }, [setFormData]);

  return {
    fieldHandler,
    formData,
    formRef,
    updateInput,
    errors
  }
}