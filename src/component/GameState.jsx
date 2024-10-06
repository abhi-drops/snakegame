import React, { useEffect, useState } from 'react'
import GamePieces from './GamePieces'

const GameState = () => {

  const [score ,setScore] = useState(0)
  const [highScore ,setHighScore] = useState(parseInt(localStorage.getItem('highScore')) || 0)
const [gameOver, setGameOver] = useState(false)
const [collision,setCollisionType] = useState("")

const handleGameover = (type) => {
  setGameOver(true);
  if (score>highScore) {
    setHighScore(score)
    localStorage.setItem('highScore', score.toString())
  }

  setCollisionType(type)
}

const handleResetGame = () =>{
  setScore(0);
  setGameOver(false);

}

useEffect(()=>{
  const handleKeyPress =(e) =>{
    if (gameOver && e.key === 'Enter'){
      handleResetGame()
    }
  }

  window.addEventListener('keydown',handleKeyPress)
},[gameOver])

  return (
    <div style={{ display:"flex" , flexDirection:"column", justifyContent:"center", alignItems:"center" , overflowX:"hidden" }}>
      <h2>Score: {score}</h2>
      <h2>High Score: {highScore}</h2>
      {
        gameOver && (
          <div style={{width:"100%",height:"60Vh",display:"flex",justifyContent:"center",alignItems:'center',flexDirection:"column"}}>
            <h2><span style={{color:"red" , backgroundColor:"white" ,boxShadow:"#061228 5px 5px"}} className='gameover'>Game Over!</span> {collision === "wall" ? "You Hit the wall" : "You ate yourself"}!</h2>
            <h2>Please <span style={{color:"red" , backgroundColor:"white",boxShadow:"#061228 5px 5px"}}>Press Enter</span> to <span style={{color:"red" , backgroundColor:"white",boxShadow:"#061228 5px 5px"}} >RESET</span>  the Game</h2>
          </div>
        )
      }{
        !gameOver && (
          <GamePieces
          score={score}
          setScore={setScore}
          onGameOver={(type)=> handleGameover(type)}
          />
        )
      }
    </div>
  )
}

export default GameState