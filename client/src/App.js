import React, { Component } from 'react';
import { connect } from 'react-redux';
import PowerUp from './components/PowerUp';
import { placePowerUp } from './reducers/powerUp';
import Hero from './components/Hero';
import GameLoop from './components/GameLoop';
import Splash from './components/Splash';
import ScoreCard from './components/ScoreCard';

class App extends Component {

  componentDidMount() {
    this.props.dispatch(placePowerUp())
  }

  render() {
    const { powerUpType } = this.props

    if (powerUpType) {
      return (
        <GameLoop>
          <ScoreCard />
          <Hero />
          <PowerUp />
        </GameLoop>
      )
    } else {
      return <Splash />
    }
    
  }
}
const mapStateToProps = (state) => {
  return { 
    powerUp: state.powerUp, 
    powerUpType: state.powerUpType,
  }
}

export default connect(mapStateToProps)(App);
