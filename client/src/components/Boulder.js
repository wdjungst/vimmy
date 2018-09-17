import React from 'react'
import styled from 'styled-components'
import boulder1 from '../images/boulder1.png'
import boulder2 from '../images/boulder2.png'
import boulder3 from '../images/boulder3.png'
import boulder4 from '../images/boulder4.png'
import boulder5 from '../images/boulder5.png'
import boulder6 from '../images/boulder6.png'
import boulder7 from '../images/boulder7.png'
import boulder8 from '../images/boulder8.png'
const sprites = {
  boulder1,
  boulder2,
  boulder3,
  boulder4,
  boulder5,
  boulder6,
  boulder7,
  boulder8,
}

const Rock = styled.img`
  position: absolute;
  left: ${ props => props.left }px;
  top: ${ props => props.top }px;
  width: 50px;
  height: 50px;
`

class Boulder extends React.Component {
  state = { sprite: 1, top: 0, left: 0, bottom: 0 }

  componentDidMount() {
    this.interval = setInterval( this.change, 500 ) 
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  setLoc = () => {
    const bottom = window.innerHeight + 100
    const left = Math.floor(Math.random() * window.innerWidth )
    this.setState({ top: 0, left, bottom, sprite: 1 })
  }

  change = () => {
    const { sprite, bottom, top } = this.state
    let newSprite;
    let newTop;
    if (sprite === 8) 
      newSprite = 1; 
    else
      newSprite = sprite + 1

    if (top < bottom) {
      newTop = top  + 20
      this.setState({  top: newTop, sprite: newSprite })
    } else {
      this.setLoc()
    }
  }

  render() {
    const { sprite, top, left } = this.state
    const image = sprites[`boulder${sprite}`]
    return (
      <Rock src={image} alt="boulder" top={top} left={left} id="boulder" className="collide damage"/>
    )
  }
}

export default Boulder
