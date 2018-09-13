import React from 'react';
import App, { Container } from 'next/app';
import JssProvider from 'react-jss/lib/JssProvider';

// material-ui
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import getPageContext from '../components/getPageContext';

// components
import Header from '../components/Header';
import { AttendanceProvider, AttendanceConsumer } from '../components/AttendanceContext';
import Notification from '../components/Notification';

class MyApp extends App {
  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }

  pageContext = null;

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Header />
            {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server side. */}
            <AttendanceProvider>
              <AttendanceConsumer>
                {attendanceProps => (
                  <>
                    <Component pageContext={this.pageContext} {...pageProps} {...attendanceProps} />
                    <Notification
                      {...attendanceProps.notification}
                      onClose={attendanceProps.onNotificationClose}
                    />
                  </>
                )}
              </AttendanceConsumer>
            </AttendanceProvider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default MyApp;
