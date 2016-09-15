import React, { Component } from 'react'

const YUGE = 8
const ballSize = YUGE
const paddleMaxSpeed = 4
const paddleWidth = ballSize * 8
const paddleHeight = ballSize * 2
const leftKeys = [37, 65]
const rightKeys = [39, 68]

class Game extends Component {

  constructor () {
    super()
    this.state = {
      ball: {
        position: {
          x: 0,
          y: 0
        },
        velocity: {
          x: 1,
          y: 1
        }
      },
      paddle: {
        position: 0,
        velocity: 0
      }
    }
    this.drawRequest = 0
    this.updateRequest = 0
  }

  update = () => {
    // Copy current state.
    const ballPosition = Object.assign({}, this.state.ball.position)
    const ballVelocity = Object.assign({}, this.state.ball.velocity)
    let paddlePosition = this.state.paddle.position
    let paddleVelocity = this.state.paddle.velocity

    // Inverting the velocity if it's out of bounds.
    if (ballPosition.x > (this.canvas.width - ballSize) || ballPosition.x < 0) { ballVelocity.x = ballVelocity.x * -1 }
    if (ballPosition.y > (this.canvas.height - ballSize) || ballPosition.y < 0) { ballVelocity.y = ballVelocity.y * -1 }

    // If the Left or Right key is press, increase velocity
    if (this.state.left) { paddleVelocity = paddleVelocity - 0.2 }
    if (this.state.right) { paddleVelocity = paddleVelocity + 0.2 }
    // If neither key is pressed, decay the velocity.
    if (!this.state.left && !this.state.right) { paddleVelocity = paddleVelocity * 0.9 }
    // Clamp the velocity to +/- the max velocity
    paddleVelocity = Math.max(Math.min(paddleVelocity, paddleMaxSpeed), paddleMaxSpeed * -1)
    // update the position of the paddle based on it's new velocity
    paddlePosition = paddlePosition + paddleVelocity

    // Ensure we never go off screen
    const maxPaddlePosition = this.canvas.width - paddleWidth
    if (paddlePosition > maxPaddlePosition) { paddlePosition = maxPaddlePosition }
    if (paddlePosition < 0) { paddlePosition = 0 }

    this.setState({
      ball: {
        position: {
          x: ballPosition.x + ballVelocity.x,
          y: ballPosition.y + ballVelocity.y
        },
        velocity: ballVelocity
      },
      paddle: {
        position: paddlePosition,
        velocity: paddleVelocity
      }
    })
  }

  draw = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.fillStyle = 'white'
    this.context.fillRect(
      this.state.ball.position.x,
      this.state.ball.position.y,
      ballSize, ballSize
    )

    this.context.fillRect(
      this.state.paddle.position,
      this.canvas.height - (paddleHeight + ballSize),
      paddleWidth, paddleHeight
    )

    return window.requestAnimationFrame(this.draw)
  }

  handleKeyDown = (event) => {
    if (leftKeys.includes(event.keyCode)) {
      this.setState({ left: true })
    }
    if (rightKeys.includes(event.keyCode)) {
      this.setState({ right: true })
    }
  }

  handleKeyUp = (event) => {
    if (leftKeys.includes(event.keyCode)) {
      this.setState({ left: false })
    }
    if (rightKeys.includes(event.keyCode)) {
      this.setState({ right: false })
    }
  }

  componentDidMount () {
    // Get a reference to our Canvas.
    this.canvas = this.refs.canvas
    this.context = this.canvas.getContext('2d')
    // Set our canvas to the size of the screen.
    this.canvas.width = 640
    this.canvas.height = 480

    // Manual listen for key events on window
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('keydown', this.handleKeyDown)

    // Render our first frame.
    this.drawRequest = this.draw()
    // Update every 10ms
    this.updateRequest = window.setInterval(this.update, 10)
  }

  componentWillUnmount () {
    // Stop trying to draw our animation if this
    // component comes off the screen.
    window.cancelAnimationFrame(this.drawRequest)
    window.clearInterval(this.updateRequest)
  }

  render () {
    return <canvas ref='canvas' />
  }
}

export default Game
