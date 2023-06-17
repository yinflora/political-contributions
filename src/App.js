import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';
import Compare from './Compare';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
  }
`;

function App() {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Compare />
    </>
  );
}

export default App;
