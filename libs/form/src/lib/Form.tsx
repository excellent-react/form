import React from 'react';

import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface FormProps {}

const StyledForm = styled.div`
  color: pink;
`;

export const Form = (props: FormProps) => {
  return (
    <StyledForm>
      <h1>Welcome to form!</h1>
    </StyledForm>
  );
};

export default Form;
