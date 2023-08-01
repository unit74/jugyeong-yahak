import React from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

const InformationCheck = ({title, id, click}) => {
    const navigate = useNavigate();

  return (
    <InfoCheck src={`/images/${id}.png`} alt={`${title}`} 
    onClick={() => {navigate(`${click}`)}}
    />

  )
}

export default InformationCheck

const InfoCheck = styled.img`
  width: 100px
  margin: 0px 50px;
  
  &:hover {
    transform: scale(1.03);
  }
`