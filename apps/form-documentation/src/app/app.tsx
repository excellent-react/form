import React from 'react';
import { Form } from '@excellent-react/form'

export const App = () => {

  return (
    <Form onSubmit={console.log} formMode="blur">
        <input name="a-input" type="text" aria-label="a-input" />
        <button type="submit" aria-label="submit">submit</button>
    </Form>
  );
};

export default App;
