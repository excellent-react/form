![Excellent React](https://raw.githubusercontent.com/excellent-react/form/master/apps/form-documentation/src/assets/excellent-react.svg)

**Excellent tool for your React app development.**

---

![Excellent React useForm](https://raw.githubusercontent.com/excellent-react/form/master/apps/form-documentation/src/assets/excellent-react-use-form.svg)

Dead simple and excellent react hook for your React forms.

[http://form.excellent-react.com](http://form.excellent-react.com)

[![Netlify Status](https://api.netlify.com/api/v1/badges/98b875b6-6bff-4d81-a9b7-5923a8025adc/deploy-status)](https://app.netlify.com/sites/form-excellent-react/deploys)

# ⚠️ Web application use only

## What makes it an excellent react hook?

- [Dead simple integration 😎 ](#-dead-simple-integration)
- [Smaller foot-print 👣 ](#-smaller-footprint)
- [Awesome tooling 🛠️ ](#-awesome-tooling)
  - [Custom form field support 🕹](#-custom-form-field-support)
  - [Watch form value changes🧐](#-watch-form-values)
  - [Form validation ✅ ](#-form-validation)
  - [Multi-Select input value handling ✌️](#-multi-select-input-values-handling)
- [Performance 🚀](#-performance)

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
  aInput: 'value';
}
```

Create `ref` on `<form>`. The value returned from the **`useForm`** hook is passed to the form `ref`.
This hook provides all the values of form fields with their names to the form. These values can be captured by a callback function on `onSubmit`.

# **👣 Smaller footprint**

Compared to other popular react form libraries it has a smaller footprint in terms of integration in JSX code. Besides, it doesn't require extra implementation for custom react components that compile to a basic form element.

- **Formik**

```jsx
import React from 'react';
import { useFormik } from 'formik';
import Select from 'react-select';

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const MyForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      gender: '',
      email: '',
    },
    onSubmit: (values) => console.log(values),
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
        value={options.find((option) => option.value === formik.values.gender)}
        onChange={(option) =>
          formik.setFieldValue('gender', (option && option.value) || '')
        }
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

- **react-hook-form**

```js
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const MyForm = () => {
  const { handleSubmit, control, register } = useForm();
  const onSubmit = (values) => console.log(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="firstName">First Name</label>
      <input id="firstName" name="firstName" type="text" ref={register} />
      <label htmlFor="email">Email Address</label>
      <input id="email" name="email" type="email" ref={register} />
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

- ⭐ **@excellent-rect/form**

_No hooking needed on each form fields._

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

# **🛠️ Awesome tooling**

## **🕹Custom form field support**

Some react input components do not compile into valid native html input elements.
For those kinds of components, `useForm` hook gives `customFieldHandler` to listen to the value changes.

```jsx
import React from 'react';
import { useForm } from '@excellent-react/form';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MyForm = () => {
  const { formRef, customFieldHandler, formValues } = useForm({
    onSubmit: (data) => console.log(data),
  });

  return (
    <form ref={formRef}>
      <DatePicker
        selected={formValues.aDate}
        onChange={customFieldHandler('aDate', (date) => date.toString())}
      />
      <button type="submit">submit</button>
    </form>
  );
};
```

## **🧐 Watch form values**

`useForm` hook allows watching all fields value changes, by defining the `watchValuesOn` option in config. It returns the `formValues` property from the hook which can be used to get current form values.

```js
const { formValues, formRef } = useForm({
  watchValuesOn: 'change',
  onSubmit: console.log,
});
```

There are two types of watch modes available for configuration

### **`'input'`**

This watch mode updates and validates (if defined) `formValues` when a value in a field is changed, just like `onChange` event on input,

_Note: This will re-render component on each keystroke depending on using or not using `formValues`._

### **`'change'`** (recommended)

This watch mode updates and validates (if defined) `formValues` on change of field value and moving to the next form field just like `onBlur` event on input.

_Note: Not using any watch mode will only update and validate (if defined) `formValues` on Form submit._

### Custom input component

In order to work form values watching, change of any field in form should emit an event on form tag. Most of all Input components do that but some custom input components that compiles to native input element but don't emit input changes event, where `updateFieldValue` can be use to watch the latest `formValues`.
```jsx
import React from 'react';
import { useForm } from '@excellent-react/form';
import Select from 'react-select';

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const MyForm = () => {
  const { formRef, updateFieldValue, formValues } = useForm({
    onSubmit: (data) => console.log(data),
  });

  return (
    <form ref={formRef}>
      <Select options={options} name="gender" onChange={updateFieldValue} />
      <button type="submit">submit</button>
    </form>
  );
};
```

### Note : 
Custom input component that has `customFieldHandler` hooked, doesn't need to implement anything to update `formValues`. It would be updated always regardless of any watch mode.

## **✅ Form Validation**

To enable form validation with `useForm` it requires `Yup` validation library to be installed.
[Yup get started here](https://github.com/jquense/yup#install)

Here is a basic example of a validation integrated form.

```jsx
import React from 'react';
import { useForm } from '@excellent-react/form';

const MyForm = () => {
  const { formRef, errors } = useForm({
    onSubmit: console.log,
    validation: object({
      aInput: string()
        .required('Text requires')
        .min(10, 'Text must be at least 10 characters long'),
    }),
  });

  return (
    <form ref={formRef}>
      <input name="a-input" type="text" aria-label="aInput" />
      <span>Error: {errors.aInput}</span>
      <button type="submit" aria-label="submit">
        submit
      </button>
    </form>
  );
};
```

Validation disallows invalid form submissions.`validation` in `useForm` checks for errors whenever a field is changed, that is on `onSubmit` and `onChange` event, if `watchValuesOn` is defined.
`useForm` is a key-value pair of field names and error messages. If no errors are found, value if `undefined`.

## **✌ Multi-Select input values handling**

To capture an array of multiple values of the input component, `useForm` can be configured.

```jsx
import React from 'react';
import { useForm } from '@excellent-react/form';

const MyForm = () => {
  const { formRef } = useForm({
    onSubmit: console.log,
    multipleValueInputs: ['favorite_pet'],
  });

  return (
    <form ref={formRef}>
      <fieldset>
        <legend>Favorite Pets</legend>
        <input
          type="checkbox"
          name="favorite_pet"
          value="dogs"
          id="dogs"
        /> <label htmlFor="dogs">Dogs</label>
        <input
          type="checkbox"
          name="favorite_pet"
          value="cats"
          id="cats"
        />{' '}
        <label htmlFor="cats">Cats</label>
        <input
          type="checkbox"
          name="favorite_pet"
          value="birds"
          id="birds"
        /> <label htmlFor="birds">Birds</label>
      </fieldset>
      <button type="submit" aria-label="submit">
        submit
      </button>
    </form>
  );
};
```

It works with other custom react input components.

```jsx
import React from 'react';
import { useForm } from '@excellent-react/form';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const MyForm = () => {
  const { formRef } = useForm({
    onSubmit: console.log,
    multipleValueInputs: ['favorite_test'],
  });

  return (
    <form ref={formRef}>
      <Select options={options} name="favorite_test" isMulti />
      <button type="submit">submit</button>
    </form>
  );
};
```

# **🚀 Performance**

## **🔄 Re-rendering**

Excellent-React's **`useForm`** has options to watch/unwatch changes of each input field in the form, depending on the use/unuse of `formValues`, `errors`. Not configuring watch mode _maximize performance of useForm_
