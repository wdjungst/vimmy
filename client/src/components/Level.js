import React from 'react'
import { connect } from 'react-redux'
import { getObjectives } from '../levels'
import { levelUp } from '../reducers/hero'

class Level extends React.Component {
  state = { showObjectives: false, objectives: [] }

  componentDidMount() {
    const objectives = getObjectives(this.props.level)
    this.setState({ objectives })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.beers !== this.props.beers) {
      this.setState({ objectives: getObjectives(this.props.level) }, () => {
        const goal = this.state.objectives.find( l => l.hasOwnProperty('beers') )
        if (this.props.beers >= goal.beers) {
          this.props.dispatch(levelUp())
        }
      })
    }
  }

  render() {
    const { objectives } = this.state
    return (
      <ul>
        { objectives.map( (o,i) => <li key={i}>{o.text}</li> ) }
      </ul>
    )
  }
}

const mapStateToProps = (state) => {
  return { level: state.hero.level, beers: state.hero.beers }
}

export default connect(mapStateToProps)(Level)
