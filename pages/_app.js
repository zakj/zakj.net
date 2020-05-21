import App from 'next/app';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import 'style/base.css';
// XXX remove this? and most of this file except import base.css. how can we get theme.js vars in base.css?
import theme from 'style/theme';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
