import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import React from 'react';
import FormDocumentation from './pages/FormDocumentation';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CSSReset />
      <FormDocumentation />
    </ThemeProvider>
  );
};
