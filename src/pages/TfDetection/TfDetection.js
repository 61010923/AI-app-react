// Import dependencies
import React, { useRef, useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import Webcam from 'react-webcam'
import { nextFrame } from '@tensorflow/tfjs'
// 2. TODO - Import drawing utility here
import {
  Box, Button, Switch, FormControlLabel,
} from '@mui/material'
import Lottie from 'react-lottie'
import { drawRect } from './utilities'
import animationData from '../../lotties/infinity.json'

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(true)
  const handleUserMedia = () => setTimeout(() => setLoading(false), 1_000)
  // Main function
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== 'undefined'
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const { video } = webcamRef.current
      const { videoWidth } = webcamRef.current.video
      const { videoHeight } = webcamRef.current.video

      // Set video width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Set canvas height and width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640, 480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)
      // const boxes = await obj[6].array()
      // const classes = await obj[7].array()
      // const scores = await obj[5].array()
      // console.log(await obj[7].array())
      const boxes = await obj[0].array()
      const classes = await obj[1].array()
      const scores = await obj[7].array()

      // Draw mesh
      const ctx = canvasRef.current.getContext('2d')

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)
      requestAnimationFrame(() => { drawRect(boxes[0], classes[0], scores[0], 0.9, videoWidth, videoHeight, ctx) })

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)
    }
  }
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (running) {
      let refreshIntervalId
      const runCoco = async () => {
        console.log('runcoco')
        // 3. TODO - Load network
        // const net = await tf.loadGraphModel('https://modeltf.s3.us-west-2.amazonaws.com/model.json')
        const net = await tf.loadGraphModel('https://maskmodel.s3.us-west-2.amazonaws.com/model.json')
        // Loop and detect hands
        refreshIntervalId = setInterval(() => {
          detect(net)
        }, 16.7)
      }
      runCoco()
      return () => clearInterval(refreshIntervalId)
    }
  }, [running])

  return (
    <>
      <Button
        color={running ? 'error' : 'primary'}
        onClick={() => setRunning(!running)}
      >
        {running ? 'stop' : 'start'}
      </Button>

      {/* {switchDetect ? (
        <Button variant="contained" onClick={() => runCoco('start')}>start</Button>

      )
        : (
          <Button variant="contained" onClick={() => runCoco('stop')}>stop</Button>

        )} */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'relative' }}>
          {loading
            && (
              <Box
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  zIndex: 9,
                  width: 640,
                  height: 480,
                }}
              >
                <Lottie
                  options={defaultOptions}
                  height={400}
                  width={400}
                />
              </Box>
            )}

          <Webcam
            ref={webcamRef}
            muted
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 9,
              width: 640,
              height: 480,
            }}
            onUserMedia={handleUserMedia}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 10,
              width: 640,
              height: 480,
              display: (running ? 'block' : 'none'),
              // backgroundColor: 'red',
            }}
          />
        </Box>
      </Box>

    </>
  )
}

export default App
