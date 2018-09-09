import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { getObjectives } from '../levels'
import { levelUp } from '../reducers/hero'
import TimedPowerUp from './TimedPowerUp'

class Level extends React.Component {
  mechToComp = {
    TimedPowerUp,
  }

  state = { showObjectives: false, objective: {}, mechanics: [] }

  componentDidMount() {
    const { objective, mechanics } = getObjectives(this.props.level)
    this.setState({ objective, mechanics })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.beers !== this.props.beers) {
      const { objective, mechanics } = getObjectives(this.props.level)
      this.setState({ objective, mechanics: [...this.state.mechanics, ...mechanics] }, () => {
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
      <Fragment>
        <h2>Objective: {objective.text}</h2>
        { mechanics.map( (m, i) => { 
            const Comp = this.mechToComp[m]
            return <Comp key={i} />
          })
        }
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return { level: state.hero.level, beers: state.hero.beers }
}

export default connect(mapStateToProps)(Level)
