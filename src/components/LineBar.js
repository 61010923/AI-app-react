import React from 'react'
import {
  Box, Paper, Button, Avatar, Typography, Modal, IconButton,
} from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import LinkIcon from '@mui/icons-material/Link'
import CloseIcon from '@mui/icons-material/Close'
import LineQr from '../image/lineQr.jpg'

function LineBar() {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <Paper sx={{
      width: '100%', overflow: 'hidden',
    }}
    >

      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, padding: '8px',
      }}
      >
        <Box>
          <Avatar alt="Remy Sharp" src="https://store.kidbright.info/upload/cover-image/1544265083-nDP3ez.png" sx={{ width: '70px', height: '70px' }} />
        </Box>
        <Typography sx={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#06c755' }}>
          Line Notify
        </Typography>
        <Button variant="contained" color="success" startIcon={<LinkIcon />} href="https://line.me/ti/g/KvoZHBTqJS" target="_blank">
          ลิงก์เข้ากลุ่มไลน์
        </Button>
        <Button variant="outlined" color="success" startIcon={<QrCode2Icon />} onClick={handleOpen}>
          Scan QR code
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        key="modalQrcode"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'transparent',
          p: 1,
        }}
        >
          <Box sx={{
            display: 'flex', justifyContent: 'flex-end', color: '#fff', mb: 1,
          }}
          >
            <IconButton aria-label="close" onClick={handleClose} size="small">
              <CloseIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Box>
          <Box>
            <img
              src={LineQr}
              alt="LineQrCOde"
              sx={{
                width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'cover', borderRadius: '8px',
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Paper>

  )
}

export default LineBar
