import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import { useForm } from './hooks/useForm';

  describe.each([
    ['onChange'],
    ['onBlur']
  ])("Form events with %s", (mode) => {
    const onSubmitMocked = jest.fn();

    beforeAll(() => {
      onSubmitMocked.mockReset();
    });

    const Form = () => {
      const { formEventHandler, submitHandler } = useForm();
      return (
        <form onSubmit={submitHandler(onSubmitMocked)} {...{[mode]: formEventHandler}} >
          <input name="a-input" type="text" aria-label="a-input" />
          <input name="a-checkbox" type="checkbox" aria-label="a-checkbox" />
          <button type="submit" aria-label="submit">submit</button>
        </form>
      );
    }

    const submitBtn = (form: RenderResult) => form.getByLabelText('submit');
    
    it('should return changed text input values', async () => {
      const form = render(<Form />);
      const input = form.getByLabelText('a-input');
      const inputText = "a input text";
  
      await userEvent.type(input, inputText);
      userEvent.click(submitBtn(form));
      
      expect(onSubmitMocked).toBeCalledWith({ 'a-input': inputText });
    });

    it('should return changed checkbox boolean', async () => {
      const form = render(<Form />);
      const checkbox = form.getByLabelText('a-checkbox');
  
      userEvent.click(checkbox);
      userEvent.click(submitBtn(form));
      
      expect(onSubmitMocked).toBeCalledWith({ 'a-checkbox': true });
    });
  });
