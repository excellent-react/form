import { groupBy, mapValues } from 'lodash';
import { FormDataRecord } from '../types';

// To get boolean values for checkboxes
const getCheckboxesBooleanValues = (formElement: HTMLFormElement) => {
  const inputCheckboxes: { name: string, checked: boolean }[]  = [];
  formElement.querySelectorAll(`input[type="checkbox"]`).forEach(({ name, checked }: HTMLInputElement) => {
    if (name) {
      inputCheckboxes.push({ name, checked });
    }
  });
  return mapValues(groupBy(inputCheckboxes, c => c.name), (inputs) => inputs.length === 1 ? inputs[0].checked : undefined);
}

export const getFormValues = <F extends FormDataRecord<string>>(formElement: HTMLFormElement, multipleValueInputs: string): F => {
  const formData = new FormData(formElement);
  let formDataRecord: F;
  const checkboxesValues = getCheckboxesBooleanValues(formElement);

  formData.forEach((value, key) => {
    if (checkboxesValues[key] !== undefined) {
      formDataRecord = {
        ...formDataRecord,
        [key]: checkboxesValues[key]
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