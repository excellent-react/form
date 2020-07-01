import React from 'react';
import Select from 'react-select'
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import selectEvent from 'react-select-event'
import { useForm } from '../lib/hooks/useForm';
import { submit } from './tools';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberryValue', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

describe("Form input Components values should return onSubmit", () => {
  const onSubmitMocked = jest.fn();

  beforeAll(() => {
    onSubmitMocked.mockReset();
  });

  const Form = () => {
    const { formRef, customFieldHandler } = useForm({ onSubmit: onSubmitMocked, multipleValueInputs: ['favorite_pet'] });
    return (
      <form ref={formRef} >
        <input name="a-input" type="text" aria-label="a-input" />
        <input name="a-checkbox" type="checkbox" aria-label="a-checkbox" />
        <input name="a-hidden-input" type="hidden" aria-label="a-hidden-input" value="hidden-value" />

        <input type="password" aria-label="a-password" onBlur={customFieldHandler('a-password')}/>

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
        <Select options={options} inputId="food" onChange={customFieldHandler('food', e => e && e['value'])} />
        <button type="submit" aria-label="submit">submit</button>
      </form>
    );
  }

  it('text input', async () => {
    const form = render(<Form />);
    const input = form.getByLabelText('a-input');
    const inputText = "a input text";

    await userEvent.type(input, inputText);
    await submit(form);
    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'a-input': inputText }));
  });

  it('checkbox boolean', async () => {
    const form = render(<Form />);
    const checkbox = form.getByLabelText('a-checkbox');

    userEvent.click(checkbox);
    await submit(form);
    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'a-checkbox': true }));
  });

  it('radio option', async () => {
    const form = render(<Form />);
    const radioButton = form.getByLabelText('Dewey');

    userEvent.click(radioButton);
    await submit(form);
    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'drone': 'dewey' }));
  });

  it('multiple checked values', async () => {
    const form = render(<Form />);
    const dogsCheckbox = form.getByLabelText('Dogs');
    const birdsCheckbox = form.getByLabelText('Birds');

    userEvent.click(dogsCheckbox);
    userEvent.click(birdsCheckbox);

    await submit(form);

    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'favorite_pet': ['dogs', 'birds'] }));
  });

  it('hidden input', async () => {
    const form = render(<Form />);
    const checkbox = form.getByLabelText('a-hidden-input');

    userEvent.click(checkbox);
    await submit(form);
    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'a-hidden-input': 'hidden-value' }));
  });

  it('custom component ', async () => {
    const form = render(<Form />);
    const select = form.getByLabelText('Food');

    selectEvent.select(select, "Strawberry");
    await submit(form);
    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'food': 'strawberryValue' }));
  });

  it('custom component with native event callback', async () => {
    const form = render(<Form />);
    const passwordInput = form.getByLabelText('a-password');
    const inputText = "secret";

    await userEvent.type(passwordInput, inputText);
    await submit(form);
    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'a-password': inputText }));
  });
});
