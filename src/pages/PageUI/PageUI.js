import React, {
  useRef, useState, useEffect, useMemo,
} from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import * as tf from '@tensorflow/tfjs'
import Webcam from 'react-webcam'
import useSound from 'use-sound'

import axios from 'axios'

import { IconButton } from '@mui/material'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront'

import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import Table from '../../components/Table'
import Logo from '../../image/myLogo.png'
import LineQr from '../../image/line.jpg'
import linkNoMask from '../../sound/speech_20220412073706398.mp3'
import { drawRect } from '../../components/utilities'
import { getAllData, setData } from '../../firebaseFunc'
import { useDate } from './date'
import animationData from '../../lotties/infinity.json'

const useStyles = makeStyles((theme) => ({
  topicBox: {
    border: '1px ',
    borderRadius: '16px',
    backgroundColor: theme.palette.primary.main,
    padding: '16px',
    width: '80%',
    [theme.breakpoints.down('sm')]: {
      // margin: '0px 36px',
      width: '90%',
    },
  },
  background: {
    backgroundColor: theme.palette.primary.main,
  },
  box: {
    height: 'calc(100vh - 48px)',
    margin: '40px 32px 8px 40px',
    // backgroundColor: 'black',
    padding: '0px',
  },
  centerCanva: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
  headerBox: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
    },
  },
  flexControl: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
}))
function PageUI() {
  const style = useStyles()
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [sound, setSound] = useState(true)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [cameraSwitch, setCameraSwitch] = useState(false)
  const [playNoMask] = useSound(linkNoMask)
  const [rows, setRows] = useState([])
  const dateToday = useDate()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const handleUserMedia = () => setTimeout(() => setLoading(false), 1000)
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
      const boxes = await obj[5].array()
      const classes = await obj[2].array()
      const scores = await obj[3].array()
      // console.log(await obj[5].array())
      // Draw mesh
      const ctx = canvasRef.current.getContext('2d')

      requestAnimationFrame(() => {
        drawRect(
          boxes[0],
          classes[0],
          scores[0],
          0.9,
          videoWidth,
          videoHeight,
          ctx,
          playNoMask,
        )
      })

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)
    }
  }

  const saveImage = async () => {
    // get secure url from our server
    const { url } = await fetch(`${process.env.REACT_APP_BASE_URL}/s3Url`).then(
      (res) => res.json(),
    )
    const strToReplace = webcamRef.current.getScreenshot()
    const imageSrc = strToReplace.replace(/^data:image\/[a-z]+;base64,/, '')
    const u = strToReplace.split(',')[1]
    const binary = atob(u)
    const array = []

    for (let i = 0; i < binary.length; i += 1) {
      array.push(binary.charCodeAt(i))
    }
    const typedArray = new Uint8Array(array)
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: typedArray,
    })

    const imageUrl = url.split('?')[0]
    return imageUrl
  }
  const lineNotify = async (message, image) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/notify`,
        { message, image },
        {

          headers: {
            'Content-type': 'application/json',
          },
        },
      )
      if (response.status === 201 || response.status === 200) {
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSoundAndAlert = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== 'undefined'
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const { video } = webcamRef.current
      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640, 480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)

      const classes = await obj[2].array()
      const scores = await obj[3].array()
      if (Number(classes[0][0]) === 2 && parseFloat(scores[0][0]) > 0.9) {
        const imageUrl = await saveImage()
        const body = {
          image: imageUrl,
          date: new Date(),
        }
        await setData(body)
        setCount(count + 1)
        lineNotify('No mask', imageUrl)
        if (sound) {
          playNoMask()
        }
        // lineNotify()
      }
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
      let loopDetection
      let loopSoundAndAlert
      const runCoco = async () => {
        const net = await tf.loadGraphModel(
          'https://maskmodelv2.s3.us-west-2.amazonaws.com/model.json',
        )

        loopSoundAndAlert = setInterval(() => {
          handleSoundAndAlert(net)
        }, 3000)
        // }
        loopDetection = setInterval(() => {
          detect(net)
        }, 16.7)
      }
      runCoco()
      return () => {
        clearInterval(loopSoundAndAlert)
        clearInterval(loopDetection)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, sound])

  const getData = async () => {
    const data = await getAllData()
    setRows(data)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getMData = useMemo(() => getData(), [count])

  return (
    <Box className={style.box}>
      <Grid container column={2} spacing={2} height={{ md: 1 }} width={1}>
        <Grid item md={8} height="100%" width={1}>
          <Grid
            container
            direction="column"
            width={1}
            height={1}
            rowSpacing={2}
            wrap="nowrap"
          >
            <Grid item md={1}>
              <Box width="100%" className={style.flexControl} height="100%">
                <Box className={style.headerBox}>
                  <Box width="100px">
                    <img src={Logo} alt="logo" width="100%" />
                  </Box>
                  <Box width="100%" minWidth={100}>
                    <Typography variant="h6">Mask app</Typography>
                  </Box>
                </Box>
                <Box
                  // width="80%"/
                  className={style.topicBox}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Box>
                      <Typography variant="body1">Video conference</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2">{`${dateToday.wish} ${dateToday.date} ${dateToday.time}`}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex">
                    <Box mr={3}>
                      <IconButton
                        color={cameraSwitch ? 'primary' : 'secondary'}
                        sx={
                          cameraSwitch
                            ? { backgroundColor: 'black' }
                            : { backgroundColor: 'white' }
                        }
                        disableFocusRipple
                        onClick={() => {
                          setCameraSwitch(!cameraSwitch)
                          setRunning(!running)
                        }}
                      >
                        <VideoCameraFrontIcon />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton
                        color={sound ? 'primary' : 'secondary'}
                        sx={
                          sound
                            ? { backgroundColor: 'black' }
                            : { backgroundColor: 'white' }
                        }
                        disableFocusRipple
                        onClick={() => setSound(!sound)}
                      >
                        <VolumeUpIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item md={11} alignItems="center" justifyContent="center">
              <Box height={1} position="relative">
                <Box
                  display="flex"
                  justifyContent="center"
                  // sx={{backgroundColor:''}}
                  className={style.background}
                  sx={{ borderRadius: '16px' }}
                  width={1}
                  height="100%"
                  minHeight={480}
                >
                  {cameraSwitch && (
                    <>
                      <Webcam
                        ref={webcamRef}
                        muted
                        style={{ height: '100%' }}
                        screenshotFormat="image/jpeg"
                        onUserMedia={handleUserMedia}
                      />

                      <canvas
                        ref={canvasRef}
                        className={style.centerCanva}
                      />
                    </>
                  )}
                </Box>
              </Box>

            </Grid>
          </Grid>

        </Grid>
        <Grid item md={4} sm={12} xs={12} height={1}>
          <Grid
            container
            direction="row"
            height={1}
            width={1}
            rowSpacing={2}
          >
            <Grid item md={12} xs={12} sm={12} columns={6}>
              <Table rows={rows} />
            </Grid>

            <Grid item md={12} xs={12} sm={12} columns={6}>
              <Box
                width="100%"
                height="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                className={style.background}
                sx={{ borderRadius: '16px' }}
              >
                <Box mt={2}>
                  <Typography variant="body1">Line Notification</Typography>
                </Box>
                <Box height="250px" mt={2} mb={2}>
                  <img src={LineQr} alt="lineQr" height="100%" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PageUI
