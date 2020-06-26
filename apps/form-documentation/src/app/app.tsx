import React from 'react';
import { useForm } from '@excellent-react/form';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

export const App = () => {
  const { formEventHandler, submitHandler, fieldHandler, formData } = useForm();
  console.log(formData);
  return (
    <form onSubmit={submitHandler(console.log)} onBlur={formEventHandler} >
        <input type="text" aria-label="a-input" onBlur={fieldHandler("a-input")} />
        <input type="datetime-local" id="birthday" name="birthday" />
        <input type="number" name="number" />
        <input type="week" name="week"/>

        <div>
          <input type="radio" id="huey" name="drone" value="huey" />
        </div>

        <div>
          <input type="radio" id="dewey" name="drone" value="dewey" />
        </div>

        <div>
          <input type="radio" id="louie" name="drone" value="louie"/>
        </div>

        <fieldset>      
        <legend>What is Your Favorite Pet?</legend>      
          <input type="checkbox" name="favorite_pet" value="Cats" />Cats
          <input type="checkbox" name="favorite_pet" value="Dogs" />Dogs
          <input type="checkbox" name="favorite_pet" value="Birds" />Birds
      </fieldset>

        <select name="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="fiat">Fiat</option>
          <option value="audi">Audi</option>
        </select>

        <select name="cars-m" multiple>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="fiat">Fiat</option>
          <option value="audi">Audi</option>
        </select> 

        <select name="cars-s" size={3}>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="fiat">Fiat</option>
          <option value="audi">Audi</option>
        </select>

        <textarea name="message" rows={10} cols={30}>
        The cat was playing in the garden.
        </textarea>

        <input type="range" id="volume" name="volume"
         min="0" max="11"></input>
        <Select options={options} onChange={fieldHandler("sel", e => e && e['value'])} isClearable/>
        <button type="submit" aria-label="submit">submit</button>
    </form>
  );
};

export default App;
