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
import Zombie from './components/Zombie';
import { placePowerUp, removePowerUp } from './reducers/powerUp';

const MoveRegex = /[hjkl]/
let MotionSpeed = 40 // Milliseconds

const Man = styled.img`
  position: absolute;
  height: 180px;
  width: 150px;
  top: ${ props => props.top - 160 }px;
  left: ${ props => props.left }px;
  transform: ${ props => props.facing ? 'scaleX(-1)' : 'scale(1)' };
  filter: ${ props => props.facing };
`

function setIntervalGenerator(callback, delay, generator, after) {
  let intervalId = setInterval(() => {
    let genObj = generator.next()
    if (genObj.done) {
      clearInterval(intervalId)

      if (after !== undefined)
        after()
    }
    else
      callback(genObj.value)
  }, delay)
  return intervalId 
}



function *counter(start=0, step=1) {
  let i = start 
  yield i
  while (true)
    yield i += step
}

function *range(start, end, step=1) {
  if ((end - start <= 0 && step > 0) || (end - start >= 0 && step < 0)) {
    return
  }

  if (start < end)
    for (let i of counter(start, step)) {
      if (i > end)
        break
      yield i
    }
  else
    for (let i of counter(start, step)) {
      if (i < end)
        break
      yield i
    }
}

function setIntervalN(cb, delay, n=0, after) {
  return n === 0 ? setInterval(cb, delay) :
    setIntervalGenerator(cb, delay, range(0, n), after)
}

class App extends Component {
  images = { s1, s2, s3, s4, s5, s6 }
  state = { top: 0, left: 0, vh: 0, sprite: 1, beers: 0, speed: 5, facing: null, motion: "", moving: false}

  componentDidMount() {
    const vh = window.innerHeight;
    this.setState({ vh, top: vh, loaded: true })
    if (!this.state.moving)
      document.addEventListener('keydown', this.handleInput)
    this.props.dispatch(placePowerUp())
  }

  componentWillUnmount() {
    if (!this.state.moving)
      document.removeEventListener('keydown', this.handleInput)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.top !== this.state.top || prevState.left !== this.state.left) {
      const { beers, speed } = this.state;
      if (this.collide()) { 
        this.props.dispatch(removePowerUp())
        this.setState({ beers: beers + 1, speed: speed + 1 }, () => {
          const { powerUp } = this.props;
          if (!powerUp.show)
            this.addPowerUp()
        })
      }
    }
  }

  collide = () => {
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

  updateMotion = (n = NaN) => {
    let {motion} = this.state
    if (isNaN(n))
      this.setState({motion: ""})
    else
      this.setState({motion: motion + n})
  }

  getMotion = () => {

    let {motion} = this.state
    if (motion === "" || motion === "0")
      return 1
    else
      return parseInt(motion, 10)

  }

  handleInput = ({key}) => {
    if (/\d/.test(key)) 
      this.updateMotion(parseInt(key, 10))
    else if (MoveRegex.test(key)) {
      this.move(key)
      this.updateMotion()
    }
    else {
      this.updateMotion()
      console.log("USE VIM KEYS")
    }
  }

  startMovement = (cb, rangeGen) => {
    document.removeEventListener('keydown', this.handleInput)
    this.setState({moving: true})
    this.ticker = setIntervalGenerator(cb, MotionSpeed, rangeGen,
      () => { this.setState({moving: false}); 
      document.addEventListener('keydown', this.handleInput) })
  }

  move = (key) => {
    const { top, left, speed, beers } = this.state;
    const motion = this.getMotion()
    const intoxication = beers > 10 ? beers - 10 : 0
    const adjSpeed = 5 + speed

    const lBound = 0
    const tBound = 159
    const bBound = window.innerHeight
    const rBound = window.innerWidth - 130

    const doMovement = (l, t) => {
      this.setState({left: l, top: t})
      this.walk(true)
    }

    const slip = () => Math.floor(Math.random() * 2) === 0 ? intoxication : -intoxication

    switch (key) {
      case 'h':
        if (left > lBound) {
          this.setState({facing: "FlipH"})
          if (motion === 1)
            doMovement(left - adjSpeed, top + slip())
          else
            this.startMovement((l) => doMovement(l, this.state.top + slip()),
              range(left, Math.max(left - (motion * adjSpeed), lBound), -adjSpeed))
        }
        break
      case 'j':
        if (top < bBound)
          if (motion === 1)
            doMovement(left - slip(), top + adjSpeed)
          else
            this.startMovement((t) => doMovement(this.state.left - slip(), t),
              range(top, Math.min(top + (motion * adjSpeed), bBound), adjSpeed))
        break
      case 'k':
        if (top > tBound)
          if (motion === 1)
            doMovement(left - slip(), top - adjSpeed)
          else
            this.startMovement((t) => doMovement(this.state.left - slip(), t),
              range(top, Math.max(top - (motion * adjSpeed), tBound), -adjSpeed))
        break
      case 'l':
        if (left < rBound) {
          this.setState({facing: null})
          if (motion === 1)
              doMovement(left + adjSpeed, top + slip())
          else {
            console.log(`motion * adjSpeed = ${motion * adjSpeed}, rbound = ${rBound}`)
            this.startMovement((l) => doMovement(l, this.state.top + slip()),
              range(left, Math.min(left + (motion * adjSpeed), rBound), adjSpeed))
          }
        }
        break
      default:
        console.log('USE VIM KEYS!')
    }
  }

  end = () => {
    return window.innerWidth - 50
  }

  middle = () => {
    return (window.innerHeight / 2) - 50
  }

  bottom = () => {
    return window.innerHeight - 100
  }

  render() {
    const { top, left, loaded, sprite, beers, facing, motion} = this.state

    return (
      <div>
        <span>Beer Count {beers}</span><br/>
        <span>Motion: {motion === "" ? "" : motion}</span>
        { loaded && <Man id="man" top={top} left={left} src={this.images[`s${sprite}`]} facing={facing} /> }
        <PowerUp />
        <Zombie y={20} speed={2}/>
        <Zombie speed={10} x={this.end()} y={this.middle()} facing="left" />
        <Zombie speed={7} y={this.bottom()} facing="right" />
      </div>
    )
    
  }
}

const mapStateToProps = (state) => {
  return { powerUp: state.powerUp }
}

export default connect(mapStateToProps)(App);
