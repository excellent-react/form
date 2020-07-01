import React, { useEffect } from 'react';
import { useForm } from '../lib/hooks/useForm';
import { object, string } from 'yup';
import { render } from '@testing-library/react';
import Select from 'react-select'
import selectEvent from 'react-select-event'
import { submit } from './tools';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberryValue', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

describe('Form Validation with Custom Input', () => {
  const errorsCatch = jest.fn();
  const onSubmitMocked = jest.fn();

  beforeAll(() => {
    onSubmitMocked.mockReset();
    errorsCatch.mockReset();
  });

  const errorMessages = {
    selectRequired: 'select required',
    selectMin10: 'select option must be min 10',
  }

  const Form = () => {
    const { formRef, errors, customFieldHandler } = useForm({ 
      onSubmit: onSubmitMocked,
      validation: object(({
        'food': string().required(errorMessages.selectRequired).min(10, errorMessages.selectMin10)
      }))
    });

    useEffect(() => {
      errorsCatch(errors);
    }, [errors])

    return (
      <form ref={formRef} >
        <label htmlFor="food">Food</label>
        <Select options={options} inputId="food" onChange={customFieldHandler('food', e => e && e['value'])} />
        <button type="submit" aria-label="submit">submit</button>
      </form>
    );
  }

  it('input required', async () => {
    const form = render(<Form />);
    await submit(form);

    expect(onSubmitMocked).toBeCalledTimes(0);
    expect(errorsCatch).toBeCalledWith(expect.objectContaining({ 'food': errorMessages.selectRequired }));
  });

  it('text input less then 10', async () => {
    const form = render(<Form />);
    const select = form.getByLabelText('Food');

    selectEvent.select(select, "Chocolate");
    await submit(form);

    expect(onSubmitMocked).toBeCalledTimes(0);
    expect(errorsCatch).toBeCalledWith(expect.objectContaining({ 'food': errorMessages.selectMin10 }));
  });

  it('valid text input', async () => {
    const form = render(<Form />);
    const select = form.getByLabelText('Food');

    selectEvent.select(select, "Strawberry");
    await submit(form);

    expect(onSubmitMocked).toBeCalledTimes(1);
    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'food': 'strawberryValue' }));
    expect(errorsCatch).toBeCalledWith(undefined);
  });

})
