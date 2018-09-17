import React, { Component } from 'react';
import { connect } from 'react-redux';
import PowerUp from './components/PowerUp';
import { placePowerUp } from './reducers/powerUp';
import Hero from './components/Hero';
import GameLoop from './components/GameLoop';

class App extends Component {

  componentDidMount() {
    this.props.dispatch(placePowerUp())
  }

  render() {
    const { beers } = this.props

    return (
      <GameLoop>
        <p>Beers: {beers}</p>
        <Hero />
        <PowerUp />
      </GameLoop>
    )
    
  }
}

const mapStateToProps = (state) => {
  return { 
    powerUp: state.powerUp, 
    beers: state.hero.beers 
  }
}

export default connect(mapStateToProps)(App);
