import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import s1 from '../images/s1.png'
import s2 from '../images/s2.png'
import s3 from '../images/s3.png'
import s4 from '../images/s4.png'
import s5 from '../images/s5.png'
import s6 from '../images/s6.png'
import { placePowerUp, removePowerUp } from '../reducers/powerUp'
import { drink } from '../reducers/hero'

const MoveRegex = /[hjkl]/
let MotionSpeed = 40 // Milliseconds

const Man = styled.img`
  position: absolute
  height: 180px
  width: 150px
  top: ${ props => props.top - 160 }px
  left: ${ props => props.left }px
  transform: ${ props => props.facing ? 'scaleX(-1)' : 'scale(1)' }
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

class Hero extends Component {
  images = { s1, s2, s3, s4, s5, s6 }
  state = { top: 0, left: 0, sprite: 1, speed: 5, facing: null, motion: "" }

  componentDidMount() {
    const vh = window.innerHeight
    this.setState({ top: vh })
    document.addEventListener('keydown', this.handleInput)
    this.tick  = setInterval( this.detect, 100 )
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleInput)
    clearInterval(this.tick)
  }

  detect = () => {
    const { speed } = this.state
    const { beers, dispatch } = this.props
    const collision = this.collide()
    if (collision.length) { 
      if (collision.includes('beer')) {
        dispatch(removePowerUp())
        dispatch(drink(beers + 1))
        this.setState({ speed: speed + 1 }, () => {
          const { powerUp } = this.props
          if (!powerUp.show)
            this.addPowerUp()
        })
      } else {
        this.assessDamage(collision.filter( c => c !== 'beer' ))
      }
    }
  }

  assessDamage = (collisions) => {
    const { dispatch, beers } = this.props
    let newBeerValue = beers
    for (let damage of collisions) {
      switch (damage) {
        case 'boulder':
          newBeerValue = Math.floor( beers * .9 )
          break
      }
    }

    dispatch(drink(newBeerValue))
  }

  collide = () => {
    try {
		  const rect1 = document.getElementById('man').getBoundingClientRect()
      const objects = []
      const rectangles = document.getElementsByClassName('collide')
      for (let i = 0; i < rectangles.length; i++) {
        const obj = rectangles[i]
        let { left, right, top, bottom } = obj.getBoundingClientRect()
        objects.push({ left, right, top, bottom, id: obj.id })
      }

      let collisions = objects.map( (rect) => {
        if (
            !(rect1.right < rect.left + 60 || 
                 rect1.left > rect.right - 60 || 
                 rect1.bottom < rect.top + 60 || 
                 rect1.top > rect.bottom - 60)
           ) {
             return rect.id
           }
      })
      return collisions.filter(n => n)
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
      () => { this.setState({moving: false}) 
      document.addEventListener('keydown', this.handleInput) })
  }

  move = (key) => {
    const { top, left, speed } = this.state
    const { beers } = this.props
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

  render() {
    const { top, left, sprite, facing, motion} = this.state

    return (
        <Man id="man" top={top} left={left} src={this.images[`s${sprite}`]} facing={facing} /> 
    )
    
  }
}

const mapStateToProps = (state) => {
  return { powerUp: state.powerUp, beers: state.hero.beers }
}

export default connect(mapStateToProps)(Hero)
