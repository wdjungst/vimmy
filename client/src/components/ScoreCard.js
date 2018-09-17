import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { capitalize } from '../utils/helpers'
import { getObjectives } from '../levels'

const Container = styled.div`
  top: 0;
  position: fixed;
  height: 100px;
  width: 200px;
  padding-bottom: 10px;
  padding-left: 10px;
  background-color: rgba(0, 0, 0, .03);
`

class ScoreCard extends React.Component {
  state = { show: true }

  render() {
    const { powerUpType, beers, level, objective } = this.props
    return (
      <Container>
        <p>{capitalize(powerUpType)}s: <b>{beers}</b></p>
        <p>Level: <b>{level}</b></p>
        <p>Objective: <b>{objective.text} {powerUpType}s</b></p>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return { 
    beers: state.hero.beers,
    powerUpType: state.powerUpType,
    level: state.hero.level,
    objective: getObjectives(state.hero.level).objective,
  }
}

export default connect(mapStateToProps)(ScoreCard)

