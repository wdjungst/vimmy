import React from 'react'

import styled from 'styled-components'
import s1 from './images/s1.png';
import s2 from './images/s2.png';
import s3 from './images/s3.png';
import s4 from './images/s4.png';
import s5 from './images/s5.png';
import s6 from './images/s6.png';
import beer from './images/beer.png';

const Man = styled.img`
  position: absolute;
  height: 180px;
  width: 150px;
  top: ${ props => props.top - 160 }px;
  left: ${ props => props.left }px;
  transform: ${ props => props.facing ? 'scaleX(-1)' : 'scale(1)' };
  filter: ${ props => props.facing };
`

class Hero extends React.Component {
  state = { speed: 5, facing: null, sprite: 1, top: 0, left: 0 }
  images = { s1, s2, s3, s4, s5, s6 }

  componentDidmount() {
    document.addEventListner('keydown', this.move )
    this.setState({ top: this.props.top })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.move)
  }

  render() {
    const { top, left, facing, sprite } = this.state

    return (
      <Man 
        id="man" 
        top={top} 
        left={left} 
        src={this.images[`s${sprite}`]} 
        facing={facing}
      />
    )
  }
}

export default Hero
