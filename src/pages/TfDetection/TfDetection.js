// Import dependencies
import React, { useRef, useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import Webcam from 'react-webcam'
import './App.css'
import { nextFrame } from '@tensorflow/tfjs'
// 2. TODO - Import drawing utility here
import { Box } from '@mui/material'
import { drawRect } from './utilities'

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  // Main function

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
      requestAnimationFrame(() => { drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx) })

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)
    }
  }

  useEffect(() => {
    const runCoco = async () => {
      // 3. TODO - Load network
      // const net = await tf.loadGraphModel('https://modeltf.s3.us-west-2.amazonaws.com/model.json')
      const net = await tf.loadGraphModel('https://maskmodel.s3.us-west-2.amazonaws.com/model.json')
      // Loop and detect hands
      setInterval(() => {
        detect(net)
      }, 16.7)
    }
    runCoco()
  }, [])

  return (
  // <div className="App">
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'relative' }}>
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
          // backgroundColor: 'red',
          }}
        />
      </Box>
    </Box>
  // </div>
  )
}

export default App
