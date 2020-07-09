<img src="https://raw.githubusercontent.com/excellent-react/form/master/apps/form-documentation/src/assets/excellent-react.svg" alt="Excellent React" width="400"/>

**Excellent Tools for your Excellent React App development.** 
______

<img src="https://raw.githubusercontent.com/excellent-react/form/master/apps/form-documentation/src/assets/excellent-react-use-form.svg" max-width="600"/>

A Dead Simple and Excellent React hook for you React application forms needs.

## What makes this an Excellent react hook.
  * [Dead Simple Integration 😎 ](#-dead-simple-integration)
  * [Smaller foot-print 👣 ](#-smaller-footprint)
  * [Awesome Tools 🛠️ ](#smaller-footprint-)
     * [Custom Form Field support 🕹](#custom-form-field-support)
     * [Watch form values changes🧐](#-watch-form-values)
     * [Form Validations ✅ ](#-form-validation)
     * Multi-Select input values handling
  * Performance 🚀

# **😎 Dead Simple Integration**

## **⬇️ Installation**

Just one command

`npm install @excellent-react/form`

or

`yarn add @excellent-react/form`

## **➕ Integration**

Below example shows basic use of `useForm`.

```js
import React from 'react';
import { useForm } from '@excellent-react/form';

const MyForm = () => {
  const { formRef } = useForm({
    onSubmit: (data) => console.log(data),
  });

  return (
    <form ref={formRef}>
      <input type="text" name="aInput" />
      <button type="submit">submit</button>
    </form>
  );
};
```

**Log Output**
```js
{
  aInput: "value"
}
```

**`useForm`** hook returns `formRef` property, which needs to assign to the form component ref props, In order to identify and sync values thier all form fields buy the given **name**. 

To get fields value, **`useForm`** takes config where `onSubmit` takes callback function which have object of values and field name pair in.

# **👣 Smaller footprint**

Compare to other popular react form libraries it has Smaller footprint in terms of integration in your JSX code. Also it don't need extra implementation for custom react components that compiles to basic form element.

* **Formik**

```jsx
import React from 'react';
import { useFormik } from 'formik';
import Select from 'react-select'

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
]

const MyForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      gender: '',
      email: '',
    },
    onSubmit: values => console.log(values),
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.firstName}
      />
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <Select
        options={options}
        name="gender"
        value={options.find(option => option.value === formik.values.gender)}
        onChange={option => formik.setFieldValue("gender", (option && option.value) || '')}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

* **react-hook-form**

```js
import React from 'react';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select'

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
]

const MyForm = () => {
  const { handleSubmit, control, register } = useForm();
    const onSubmit = values => console.log(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        ref={register}
      />
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        ref={register}
      />
      <Controller
        name="gender"
        as={Select}
        options={options}
        control={control}
        rules={{ required: true }}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

* ⭐ **@excellent-rect/form**

```js
import React from 'react';
import { useForm } from "@excellent-rect/form";
import Select from 'react-select';

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
]

const MyForm = () => {
  const { formRef } = useForm({
    onSubmit: values => console.log(values);
  });

  return (
    <form ref={formRef}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
      />
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
      />
      <Select
        options={options}
        name="gender"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

# **Awesome Tools 🛠️**

## **🕹Custom Form Field support**

Some react input component dose not translate into valid native html input element, for those kind of components `useForm` hook gives `customFieldHandler` to listen value changes.

```jsx
import React from 'react';
import { useForm } from '@excellent-react/form';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyForm = () => {
  const { formRef, customFieldHandler, formValues } = useForm({
    onSubmit: (data) => console.log(data),
  });

  return (
    <form ref={formRef}>
      <DatePicker
        selected={formValues.aDate}
        onChange={customFieldHandler('aDate', date => date.toString())}
      />
      <button type="submit">submit</button>
    </form>
  );
};
```


## **🧐 Watch Form Values**

This configuration allows to watch fields value changes. This can configured by defining `watchValuesOn` option in config which returned `formValues` property from hook that can used to get current form values.
```js
const { formValues, formRef } = useForm({
  watchValuesOn: 'change',
  onSubmit: console.log
})
```
There are two type of watch mode config
### **`'input'`** 
This watch mode updates and validates (if defined) `formValues` on press of key stroke on field just like `onChange` event on input, 

*Note: This will re-render component on each key strokes depending on using and not-using `formValues`.*

### **`'change'`** (recommended)
This watch mode updates and validates (if defined) `formValues` on change of field value and moving to next form field just like `onBlur` event on input.

*Note: Not using any watch mode will only updates and validates (if defined) `formValues` on Form submit.*

### Custom Input component values watch

Some Custom Input React component that compiles to native input element don't emit input changes to form element, therefor `useForm` hook gives `updateFieldValue` that needs to assign the event listener prop of that custom input component in order to update latest `formValues`.

```jsx
import React from 'react';
import { useForm } from '@excellent-react/form';
import Select from 'react-select';

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
]

const MyForm = () => {
  const { formRef, updateFieldValue, formValues } = useForm({
    onSubmit: (data) => console.log(data),
  });

  return (
    <form ref={formRef}>
      <Select
        options={options}
        name="gender"
        onChange={updateFieldValue}
      />
      <button type="submit">submit</button>
    </form>
  );
};
```
### Note : 
Custom input Components that has `customFieldHandler` hooked, don't need to implement anything for update `formValues`, it would always regardless of watch mode.

## **✅ Form Validation**

To enable form validation with `useForm` it requires `Yup` validation library to be install.
[Yup get started here](https://github.com/jquense/yup#install)

Below shows basic example of validation integrated form.
```jsx
import React from 'react';
import { useForm } from '@excellent-react/form';

const MyForm = () => {
  const { formRef, errors } = useForm({ 
    onSubmit: console.log,
    validation: object(({
      aInput: string()
        .required("Text requires").
        min(10, "Text must be at least 10 characters long")
    }))
  });

  useEffect(() => {
    errorsCatch(errors);
  }, [errors])

  return (
    <form ref={formRef} >
      <input name="a-input" type="text" aria-label="aInput" />
      <span>{`Error: ${errors.aInput}}`</span>
      <button type="submit" aria-label="submit">submit</button>
    </form>
  );
};
```

Validation allows to not submit invalid input form, In `useForm` validation this every time fields value changes it will check for errors, that is `onSubmit` and on input/change field, if `watchValuesOn` defined. 
`useForm` gives `errors` object which is record of field name as key and value as error message, and it can be `undefined` if no errors found. 