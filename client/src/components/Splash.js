import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { setPowerUp } from '../reducers/powerUpType'
import beer from '../images/beer.png'
import soda from '../images/soda.png'

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-around;
`

const Button = styled.button`
  height: 100px;
  width: 100px;
  border-radius: 20px;
  margin: 0 20px;
  cursor: pointer;
`

const Image = styled.img`
  height: 50px;
  width: 50px;
`

const Splash = ({ dispatch }) => (
  <Wrapper>
    <h1>Select your power up</h1>
    <Flex>
      <Button
        onClick={() => dispatch(setPowerUp('beer'))}
      >
        <Image src={beer} alt="power up" />
      </Button>
      <Button
        onClick={() => dispatch(setPowerUp('soda'))}
      >
        <Image src={soda} alt="power up" />
      </Button>
    </Flex>
  </Wrapper>
)

export default connect()(Splash)


