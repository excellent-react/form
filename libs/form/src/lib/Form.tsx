import React from 'react';
import { useForm, FormData } from './hooks/useForm';

export interface FormProps<F extends FormData<string>> extends Omit<HTMLFormElement, 'onSubmit' | 'onChange'> {
  onSubmit?: (data: F) => void;
  formMode?: "change" | "blur"
}

export const Form = <F extends FormData<string>>(props: FormProps<F>) => {
  const { children, onSubmit, formMode, ...formProps } = props;
  const { formEventHandler, submitHandler } = useForm<F>();

  return (
    <form onSubmit={submitHandler(onSubmit)} {...{ [formMode === 'blur' ? "onBlur" : "onChange"]: formEventHandler }} {...formProps}>
      {children}
    </form>
  );
};

export default Form;
