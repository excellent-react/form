import { FormDataRecord, Errors } from '../types';
import { ObjectSchema, ValidationError } from 'yup';

export const checkValidation = <F extends FormDataRecord<string>>(formData: F, validation: ObjectSchema<F>) => {
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