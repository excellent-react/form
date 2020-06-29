import React from 'react';
import Select from 'react-select'
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import selectEvent from 'react-select-event'
import { useForm } from './hooks/useForm';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberryValue', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  describe.each([
    ['input'],
    ['change']
  ] as const)("Form events with %s", (mode) => {
    const onSubmitMocked = jest.fn();

    beforeAll(() => {
      onSubmitMocked.mockReset();
    });

    const Form = () => {
      const { formRef, customFieldHandler } = useForm({ onSubmit: onSubmitMocked });
      return (
        <form ref={formRef} >
          <input name="a-input" type="text" aria-label="a-input" />
          <input name="a-checkbox" type="checkbox" aria-label="a-checkbox" />
          <label htmlFor="food">Food</label>
          <Select options={options} inputId="food" onChange={customFieldHandler('food', e => e && e['value'])} />
          <button type="submit" aria-label="submit">submit</button>
        </form>
      );
    }

    const submit = async (form: RenderResult) =>  {
      await sleep(100);
      userEvent.click(form.getByLabelText('submit'));
    }
    
    it('should return changed text input values', async () => {
      const form = render(<Form />);
      const input = form.getByLabelText('a-input');
      const inputText = "a input text";
  
      await userEvent.type(input, inputText);
      await submit(form);
      expect(onSubmitMocked).toBeCalledWith({ 'a-input': inputText });
    });

    it('should return changed checkbox boolean', async () => {
      const form = render(<Form />);
      const checkbox = form.getByLabelText('a-checkbox');
  
      userEvent.click(checkbox);
      await submit(form);
      expect(onSubmitMocked).toBeCalledWith({ 'a-checkbox': true });
    });

    it('should return changed value of custom component ', async () => {
      const form = render(<Form />);
      const select = form.getByLabelText('Food');
      
      selectEvent.select(select, "Strawberry");
      await submit(form);
      expect(onSubmitMocked).toBeCalledWith({ 'food': 'strawberryValue' });
    });
  });