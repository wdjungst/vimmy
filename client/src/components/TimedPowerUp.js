import { Component } from 'react'
import { connect } from 'react-redux'
import { placePowerUp, removePowerUp } from '../reducers/powerUp'

class TimedPowerUp extends Component {
  componentDidMount() {
    this.int = setInterval( this.clearPowerUp, 10000 )
  }

  componentWillUnmount() {
    clearInterval(this.int)
  }

  clearPowerUp = () => {
    const { powerUp, dispatch } = this.props
    dispatch(removePowerUp())
    dispatch(placePowerUp())
  }

  render() {
    return null
  }
}

const mapStateToProps = (state) => {
  return { powerUp: state.powerUp }
}

export default connect(mapStateToProps)(TimedPowerUp)
