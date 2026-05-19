import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  html { scroll-behavior: smooth; }

  body {
    background: #0C0A09;
    color: #F5F5F4;
    font-family: 'Jost', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    cursor: none;
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

  /* Custom cursor */
  #cursor-dot {
    position: fixed; top:0; left:0; width:8px; height:8px;
    background: #CA8A04; border-radius: 50%; pointer-events: none;
    z-index: 99999; transform: translate(-50%,-50%);
    transition: transform 0.1s ease;
  }
  #cursor-ring {
    position: fixed; top:0; left:0; width:32px; height:32px;
    border: 1px solid rgba(202,138,4,0.6); border-radius: 50%; pointer-events: none;
    z-index: 99998; transform: translate(-50%,-50%);
    transition: transform 0.18s ease, width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0C0A09; }
  ::-webkit-scrollbar-thumb { background: #44403C; border-radius: 4px; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`
