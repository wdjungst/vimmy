import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import beer from '../images/beer.png';
import soda from '../images/soda.png';

const Img = styled.img`
  position: absolute;
  height: 50px;
  width: 50px;
  display: ${ props => (props.top && props.left) ? 'block' : 'none' };
  top: ${ props => props.top }px;
  left: ${ props => props.left }px;
  z-index: -1
`

const PowerUp = ({ top, left, show, powerUpType }) => {
  const images = { soda, beer }
  if (show) {
    return <Img id="beer" className="collide" src={images[powerUpType]} top={top} left={left} />
  } else {
    return null
  }
}

const mapStateToProps = (state) => {
  const { top, left, show } = state.powerUp;
  return { 
    top, 
    left, 
    show,
    powerUpType: state.powerUpType,
  } 
}

export default connect(mapStateToProps)(PowerUp);
