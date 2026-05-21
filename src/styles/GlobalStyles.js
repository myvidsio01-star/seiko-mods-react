import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  html { scroll-behavior: smooth; }

  body {
    background: #0C0A09;
    color: #F5F5F4;
    font-family: 'Jost', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
  }


  ::selection { background: rgba(202,138,4,0.3); color: #F5F5F4; }

  h1, h2, h3, h4 {
    font-family: 'Bodoni Moda', serif;
    font-weight: 400;
    line-height: 1.15;
  }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  img { max-width: 100%; display: block; }


  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0C0A09; }
  ::-webkit-scrollbar-thumb { background: #44403C; border-radius: 4px; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`
