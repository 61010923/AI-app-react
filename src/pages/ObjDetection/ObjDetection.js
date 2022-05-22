import React, { useEffect, useState, useRef } from 'react'
import {
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
} from '@mui/material'
import Lottie from 'react-lottie'
import MenuIcon from '@mui/icons-material/Menu'
import { makeStyles } from '@mui/styles'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
import Webcam from 'react-webcam'
import { getAllData, setData } from '../../firebaseFunc'
// import {loadGraphModel} from '@tensorflow/tfjs-converter';

// import * as posenet from '@tensorflow-models/posenet';
import animationData from '../../lotties/infinity.json'
// import { createWorker, createScheduler } from 'tesseract.js'
// import * as cvstfjs from '@microsoft/customvision-tfjs';

function App() {
  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    toolsBar: {
      // minWidth: '800px',
      backgroundColor: 'rgba(0,0,0,0.1)',
      height: '3rem',
      marginBottom: '0.5rem',
      padding: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      borderRadius: '0.5rem',
    },
  }))
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const classes = useStyles()

  const webcamRef = React.useRef(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = React.useState(true)
  const [videoWidth, setVideoWidth] = useState(1240)
  const [videoHeight, setVideoHeight] = useState(710)
  const handleUserMedia = () => setTimeout(() => setLoading(false), 1_000)
  const [model, setModel] = useState()

  async function loadModel() {
    try {
      const modelSet = await cocoSsd.load()
      setModel(modelSet)
      console.log('setloadedModel')
    } catch (err) {
      console.log(err)
      console.log('failed load model')
    }
  }
  const getData = async () => {
    const data = await getAllData()
    console.log(data)
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel()
      getData()
    })
  }, [])

  async function predictionFunction() {
    const predictions = await model.detect(document.getElementById('img'))
    // setVideoHeight(webcamRef.current.video.videoHeight);
    // setVideoWidth(webcamRef.current.video.videoWidth);
    const cnvs = document.getElementById('myCanvas')

    // cnvs.style.position = "absolute";

    const ctx = cnvs.getContext('2d')
    ctx.clearRect(
      0,
      0,
      webcamRef.current.video.videoWidth,
      webcamRef.current.video.videoHeight,
    )

    if (predictions.length > 0) {
      // setPredictionData(predictions);
      console.log(predictions)
      // eslint-disable-next-line no-plusplus
      for (let n = 0; n < predictions.length; n++) {
        // Check scores
        console.log(n)
        if (predictions[n].score > 0.8) {
          const bboxLeft = predictions[n].bbox[0]
          const bboxTop = predictions[n].bbox[1]
          const bboxWidth = predictions[n].bbox[2]
          const bboxHeight = predictions[n].bbox[3] - bboxTop

          console.log(`bboxLeft: ${bboxLeft}`)
          console.log(`bboxTop: ${bboxTop}`)

          console.log(`bboxWidth: ${bboxWidth}`)

          console.log(`bboxHeight: ${bboxHeight}`)

          ctx.beginPath()
          ctx.font = '28px Arial'
          ctx.fillStyle = 'red'

          ctx.fillText(
            `${predictions[n].class
            }: ${
              Math.round(parseFloat(predictions[n].score) * 100)
            }%`,
            bboxLeft,
            bboxTop - 10,
          )

          ctx.rect(bboxLeft, bboxTop, bboxWidth, bboxHeight)
          ctx.strokeStyle = '#FF0000'

          ctx.lineWidth = 3
          ctx.stroke()

          console.log('detected')
        }
      }
    }

    setTimeout(() => predictionFunction(), 500)
  }
  const startVideo = () => {
    setPlaying(true)
    navigator.getUserMedia(
      {
        audio: false,
        video: {
          width: 1920,
          height: 1080,
          // facingMode: {
          //   exact: 'environment',
          // },
        },
      },
      (stream) => {
        const video = document.getElementsByClassName('app__videoFeed')[0]
        if (video) {
          video.srcObject = stream
        }
      },
      (err) => console.error(err),
    )
  }

  const stopVideo = () => {
    setPlaying(false)
    const video = document.getElementsByClassName('app__videoFeed')[0]
    video.srcObject.getTracks()[0].stop()
  }

  // useEffect(() => {
  //   //prevent initial triggering
  //   if (mounted.current) {
  //     predictionFunction();

  //   } else {
  //     mounted.current = true;
  //   }
  // }, [start]);

  const videoConstraints = {
    height: 1080,
    width: 1920,
    maxWidth: '100vw',
    facingMode: 'environment',
  }
  const createData = async () => {
    await setData()
  }

  return (
    <Box className={classes.container}>

      <Box className={classes.toolsBar}>
        <Button
          variant="contained"
          onClick={() => {
            predictionFunction()
          }}
        >
          Start Detect
        </Button>
        <Button onClick={stopVideo}>Stop</Button>
        <Button onClick={startVideo}>Start</Button>
      </Box>

      {loading && (
        <Box sx={{
          position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh',
        }}
        >
          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
          />
        </Box>
      )}

      <Box style={{
        position: 'relative', justifyContent: 'center', display: loading ? 'none' : 'flex',
      }}
      >
        <Box style={{
          position: 'absolute', top: '0', zIndex: '9999',
        }}
        >
          <canvas
            id="myCanvas"
            width={videoWidth}
            height={videoHeight}
            style={{ backgroundColor: 'transparent' }}
          />
        </Box>

        <Webcam
          audio={false}
          id="img"
          className="app__videoFeed"
          ref={webcamRef}
          screenshotQuality={1}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
        />
      </Box>
      <Button onClick={createData}>
        click
      </Button>
    </Box>
  )
}

export default App
