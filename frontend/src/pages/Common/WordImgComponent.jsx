import React, { useState } from 'react'

function WordImgComponent(props) {
  // State
  const wordImg = props.wordImg

  return (
    <div>
    <img src={wordImg} alt="" />
    </div>
  )
}

export default WordImgComponent