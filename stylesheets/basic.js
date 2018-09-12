import css from 'styled-jsx/css';

const basic = css`
  /* Reset CSS */
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  /* Reset CSS end */

  @font-face {
    font-family: 'Open Sans';
    src: url('/static/fonts/OpenSans-Regular') format('truetype');
    font-style: normal;
    font-weight: 400;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('/static/fonts/OpenSans-Bold.woff') format('truetype');
    font-style: normal;
    font-weight: 700;
  }

  @font-face {
    font-family: 'OpenSans';
    src: url('/static/fonts/OpenSans-Italic.woff') format('truetype');
    font-style: italic;
    font-weight: 400;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('/static/fonts/OpenSans-BoldItalic.woff') format('truetype');
    font-style: italic;
    font-weight: 700;
  }

  body {
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    line-height: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }

  input {
    -webkit-box-shadow: none;
    outline: -webkit-focus-ring-color auto 0px;
    border: none;
  }

  a {
    color: black;
    text-decoration: none;
  }

  a:hover,
  a:focus {
    opacity: 0.5;
    -webkit-transition: all 0.1s ease-out;
    -moz-transition: all 0.1s ease-out;
    -ms-transition: all 0.1s ease-out;
    -o-transition: all 0.1s ease-out;
    transition: all 0.1s ease-out;
  }

  b {
    font-weight: 700;
  }
`;

export default basic;
