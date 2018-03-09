import React, { Component } from 'react';
import styled from 'styled-components'
import s1 from './images/s1.png';
import s2 from './images/s2.png';
import s3 from './images/s3.png';
import s4 from './images/s4.png';
import s5 from './images/s5.png';
import s6 from './images/s6.png';
import beer from './images/beer.png';

const Man = styled.img`
  position: absolute;
  height: 180px;
  width: 150px;
  top: ${ props => props.top - 160 }px;
  left: ${ props => props.left }px;
  transform: ${ props => props.facing ? 'scaleX(-1)' : 'scale(1)' };
  filter: ${ props => props.facing };
`

const PowerUp = styled.img`
  position: absolute;
  height: 50px;
  width: 50px;
  display: ${ props => (props.top && props.left) ? 'block' : 'none' };
  top: ${ props => props.top }px;
  left: ${ props => props.left }px;
  z-index: -1
`

class App extends Component {
  images = { s1, s2, s3, s4, s5, s6 }
  state = { top: 0, left: 0, vh: 0, sprite: 1, powerUp: {}, beers: 0, speed: 5, facing: null }

  componentDidMount() {
    const vh = window.innerHeight;
    this.setState({ vh, top: vh, loaded: true })
    document.addEventListener('keydown', this.move )
    setTimeout( () => this.addPowerUp(), 1000)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.move)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.top !== this.state.top || prevState.left !== this.state.left) {
      const { beers, speed } = this.state;
      if (this.colide()) { 
        this.setState({ beers: beers + 1, powerUp: {}, speed: speed + 1 }, () => {
          const { powerUp } = this.state;
          if (!powerUp.top && !powerUp.left)
            this.addPowerUp()
        })
      }
    }
  }

  colide = () => {
		const rect1 = document.getElementById('man').getBoundingClientRect();
		const rect2 = document.getElementById('beer').getBoundingClientRect();
    return !(rect1.right < rect2.left + 60 || 
             rect1.left > rect2.right - 60 || 
             rect1.bottom < rect2.top + 60 || 
             rect1.top > rect2.bottom - 60)
  }

  addPowerUp = () => {
    let height = window.innerHeight
    let width = window.innerWidth
    let top = Math.abs(Math.floor(Math.random() * (height - 50)))
    let left = Math.abs(Math.floor(Math.random() * (width - 50)))
    this.setState({ powerUp: { top, left }, sprite: 6 })
  }

  walk = (didWalk) => {
    const { sprite } = this.state
    if (didWalk) {
      if (sprite === 5) {
        this.setState({ sprite: 1 })
      } else if (sprite === 6) {
        setTimeout( () => this.setState({ sprite: 1 }), 300 )
      } else {
        this.setState({ sprite: sprite + 1 })
      }
    }
  }

  move = (e) => {
    let { key } = e;
    let { top, left, speed, beers } = this.state;
    let moved = false
    let slip = 0
    let drunk = beers > 10
    if (drunk)
      slip = beers - 10

    let offset = Math.floor(Math.random() * 2)
    slip = offset === 0 ? Math.abs(slip) : -Math.abs(slip)
      
    switch (key) {
      case 'h':
        if (left > 0) {
          let t = top + slip;
          moved = true
          this.setState({ left: left - (5 + speed), top: t, facing: 'FlipH' })
        }
        break
      case 'j':
        if (top < window.innerHeight) {
          let l = left - slip;
          moved = true
          this.setState({ top: top + (5 + speed), left: l })
        }
        break
      case 'k':
        if (top > 159) {
          let l = left - slip;
          moved = true
          this.setState({ top: top - (5 + speed), left: l })
        }
        break
      case 'l':
        if (left < window.innerWidth - 161) {
          let t = top + slip;
          moved = true
          this.setState({ left: left + (5 + speed), top: t, facing: null })
         }
        break
      default:
        console.log('USE VIM KEYS!')
    }

    this.walk(moved)
  }

  render() {
    const { top, left, loaded, sprite, powerUp, beers, facing } = this.state

    return (
      <div>
        <span>Beer Count {beers}</span>
        { loaded && <Man id="man" top={top} left={left} src={this.images[`s${sprite}`]} facing={facing} /> }
        { powerUp && <PowerUp id="beer" src={beer} top={powerUp.top} left={powerUp.left} /> }
      </div>
    )
    
  }
}

export default App;
