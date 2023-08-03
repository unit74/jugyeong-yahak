import React, { useState } from 'react'

function WordNameComponent(props) {
  // State
  const wordName = props.wordName

  return (
    <div>
    <h1>{wordName}</h1>
    </div>
  )
}

export default WordNameComponent