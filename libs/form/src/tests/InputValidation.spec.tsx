import React, { useEffect } from 'react';
import { useForm } from '../lib/hooks/useForm';
import { object, string } from 'yup';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { submit } from './tools';

describe('Form Validation', () => {
  const errorsCatch = jest.fn();
  const onSubmitMocked = jest.fn();

  beforeAll(() => {
    onSubmitMocked.mockReset();
    errorsCatch.mockReset();
  });

  const errorMessages = {
    inputRequired: 'Text Input required',
    inputMin10: 'Text Input must be min 10',
  }

  const Form = () => {
    const { formRef, errors } = useForm({ 
      onSubmit: onSubmitMocked,
      multipleValueInputs: ['favorite_pet'],
      validation: object(({
        'a-input': string().required(errorMessages.inputRequired).min(10, errorMessages.inputMin10)
      }))
    });

    useEffect(() => {
      errorsCatch(errors);
    }, [errors])

    return (
      <form ref={formRef} >
        <input name="a-input" type="text" aria-label="a-input" />
        <button type="submit" aria-label="submit">submit</button>
      </form>
    );
  }

  it('text input required', async () => {
    const form = render(<Form />);
    await submit(form);

    expect(onSubmitMocked).toBeCalledTimes(0);
    expect(errorsCatch).toBeCalledWith(expect.objectContaining({ 'a-input': errorMessages.inputRequired }));
  });

  it('text input less then 10', async () => {
    const form = render(<Form />);
    const input = form.getByLabelText('a-input');
    const inputText = "less 10";

    await userEvent.type(input, inputText);
    await submit(form);

    expect(onSubmitMocked).toBeCalledTimes(0);
    expect(errorsCatch).toBeCalledWith(expect.objectContaining({ 'a-input': errorMessages.inputMin10 }));
  });

  it('valid text input', async () => {
    const form = render(<Form />);
    const input = form.getByLabelText('a-input');
    const inputText = "valid input text";

    await userEvent.type(input, inputText);
    await submit(form);

    expect(onSubmitMocked).toBeCalledTimes(1);
    expect(onSubmitMocked).toBeCalledWith(expect.objectContaining({ 'a-input': inputText }));
    expect(errorsCatch).toBeCalledWith(undefined);
  });

})
