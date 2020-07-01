import { ObjectSchema } from 'yup';

export type InputValueType = FormDataEntryValue | FormDataEntryValue[];
export type FormDataRecord<K extends string | number | symbol> = Record<K, InputValueType>;
export type ElementEvent<E extends HTMLElement> = React.ChangeEvent<E> | React.FocusEvent<E>
export type EventTarget = { target: HTMLInputElement | HTMLFormElement };
export type Errors<K extends string | number | symbol> = Partial<Record<K, string>> | undefined;

export type FormSubmitHandler<F extends FormDataRecord<string>> = (formData: F) => void | Promise<FormSubmitHandler<F>>

export interface ValuesAndErrors<F extends FormDataRecord<string>> {
  values: F,
  errors: Errors<keyof F>
}

export type UseFormOptions<F extends FormDataRecord<string>> = undefined | {
  watchValuesOn?: 'input' | 'change';
  multipleValueInputs?: (keyof F)[];
  validation?: ObjectSchema<F>;
  onSubmit?: FormSubmitHandler<F>;
  useDefaultSubmit?: boolean;
};