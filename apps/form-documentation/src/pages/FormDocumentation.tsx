import React, { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';
import { Flex, Spinner } from '@chakra-ui/core';

const fetchDocumentationMarkdown = () => new Promise<string>((resolver, reject) => {
  fetch('https://raw.githubusercontent.com/panchaldeep009/form/master/README.md')
    .then(res => res.text())
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
      />
    </Flex>

  ) : (
      <Markdown
        children={markdownData}
        options={{
          disableParsingRawHTML: true
        }} />
    );
}

export default FormDocumentation
