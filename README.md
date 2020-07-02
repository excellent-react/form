<img src="https://raw.githubusercontent.com/excellent-react/form/master/apps/form-documentation/src/assets/excellent-react.svg" alt="Excellent React" width="400"/>

**Excellent Tools for your Excellent React App development.** 
______

<img src="https://raw.githubusercontent.com/excellent-react/form/master/apps/form-documentation/src/assets/excellent-react-use-form.svg" alt="Excellent React" max-width="600"/>

An Excellent React hook for you React forms.

### What makes it Excellent
  * Performance
  * Less foot-print 
  * Validation
  * Easy to Integrate

# Get Started

## How to Install

Just one command

`npm install @excellent-react/form`

or

`yarn add @excellent-react/form`

## How to Use

Below example shows basic use of `useForm`
```js
import React from 'react';
import { useForm } from '@excellent-react/form';


export function App() {
  const { formRef, formValues } = useForm({
    onSubmit: (data) => console.log(data),
  });

  return (
    <form ref={formRef}>
      <input type="text" name="a-input" />
      <button type="submit">submit</button>
    </form>
  );
};
```
