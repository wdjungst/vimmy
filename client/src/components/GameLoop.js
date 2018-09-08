import React from 'react'
import { connect } from 'react-redux'
import Level from './Level'

class GameLoop extends React.Component {
  render() {
    const { level } = this.props
    return (
      <div>
        <p>Level: {level}</p> 
        { this.props.children }
        <Level />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { level: state.hero.level }
}

export default connect(mapStateToProps)(GameLoop)
