import React, { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import {
  Box,
  Code,
  Flex,
  Heading,
  HeadingProps,
  Image,
  List,
  Spinner,
} from '@chakra-ui/core';

const fetchDocumentationMarkdown = () =>
  new Promise<string>((resolver, reject) => {
    fetch(
      'https://raw.githubusercontent.com/panchaldeep009/form/master/README.md'
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
      console.log(markdownData);
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
      <Image src="../assets/excellent-react.svg" alt="Excellent React" />
      <Image
        src="../assets/excellent-react-use-form.svg"
        alt="Excellent React useForm"
      />
      <Markdown
        children={markdownData}
        options={{
          disableParsingRawHTML: false,
          overrides: {
            h1: { component: Heading },
            h2: { component: Heading, props: { size: 'md' } as HeadingProps },
            img: { component: Image },
            ul: { component: List, props: { styleType: 'disc' } },
            code: { component: Code },
          },
        }}
      />
    </Box>
  );
};

export default FormDocumentation;
