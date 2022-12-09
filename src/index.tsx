import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { reducer, StateProvider } from "./state";
import { StyledEngineProvider } from '@mui/material/styles';

ReactDOM.render(
  <StateProvider reducer={reducer} >
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </StateProvider>,
  document.getElementById('root')
);
