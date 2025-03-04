import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Knight from "./Knight.jsx";
import Square from "./Square.jsx";
import Board from "./Board.jsx";
import App from './App.jsx'

import {observe} from './Game.js'


const root = createRoot(document.getElementById('root'))

observe((knightPosition) =>
  root.render(<Board knightPosition={knightPosition} />, root)
)


