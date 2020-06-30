import { FormDataRecord } from '../types';
import { ObjectSchema } from 'yup';
import { useRef, useEffect } from 'react';
import { isEqual } from 'lodash';

export const useValidation = <F extends FormDataRecord<string>>(validation?: ObjectSchema<F>): ObjectSchema<F> => {
  const validationRef = useRef<ObjectSchema<F>>(validation);
  useEffect(() => {
    if (isEqual(validation, validationRef)) {
      validationRef.current = validation;
    }
  }, [validation]);
  return validationRef.current;
}