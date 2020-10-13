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

/**
 * Options
 */
export type UseFormOptions<F extends FormDataRecord<string>> = undefined | {
  /**
   * ## 🧐 Watch Mode for form values
   * There are two types of watch modes available for configuration
   * 
   * ### **`'change'`** (recommended) (default)
   * This watch mode updates and validates (if defined) `formValues` on change of field value and moving to the next form field just like `onBlur` event on input.
   *
   *  *Note: Not using any watch mode will only update and validate (if defined) `formValues` on Form submit.*
   * 
   * ### **`'input'`** 
   * This watch mode updates and validates (if defined) `formValues` when a value in a field is changed, just like `onChange` event on input,
   * 
   * *Note: This will re-render component on each keystroke depending on using or not using `formValues`.*
   * 
   * ```js
   * const { formValues, formRef } = useForm({
   *   watchValuesOn: 'change',
   *   onSubmit: console.log
   * })
   * ```
   */
  watchValuesOn?: 'input' | 'change';
  /**
   * ## **✌ Multi-Select input values handling**
   * To capture an array of multiple values of the input component, `useForm` can be configured.
   * 
   * # Example
   * ```jsx
   * const MyForm = () => {
   *   const { formRef } = useForm({ 
   *     onSubmit: console.log,
   *     multipleValueInputs: ['favorite_pet']
   *   });
   *   return (
   *     <form ref={formRef}>
   *       <fieldset>
   *         <legend>Favorite Pets</legend>
   *         <input type="checkbox" name="favorite_pet" value="dogs" id="dogs" /> <label htmlFor="dogs">Dogs</label>
   *         <input type="checkbox" name="favorite_pet" value="cats" id="cats" /> <label htmlFor="cats">Cats</label>
   *         <input type="checkbox" name="favorite_pet" value="birds" id="birds" /> <label htmlFor="birds">Birds</label>
   *       </fieldset>
   *       <button type="submit" aria-label="submit">submit</button>
   *     </form>
   *   );
   * };
   * ```
   * # Return
   * ```js
   * {
   *   favorite_pet: ["dogs", "cats"];
   * }
   * ```
   */
  multipleValueInputs?: (keyof F)[];
  /**
   * ## **✅ Form Validation**
   * 
   * To enable form validation with `useForm` it requires `Yup` validation library to be installed.
   * [Yup get started here](https://github.com/jquense/yup#install)
   * 
   * # Example 
   * Here is a basic example of a validation integrated form.
   * ```jsx
   * const MyForm = () => {
   *   const { formRef, errors } = useForm({ 
   *     onSubmit: console.log,
   *     validation: object(({
   *       aInput: string()
   *         .required("Text requires").
   *         min(10, "Text must be at least 10 characters long")
   *     }))
   *   });
   * 
   *   return (
   *     <form ref={formRef} >
   *       <input name="a-input" type="text" aria-label="aInput" />
   *       <span>Error: {errors.aInput}</span>
   *       <button type="submit" aria-label="submit">submit</button>
   *     </form>
   *   );
   * };
   * ```
   */
  validation?: ObjectSchema<F>;
  /**
   * `onSubmit` use to capture form values.
   * ```js
   * const MyForm = () => {
   *   const { formRef } = useForm({
   *     onSubmit: (data) => console.log(data),
   *   });
   * 
   *   return (
   *     <form ref={formRef}>
   *       <input type="text" name="aInput" />
   *       <button type="submit">submit</button>
   *     </form>
   *   );
   * };
   * ```
   * Console log output
   * ```js
   * {
   *   aInput: "value"
   * }
   * ```
   */
  onSubmit?: FormSubmitHandler<F>;
  /**
   * This option can use to enable default form behavior
   */
  useDefaultSubmit?: boolean;
};