import React, { useState, useCallback, useMemo } from 'react'
import {
  Box, Button, Typography, IconButton, Tooltip,
} from '@mui/material'
import _map from 'lodash/map'
import { makeStyles } from '@mui/styles'
import _isEmpty from 'lodash/isEmpty'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
import LinearProgress from '@mui/material/LinearProgress'

const useStyles = makeStyles((theme) => (
  {
    fileBx: {
      backgroundColor: '#f5f5f56b',
      maxHeight: '15rem',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#E6E6E6',
        borderRadius: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#9C9C9C',
        borderRadius: '8px',

      },
    },
    fileList: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid #93939336',
      borderRadius: '8px',
      marginBottom: '8px',
      marginRight: '6px',
      marginLeft: '1px',
      padding: '8px',
      // transition: 'box-shadow 0.2s',
      '&:hover': {
        boxShadow: '3px 3px 3px rgba(0,0,0,0.2),-1px -1px 1px rgba(0,0,0,0.05)',
      },
    },
    pdfImage: {
      minWidth: '2.5rem',
      height: '2.5rem',
      marginRight: '0.5rem',
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    },
    cropText: {
      maxWidth: '10em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.up(600)]: {
        maxWidth: '15em',

      },
      [theme.breakpoints.up(700)]: {
        maxWidth: '20em',

      },
      [theme.breakpoints.up(760)]: {
        maxWidth: '25em',

      },
      [theme.breakpoints.up(795)]: {
        maxWidth: '10em',

      },
      [theme.breakpoints.up(915)]: {
        maxWidth: '15em',

      },
      [theme.breakpoints.up(1100)]: {
        maxWidth: '20em',

      },
      [theme.breakpoints.up(1200)]: {
        maxWidth: '25em',

      },
      [theme.breakpoints.up(1500)]: {
        maxWidth: '30em',

      },
    },
  }
))
function App({ myFiles, setMyFiles }) {
  const classes = useStyles()
  const removeFile = (index) => {
    const data = [...myFiles]
    data.splice(index, 1)
    setMyFiles(data)
  }
  return (
    <Box className={classes.fileBx}>
      {_map(myFiles, (file, i) => (
        <Box key={file.id}>
          <Box className={classes.fileList}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box className={classes.pdfImage}>
                {/* <img src={} alt="pdf" /> */}
              </Box>
              <Box>

                <Tooltip title={file.name}>
                  <Typography className={classes.cropText} sx={{ cursor: 'pointer' }} onClick={() => window.open(file.fileUrl)}>
                    {file.name}
                  </Typography>
                </Tooltip>
                <Typography variant="caption" sx={{ color: '#939393' }}>
                  2000 biz
                </Typography>
              </Box>
            </Box>

            <Box>
              <IconButton onClick={() => removeFile(i)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          {/* <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={progress[i]} />
            </Box> */}
        </Box>

      ))}
    </Box>
  )
}

export default App
App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  myFiles: PropTypes.arrayOf(PropTypes.any).isRequired,
  setMyFiles: PropTypes.func.isRequired,
}
