import App, { Container } from 'next/app';
import React from 'react';
import basicCSS from '../stylesheets/basic';

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
        <style global jsx>
          {basicCSS}
        </style>
      </Container>
    );
  }
}
