import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import beer from '../images/beer.png';

const Img = styled.img`
  position: absolute;
  height: 50px;
  width: 50px;
  display: ${ props => (props.top && props.left) ? 'block' : 'none' };
  top: ${ props => props.top }px;
  left: ${ props => props.left }px;
  z-index: -1
`

const PowerUp = ({ top, left, show }) => {
  if (show) {
    return <Img id="beer" src={beer} top={top} left={left} />
  } else {
    return null
  }
}

const mapStateToProps = (state) => {
  const { top, left, show } = state.powerUp;
  return { top, left, show } 
}

export default connect(mapStateToProps)(PowerUp);
