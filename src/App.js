import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';
import Contribution from './Contribution';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
  }

  button {
    border: none;
    background-color: none;
  }
`;

function App() {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Contribution />
    </>
  );
}

export default App;
