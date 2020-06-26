import { useState, useCallback } from 'react';

export type FormInputDataType = string | number | boolean | null | undefined | Date | File | FormInputDataType[];
export type FormData<K extends string> = Record<K, FormInputDataType>;
export type Event<E extends HTMLElement> = React.ChangeEvent<E> | React.FocusEvent<E>

export type FormSubmitHandler<F extends FormData<string>> = (formData: F) => void | Promise<FormSubmitHandler<F>>
const inputEventValue = (e: Event<HTMLInputElement>) => e.target.value;
const getInputKeyValue = (input: HTMLFormElement | HTMLInputElement) => {
  const inputKey = input?.name || input?.id;
  if (inputKey) {
    let inputValue: FormInputDataType;
    if (input.tagName === 'SELECT' && input.multiple) {
      const options = [];
      input.querySelectorAll('option:checked').forEach((o: HTMLOptionElement) => {
        options.push(o.value);
      });
      inputValue = options;
    } else if (input.type === 'checkbox' && document.querySelectorAll(`[name="${input.name}"]`).length > 1) {
      const options = [];
      document.querySelectorAll(`[name="${input.name}"]:checked`).forEach((o: HTMLInputElement) => {
        options.push(o.value);
      });
      inputValue = options;
    } else {
      inputValue = {
        "file": input.files ? input.multiple ? input.files : input.files[0] : null,
        "checkbox": input?.checked,
        "date": input?.valueAsDate,
        "datetime-local": input?.valueAsDate,
        "number": input?.valueAsNumber,
        "range": input?.valueAsNumber,
      }[input.type] || input.value;
    }
    return { [inputKey]: inputValue };
  }
  return undefined;
}

export const useForm = <F extends FormData<string>>() => {
  const [formData, setFormData] = useState({} as F);

  const formEventHandler = useCallback((e: Event<HTMLFormElement>) => {
    const inputTarget = e.target as HTMLFormElement | HTMLInputElement;
    const inputKeyValue = getInputKeyValue(inputTarget);
    if (inputKeyValue) {
      setFormData(currentFormData => ({ ...currentFormData, ...inputKeyValue }));
    }
  }, [setFormData]);

  const submitHandler = useCallback((onSubmit: FormSubmitHandler<F>) => (e: Event<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  }, [formData]);

  const fieldHandler = useCallback(<K extends keyof F, E, EF extends (e: E) => F[K] | undefined>(inputKey: K, eventValueCook?: EF) => (event: EF extends undefined ? Event<HTMLInputElement> : E) => {
    const inputValue = eventValueCook ? eventValueCook(event) : inputEventValue(event as Event<HTMLInputElement>)
    setFormData(currentFormData => ({ ...currentFormData, [inputKey]: inputValue }));
  }, [setFormData])

  return {
    fieldHandler,
    formData,
    formEventHandler,
    submitHandler
  }
}