import React from 'react'
import Level from './Level'

const GameLoop = ({ children }) => (
  <div>
    { children }
    <Level />
  </div>
)

export default GameLoop
