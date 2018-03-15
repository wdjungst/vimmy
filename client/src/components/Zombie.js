import React from 'react';
import styled from 'styled-components';

const Monster = styled.div`
  width: 100px;
  height: 100px;
  background: transparent;
  border: solid 5px red;
  position: absolute;
  text-align: center;
  background-color: black;
  color: white;
  top: ${ props => props.y }px;
  left: ${ props => props.x }px;
`

class Zombie extends React.Component {
  state = { x: 0, y: 0, moving: 'right', speed: 5 }

  componentDidMount() {
    const { x = 0, y = 0, moving = 'right', speed = 5 } = this.props;
    this.setState({ x, y, moving, speed })
    this.interval = setInterval( () => this.pace(), 100 )
  }

  componentWillUnMount() {
    clearInterval(this.interval)
  }

  pace = () => {
    const { moving, x, speed } = this.state;
    if (moving === 'right')
      this.setState({ x: x + speed })
    else
      this.setState({ x: x - speed })

    const end = window.innerWidth;
    if (x >= end - 50 && moving === 'right')
      this.setState({ moving: 'left' })
    else if (x <= 5 && moving === 'left') 
      this.setState({ moving: 'right' })
  }

  render() {
    const { x, y, speed, moving } = this.state;
    return (
      <Monster x={x} y={y}>
        Zombie
        <p>
          x: {x}
          <br />
          {moving === 'right' ? '---->' : '<----'}
          <br />
          Speed: {speed}
        </p>
      </Monster>
    )
  }
}

export default Zombie;

