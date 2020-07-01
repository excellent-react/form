import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { useForm } from '../lib/hooks/useForm';
import { submit } from './tools';

describe("Form watch mode", () => {

  const Form: React.FC<{ watchValuesOn?: 'input' | 'change', reRender: () => void }> = ({ watchValuesOn, reRender }) => {
    const { formRef, formValues } = useForm({ onSubmit: () => { /** */ }, watchValuesOn });

    reRender();
  
    return (
      <form ref={formRef} data-testid="a-form">
        <input name="aInput" type="text" aria-label="a-input" />
        <p>{formValues?.aInput}</p>
        <input name="aInput2" type="text" aria-label="a-input-2" />
        <button type="submit" aria-label="submit">submit</button>
      </form>
    );
  }

  it('Without watch mode', async () => {
    const reRender = jest.fn();

    // render here +1
    const form = render(<Form reRender={reRender}/>);
    const input = form.getByLabelText('a-input');
    const inputText = "a input text";

    await userEvent.type(input, inputText);
    // render here +1
    await submit(form);
    expect(reRender).toBeCalledTimes(2);
  });

  it('With change watch mode', async () => {
    const reRender = jest.fn();

    // render here +2 (mount + on DefaultValue fetch)
    const form = render(<Form watchValuesOn="change" reRender={reRender}/>);
    const input = form.getByLabelText('a-input');
    const inputText = "a input text";

    await userEvent.type(input, inputText);

    // Manually triggered form change event which should be trigger on input text defocus.
    // render here +1
    fireEvent.change(form.getByTestId('a-form'));

    // render here +1
    // TODO: Shouldn't, since values dose not changed
    await submit(form);
    expect(reRender).toBeCalledTimes(4);
  });

  it('With Input watch mode', async () => {
    const reRender = jest.fn();

    // render here +2 (mount + on DefaultValue fetch)
    const form = render(<Form watchValuesOn="input" reRender={reRender}/>);
    const input = form.getByLabelText('a-input');

    // render here +10 on Each character enter
    const inputText = "1234567890";
    await userEvent.type(input, inputText);
    
    // render here +1
    // TODO: Shouldn't, since values dose not changed
    await submit(form);
    expect(reRender).toBeCalledTimes(13);
  });

});
