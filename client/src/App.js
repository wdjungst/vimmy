import React, { Component } from 'react';
import { connect } from 'react-redux';
import PowerUp from './components/PowerUp';
import { placePowerUp } from './reducers/powerUp';
import Hero from './components/Hero';

class App extends Component {
  state = { vh: 0, loaded: false }

  componentDidMount() {
    const vh = window.innerHeight;
    this.setState({ vh, loaded: true })
    this.props.dispatch(placePowerUp())
  }

  render() {
    const { loaded } = this.state

    return (
      <div>
        <Hero />
        <PowerUp />
      </div>
    )
    
  }
}

const mapStateToProps = (state) => {
  return { powerUp: state.powerUp }
}

export default connect(mapStateToProps)(App);
