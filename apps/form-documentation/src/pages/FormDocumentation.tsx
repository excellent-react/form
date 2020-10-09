import React, { useEffect, useState } from 'react';
import Markdown from 'markdown-to-jsx';

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
    <div> Loading... </div>
  ) : (
    <Markdown 
      children={markdownData}
      options={{
        disableParsingRawHTML: true
      }} />
  );
}

export default FormDocumentation
