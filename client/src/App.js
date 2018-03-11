import React, { Component } from 'react';
import styled from 'styled-components'
import s1 from './images/s1.png';
import s2 from './images/s2.png';
import s3 from './images/s3.png';
import s4 from './images/s4.png';
import s5 from './images/s5.png';
import s6 from './images/s6.png';
import beer from './images/beer.png';

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

const PowerUp = styled.img`
  position: absolute;
  height: 50px;
  width: 50px;
  display: ${ props => (props.top && props.left) ? 'block' : 'none' };
  top: ${ props => props.top }px;
  left: ${ props => props.left }px;
  z-index: -1
`

// helpful link: https://stackoverflow.com/questions/2956966/javascript-telling-setinterval-to-only-fire-x-amount-of-times
//Invokes callback on each value of generator, optionally calling 'after' once generator has expired
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

//Start & End are inclusive
function *range(start, end, step=1) {
  //This *should* keep you from generating an 'endless' range
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

//setIntervalGenerator((i) => console.log(`step ${i}`), 500, range(0, 100, 5))
//setIntervalN((i) => console.log(`step ${i}`), 500, 20, () => console.log("all finished!"))

//for (let i of range(0, 100, 5))
//  console.log(i)
//
//for (let i of range(0, -100, -5))
//  console.log(i)

class App extends Component {
  images = { s1, s2, s3, s4, s5, s6 }
  state = { top: 0, left: 0, vh: 0, sprite: 1, powerUp: {}, beers: 0, speed: 5, facing: null, motion: "", moving: false}

  componentDidMount() {
    const vh = window.innerHeight;
    this.setState({ vh, top: vh, loaded: true })
    if (!this.state.moving)
      document.addEventListener('keydown', this.handleInput)
    setTimeout( () => this.addPowerUp(), 1000)
  }

  componentWillUnmount() {
    if (!this.state.moving)
      document.removeEventListener('keydown', this.handleInput)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.top !== this.state.top || prevState.left !== this.state.left) {
      const { beers, speed } = this.state;
      if (this.collide()) { 
        this.setState({ beers: beers + 1, powerUp: {}, speed: speed + 1 }, () => {
          const { powerUp } = this.state;
          if (!powerUp.top && !powerUp.left)
            this.addPowerUp()
        })
      }
    }
  }

  collide = () => {
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

  updateMotion = (n = NaN) => {
    let {motion} = this.state
    if (isNaN(n))
      this.setState({motion: ""})
    else
      this.setState({motion: motion + n})

    //  console.log(this.state.motion)
  }

  getMotion = () => {

    let {motion} = this.state
    if (motion === "" || motion === "0")
      return 1
    else
      return parseInt(motion, 10)

  }

  handleInput = ({key}) => {
    // If Numeric
    if (/\d/.test(key)) 
      this.updateMotion(parseInt(key, 10))
    // If one of 'hjkl'
    else if (MoveRegex.test(key)) {
      this.move(key)
      this.updateMotion() // Clears motion
    }
    // Otherwise
    else {
      this.updateMotion() // Clears motion
      console.log("USE VIM KEYS")
    }
  }

  startMovement = (cb, rangeGen) => {
    //Make it so we can't enter input during movement
    document.removeEventListener('keydown', this.handleInput)
    this.setState({moving: true})
    //Activate our self-destructing interval
    this.ticker = setIntervalGenerator(cb, MotionSpeed, rangeGen,
      () => { this.setState({moving: false}); 
      document.addEventListener('keydown', this.handleInput) })
    //Then make sure we return to regular state once we've finished moving
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

    //let offset = Math.floor(Math.random() * 2)
    //slip = offset === 0 ? Math.abs(slip) : -Math.abs(slip)

    const doMovement = (l, t) => {
      //console.log(`left: ${l}, top: ${t}`)
      this.setState({left: l, top: t})
      this.walk(true)
    }

    const slip = () => Math.floor(Math.random() * 2) === 0 ? intoxication : -intoxication

    switch (key) {
        // Left movement
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
        // Downward movement
      case 'j':
        if (top < bBound)
          if (motion === 1)
            doMovement(left - slip(), top + adjSpeed)
          else
            this.startMovement((t) => doMovement(this.state.left - slip(), t),
              range(top, Math.min(top + (motion * adjSpeed), bBound), adjSpeed))
        break
        // Upward movement
      case 'k':
        if (top > tBound) // Remember that the lower you are, the larger your 'top' value
          if (motion === 1)
            doMovement(left - slip(), top - adjSpeed)
          else
            this.startMovement((t) => doMovement(this.state.left - slip(), t),
              range(top, Math.max(top - (motion * adjSpeed), tBound), -adjSpeed))
        break
        // Right movement
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

  render() {
    const { top, left, loaded, sprite, powerUp, beers, facing, motion} = this.state

    return (
      <div>
        <span>Beer Count {beers}</span><br/>
        <span>Motion: {motion === "" ? "" : motion}</span>
        { loaded && <Man id="man" top={top} left={left} src={this.images[`s${sprite}`]} facing={facing} /> }
        { powerUp && <PowerUp id="beer" src={beer} top={powerUp.top} left={powerUp.left} /> }
      </div>
    )
    
  }
}

export default App;
