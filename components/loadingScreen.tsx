import React from 'react'
import { Loading } from '@geist-ui/react'
import styled from 'styled-components'

const LoadingScreen = () => {
  return (
    <StyledLoading>
      <Loading>Loading</Loading>
    </StyledLoading>
  )
}

const StyledLoading = styled.div`
  margin: 0 auto;
  height: 100vh;
`

export default LoadingScreen
