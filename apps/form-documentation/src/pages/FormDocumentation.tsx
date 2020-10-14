import React, { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import {
  Box,
  BoxProps,
  Code,
  Flex,
  Heading,
  HeadingProps,
  Image,
  List,
  Spinner,
  Text,
} from '@chakra-ui/core';

const fetchDocumentationMarkdown = () =>
  new Promise<string>((resolver, reject) => {
    fetch(
      'https://raw.githubusercontent.com/excellent-react/form/master/README.md'
    )
      .then((res) => res.text())
      .then(resolver)
      .catch(reject);
  });

const FormDocumentation: React.FC = () => {
  const [markdownData, setMarkdownData] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const markdownData = await fetchDocumentationMarkdown();
      setMarkdownData(markdownData);
      setLoading(false);
    })();
  }, []);

  return loading ? (
    <Flex
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
        aria-busy="true"
      />
    </Flex>
  ) : (
    <Box margin="auto" width={['100%', '80%', '60%', '50%']}>
      <Markdown
        children={markdownData}
        options={{
          disableParsingRawHTML: true,
          overrides: {
            h1: {
              component: Heading,
              props: { size: 'xl', my: 6 } as HeadingProps,
            },
            h2: {
              component: Heading,
              props: { size: 'lg', my: 4 } as HeadingProps,
            },
            p: { component: Text, props: { my: 2 } as BoxProps },
            img: { component: Image },
            ul: { component: List, props: { styleType: 'disc' } },
            code: { component: Code },
            pre: { component: Code, props: { as: 'pre', p: 4 } as BoxProps },
          },
        }}
      />
    </Box>
  );
};

export default FormDocumentation;
