import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'
import s1 from './images/s1.png';
import s2 from './images/s2.png';
import s3 from './images/s3.png';
import s4 from './images/s4.png';
import s5 from './images/s5.png';
import s6 from './images/s6.png';
import PowerUp from './components/PowerUp';
import { placePowerUp, removePowerUp } from './reducers/powerUp';

const Man = styled.img`
  position: absolute;
  height: 180px;
  width: 150px;
  top: ${ props => props.top - 160 }px;
  left: ${ props => props.left }px;
  transform: ${ props => props.facing ? 'scaleX(-1)' : 'scale(1)' };
  filter: ${ props => props.facing };
`

class App extends Component {
  images = { s1, s2, s3, s4, s5, s6 }
  state = { top: 0, left: 0, vh: 0, sprite: 1, beers: 0, speed: 5, facing: null }

  componentDidMount() {
    const vh = window.innerHeight;
    this.setState({ vh, top: vh, loaded: true })
    document.addEventListener('keydown', this.move )
    this.props.dispatch(placePowerUp())
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.move)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.top !== this.state.top || prevState.left !== this.state.left) {
      const { beers, speed } = this.state;
      if (this.colide()) { 
        this.props.dispatch(removePowerUp())
        this.setState({ beers: beers + 1, speed: speed + 1 }, () => {
          const { powerUp } = this.props;
          if (!powerUp.show)
            this.addPowerUp()
        })
      }
    }
  }

  colide = () => {
    try {
		  const rect1 = document.getElementById('man').getBoundingClientRect();
		  const rect2 = document.getElementById('beer').getBoundingClientRect();
      return !(rect1.right < rect2.left + 60 || 
               rect1.left > rect2.right - 60 || 
               rect1.bottom < rect2.top + 60 || 
               rect1.top > rect2.bottom - 60)
    } catch (err) {
      return false
    }
  }

  addPowerUp = () => {
    this.props.dispatch(placePowerUp())
    this.setState({ sprite: 6 })
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
    const { top, left, loaded, sprite, beers, facing } = this.state

    return (
      <div>
        <span>Beer Count {beers}</span>
        { loaded && <Man id="man" top={top} left={left} src={this.images[`s${sprite}`]} facing={facing} /> }
        <PowerUp />
      </div>
    )
    
  }
}

const mapStateToProps = (state) => {
  return { powerUp: state.powerUp }
}

export default connect(mapStateToProps)(App);
