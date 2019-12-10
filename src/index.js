import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './pages/index';

import './index.scss';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/deepPurple';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
      light: purple[100],
      dark: purple[800],
    },
    secondary: {
      main: pink.A400,
      light: pink.A100,
      dark: pink.A700,
    },
    error: {
      main: red.A400,
    },
    background: {
      main: grey[100],
    },
    grey: {
      main: grey[400],
      light: grey[200],
      dark: grey[700]
    }
  },
});

ReactDOM.render(
  <Provider store={store()}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);