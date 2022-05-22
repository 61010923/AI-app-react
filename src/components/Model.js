import * as React from 'react'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import Avatar from '@mui/material/Avatar'
import SearchIcon from '@mui/icons-material/Search'

function Model({ item, created }) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '56px',
          height: '56px',
        }}
        onClick={handleOpen}
      >
        <Avatar
          alt="image detection"
          src={item.image}
          sx={{
            width: 56,
            height: 56,
            cursor: 'pointer',
          }}
        />
        <Box sx={{ position: 'absolute', bottom: '-7px', right: '-7px' }}>
          <IconButton aria-label="search" size="" sx={{ color: 'f5f3f4' }}>
            <SearchIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose} key={item.id}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '700px',
            minWidth: '300px',
            // maxHeight: '400px',
            bgcolor: 'transparent',
            // boxShadow: 24,
            p: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#fff',
              mb: 1,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {created}
              </Typography>
              <Box
                sx={{
                  backgroundColor:
                    (item.status === 'wear mask' && 'green')
                    || (item.status === 'no mask' && 'orange'),
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  display: 'inline-block',
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              >
                {item.status}
              </Box>
            </Box>
            <IconButton aria-label="close" onClick={handleClose} size="small">
              <CloseIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Box>
          <Box>
            <img
              src={item.image}
              alt="imageDetection"
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Box>
      </Modal>
    </>
  )
}
Model.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  created: PropTypes.string.isRequired,
}
export default Model
