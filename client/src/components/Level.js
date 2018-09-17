import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { getObjectives } from '../levels'
import { levelUp } from '../reducers/hero'
import TimedPowerUp from './TimedPowerUp'
import Boulder from './Boulder'
import Zombie from './Zombie'

class Level extends React.Component {
  mechToComp = {
    TimedPowerUp,
    Boulder,
    Zombie,
  }

  state = { showObjectives: false, objective: {}, mechanics: [] }

  componentDidMount() {
    const { objective, mechanics } = getObjectives(this.props.level)
    this.setState({ objective, mechanics })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.beers !== this.props.beers) {
      const { objective, mechanics } = getObjectives(this.props.level)
      const mechs = mechanics
      this.setState({ objective, mechanics: mechs }, () => {
        const goal = objective.beers
        if (this.props.beers >= goal) {
          this.props.dispatch(levelUp())
        }
      })
    }
  }

  render() {
    const { mechanics } = this.state
    return (
      <Fragment>
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
  return { 
    level: state.hero.level, 
    beers: state.hero.beers,
  }
}

export default connect(mapStateToProps)(Level)
