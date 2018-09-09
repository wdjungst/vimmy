import React from 'react'
import { connect } from 'react-redux'
import { getObjectives } from '../levels'
import { levelUp } from '../reducers/hero'

class Level extends React.Component {
  state = { showObjectives: false, objective: {}, mechanics: [] }

  componentDidMount() {
    const { objective, mechanics } = getObjectives(this.props.level)
    debugger
    this.setState({ objective, mechanics })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.beers !== this.props.beers) {
      const { objective, mechanics } = getObjectives(this.props.level)
      this.setState({ objective, mechanics }, () => {
        const goal = objective.beers
        if (this.props.beers >= goal) {
          this.props.dispatch(levelUp())
        }
      })
    }
  }

  render() {
    const { objective, mechanics } = this.state
    return (
      <h2>Objective: {objective.text}</h2>
    )
  }
}

const mapStateToProps = (state) => {
  return { level: state.hero.level, beers: state.hero.beers }
}

export default connect(mapStateToProps)(Level)
