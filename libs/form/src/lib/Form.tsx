import React, { useCallback, useState } from 'react';

export type FormInputDataType = string | number | boolean | File | FormInputDataType[];
export type FormData<K extends string> = Record<K, FormInputDataType>;


export interface FormProps<F extends FormData<string>> extends Omit<HTMLFormElement, 'onSubmit' | 'onChange'> {
  onSubmit?: (data: F) => void;
}

export const Form = <F extends FormData<string>>(props: FormProps<F>) => {
  const { children, onSubmit, ...formProps } = props;
  const [formData, setFormData] = useState({  } as F);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLFormElement>) => {
    const inputTarge = e.target;
    if (inputTarge && inputTarge?.name && inputTarge?.value) {
      setFormData(currentFormData => ({...currentFormData, [inputTarge.name] : inputTarge.value }));
    }
  }, [setFormData]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  }, [onSubmit, formData]);

  return (
    <form onSubmit={handleSubmit} onChange={handleChange} {...formProps}>
      {children}
    </form>
  );
};

export default Form;
