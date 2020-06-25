import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import Form from './Form';

describe(' Form', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Form />);
    expect(baseElement).toBeTruthy();
  });

  it('should return changed Input', async () => {
    const onSubmitMocked = jest.fn();
    const form = render(
      <Form onSubmit={onSubmitMocked} formMode="change">
        <input name="a-input" type="text" aria-label="a-input" />
        <button type="submit" aria-label="submit">submit</button>
      </Form>
    );
    const input = form.getByLabelText('a-input');
    const inputText = "a input text";
    const button = form.getByLabelText('submit');

    await userEvent.type(input, inputText);
    userEvent.click(button);
    
    expect(onSubmitMocked).toBeCalledWith({ 'a-input': inputText });
  });

  it('should return blur Input', async () => {
    const onSubmitMocked = jest.fn();
    const form = render(
      <Form onSubmit={onSubmitMocked} formMode="blur">
        <input name="a-input" type="text" aria-label="a-input" />
        <button type="submit" aria-label="submit">submit</button>
      </Form>
    );
  
    const input = form.getByLabelText('a-input');
    const inputText = "a input text";
    const button = form.getByLabelText('submit');

    fireEvent.focusOut(input, { target: { value: inputText } });
    setTimeout(() => {
      fireEvent.click(button);
      expect(onSubmitMocked).toBeCalledWith({ 'a-input': inputText });
    }, 2000);
  });
});
