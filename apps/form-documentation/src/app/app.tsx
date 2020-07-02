import React from 'react';
import { useForm } from '@excellent-react/form';
import { object, string } from 'yup';


export const App = () => {
  const { formRef } = useForm({
    onSubmit: console.log,
    validation: object({
      'a-input': string().transform(v => parseInt(v, 10))
    })
  });

  return (
    <form ref={formRef} >
        <input name="a-input" type="text" aria-label="a-input" />
        <input name="a-checkbox" type="checkbox" aria-label="a-checkbox" />
        <input name="a-hidden-input" type="hidden" aria-label="a-hidden-input" value="hidden-value" />

        <fieldset>
          <legend>Select Drone</legend>
          <label htmlFor="huey">Huey</label>
          <input type="radio" id="huey" name="drone" value="huey" />
          <label htmlFor="dewey">Dewey</label>
          <input type="radio" id="dewey" name="drone" value="dewey" />
          <label htmlFor="louie">Louie</label>
          <input type="radio" id="louie" name="drone" value="louie" />
        </fieldset>

        <fieldset>
          <legend>Favorite Pets</legend>
          <input type="checkbox" name="favorite_pet" value="dogs" id="dogs" /> <label htmlFor="dogs">Dogs</label>
          <input type="checkbox" name="favorite_pet" value="cats" id="cats" /> <label htmlFor="cats">Cats</label>
          <input type="checkbox" name="favorite_pet" value="birds" id="birds" /> <label htmlFor="birds">Birds</label>
        </fieldset>

        <label htmlFor="food">Food</label>
        <button type="submit" aria-label="submit">submit</button>
      </form>
  );
};

export default App;
