import  { useEffect, useRef, useState } from 'react'

const GamePieces = ({score,setScore,onGameOver}) => {

  const canvasRef = useRef()
  const SNAKE_SPEED = 10 + Math.floor(score / 5); // Increase speed every 5 points
  const [apple,setApple] = useState({x:180 , y:100})
  const [snake, setSnake] = useState([{x:100 , y:50},{x:95 , y:50 }])
  const [direction, setDirection] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawSnake = () => {
      snake.forEach((snakePark) => {
        ctx.beginPath();
        ctx.rect(snakePark.x, snakePark.y, 14, 14);
        ctx.fillStyle = '#061228';
        ctx.fill();
        ctx.closePath();
      });
    };

    const drawApple = () => {
      ctx.beginPath();
      ctx.rect(apple.x, apple.y, 14, 14);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
    };

    const moveSnake = () => {
      if (direction) {
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          const snakeHead = { x: newSnake[0].x, y: newSnake[0].y };

          for (let i = newSnake.length - 1; i > 0; i--) {
            newSnake[i].x = newSnake[i - 1].x;
            newSnake[i].y = newSnake[i - 1].y;
          }

          switch (direction) {
            case 'right':
              snakeHead.x += SNAKE_SPEED;
              break;
            case 'left':
              snakeHead.x -= SNAKE_SPEED;
              break;
            case 'up':
              snakeHead.y -= SNAKE_SPEED;
              break;
            case 'down':
              snakeHead.y += SNAKE_SPEED;
              break;
            default:
              break;
          }

          newSnake[0] = snakeHead;
          handleAppleCollision(newSnake);
          handleWallCollision(snakeHead);
          handleBodyCollision(newSnake);

          return newSnake;
        });
      }
    };

    const handleWallCollision = (snakeHead) => {
      if (snakeHead.x + SNAKE_SPEED > canvas.width || snakeHead.x < 0) {
        onGameOver('wall');
      }
      if (snakeHead.y + SNAKE_SPEED > canvas.height || snakeHead.y < 0) {
        onGameOver('wall');
      }
    };

    const handleBodyCollision = (newSnake) => {
      const snakeHead = newSnake[0];
      for (let i = 1; i < newSnake.length; i++) {
        if (snakeHead.x === newSnake[i].x && snakeHead.y === newSnake[i].y) {
          onGameOver('self');
        }
      }
    };

    const handleAppleCollision = (newSnake) => {
      const snakeHead = newSnake[0];
      const distance = Math.sqrt(
        Math.pow(snakeHead.x - apple.x, 2) + Math.pow(snakeHead.y - apple.y, 2)
      );

      const collisionThreshold = 14; // Adjust threshold as per snake/apple size

      if (distance < collisionThreshold) {
        setScore((prevScore) => prevScore + 1);

        setApple({
          x: Math.floor(Math.random() * (canvas.width / SNAKE_SPEED)) * SNAKE_SPEED,
          y: Math.floor(Math.random() * (canvas.height / SNAKE_SPEED)) * SNAKE_SPEED,
        });

        const lastSegment = newSnake[newSnake.length - 1];
        newSnake.push({
          x: lastSegment.x,
          y: lastSegment.y,
        });
      }
    };

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right');
          break;
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left');
          break;
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSnake();
      drawApple();
      moveSnake();
    }, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);  // Clean up event listener
    };
  }, [snake, direction, score]);  // Include score dependency for speed adjustments



  return (
    <div>
      <canvas ref={canvasRef} width={1200} height={520} className='gameCanvas'/>
    </div>
  )
}

export default GamePieces