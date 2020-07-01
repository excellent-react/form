import React from 'react';
import { useForm } from '@excellent-react/form';


export const App = () => {
  const { formRef, formValues } = useForm({
    watchValuesOn: 'change',
    onSubmit: () => console.log('submit'),
  });

  console.log(formValues);

  return (
    <form ref={formRef}>
      <input type="text" aria-label="a-input" name="a-input" />
        <button type="submit" aria-label="submit">submit</button>
    </form>
  );
};

export default App;
