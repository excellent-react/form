import { useState, useCallback } from 'react';

export type InputValueType = string | number | boolean | null | undefined | Date | File | InputValueType[];
export type FormData<K extends string> = Record<K, InputValueType>;
export type ElementEvent<E extends HTMLElement> = React.ChangeEvent<E> | React.FocusEvent<E>
export type EventTarget = { target: HTMLInputElement | HTMLFormElement };

export type FormSubmitHandler<F extends FormData<string>> = (formData: F) => void | Promise<FormSubmitHandler<F>>

const getInputEventValue = (e: ElementEvent<HTMLInputElement>) => e.target.value;
const getInputValue = (input: HTMLFormElement | HTMLInputElement) => {
  const inputKey = input?.name || input?.id;
  if (inputKey) {
    let inputValue: InputValueType;

    // Native Multi-Select
    if (input.tagName === 'SELECT' && input.multiple) {
      const options = [];
      input.querySelectorAll('option:checked').forEach((o: HTMLOptionElement) => {
        options.push(o.value);
      });
      inputValue = options;

    // Native Multi-Check
    } else if (input.type === 'checkbox' && document.querySelectorAll(`[name="${input.name}"]`).length > 1) {
      const options = [];
      document.querySelectorAll(`[name="${input.name}"]:checked`).forEach((o: HTMLInputElement) => {
        options.push(o.value);
      });
      inputValue = options;

    } else {

      // Value Transformer
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

  const formEventHandler = useCallback((e: ElementEvent<HTMLFormElement>) => {
    const inputElement = e.target as HTMLFormElement | HTMLInputElement;
    const inputValue = getInputValue(inputElement);
    if (inputValue) {
      setFormData(currentFormData => ({ ...currentFormData, ...inputValue }));
    }
  }, [setFormData]);

  const submitHandler = useCallback((onSubmit: FormSubmitHandler<F>) => (e: ElementEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  }, [formData]);

  const fieldHandler = useCallback(<K extends keyof F, E, EF extends (e: E) => F[K] | undefined>(inputKey: K, eventValueCook?: EF) => (event: EF extends undefined ? ElementEvent<HTMLInputElement> : E) => {
    const inputValue = eventValueCook ? eventValueCook(event) : getInputEventValue(event as ElementEvent<HTMLInputElement>)
    setFormData(currentFormData => ({ ...currentFormData, [inputKey]: inputValue }));
  }, [setFormData]);

  return {
    fieldHandler,
    formData,
    formEventHandler,
    submitHandler
  }
}