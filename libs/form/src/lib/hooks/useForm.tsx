import { useState, useCallback } from 'react';

export type FormInputDataType = string | number | boolean | File | FormInputDataType[];
export type FormData<K extends string> = Record<K, FormInputDataType>;

export type FormSubmitHandler<F extends FormData<string>> = (formData: F) => void | Promise<FormSubmitHandler<F>>

export const useForm = <F extends FormData<string>>() => {
  const [formData, setFormData] = useState({  } as F);

  const formEventHandler = useCallback((e: React.ChangeEvent<HTMLFormElement> | React.FocusEvent<HTMLFormElement>) => {
    const inputTarge = e.target as HTMLFormElement | HTMLInputElement;
    if (inputTarge && inputTarge?.name && inputTarge?.value) {
      setFormData(currentFormData => ({...currentFormData, [inputTarge.name] : inputTarge.value }));
    }
  }, [setFormData]);

  const submitHandler = useCallback((onSubmit: FormSubmitHandler<F>) => (e: React.ChangeEvent<HTMLFormElement> | React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  }, [formData]);

  return {
    formEventHandler,
    submitHandler
  }
}