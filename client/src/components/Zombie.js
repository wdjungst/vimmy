import React, { Component } from 'react'
import styled from 'styled-components'
import zombie1 from '../images/zombie1.png'
import zombie2 from '../images/zombie2.png'
import zombie3 from '../images/zombie3.png'
import zombie4 from '../images/zombie4.png'
import { human } from '../utils/sizes'

const Enemy = styled.img`
  position: absolute;
  height: ${human.height}px;
  width: ${human.width}px;
  top: ${ props => props.top - human.topOffset }px;
  left: ${ props => props.left }px;
  transform: ${ props => props.facing ? 'scaleX(-1)' : 'scale(1)' };
  filter: ${ props => props.facing };
`

class Zombie extends Component {
  images = { zombie1, zombie2, zombie3, zombie4 }
  state = { top: 0, left: 0, sprite: 1, facing: null }

  componentDidMount() {
    this.placeZombie()
  }

  componentWillUnmount() {
    clearInterval(this.tick)
  }

  placeZombie = () => {
    const height = window.innerHeight 
    const width = window.innerWidth
    const top = Math.floor(Math.random() * (height - human.height) + human.height)
    const left = Math.floor(Math.random() * (width - human.width) + human.width)
    this.setState({ top, left })
    this.tick = setInterval( this.path, 250 )
  }

  path = () => {
    const { facing, left, sprite, top } = this.state
    const height = window.innerHeight 
    let step = left
    let changeDirection = facing
    let view
    let newTop = top

    if  (facing) {
      step -= 10
      if (step <= -human.width) {
        changeDirection = null
        newTop = Math.floor(Math.random() * (height - human.height) + human.height)
      }
    } else {
      step += 10
      if (step > window.innerWidth) { 
        changeDirection = "FlipH"
        newTop = Math.floor(Math.random() * (height - human.height) + human.height)
      }
    }

    if (sprite === 4)
      view = 1
    else
      view = sprite + 1

    this.setState({ left: step, facing: changeDirection, sprite: view, top: newTop })
  }


  render() {
    const { top, left, sprite, facing } = this.state

    return (
        <Enemy id="zombie" className="collide" top={top} left={left} src={this.images[`zombie${sprite}`]} facing={facing} /> 
    )
    
  }
}

export default Zombie
