import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import _isEmpty from 'lodash/isEmpty'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { makeStyles } from '@mui/styles'

import Model from './Model'

const useStyle = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.primary.main,
  },
}))

const columns = [
  { id: 'image', label: 'Image Detection', minWidth: 50 },
  { id: 'created', label: 'Created', minWidth: 100 },
  // { id: 'status', label: 'Status', minWidth: 100 },
]

function createData(image, date, status) {
  return {
    image, date, status,
  }
}

// const rows = [
//   createData('https://image-mask-detection.s3.us-west-2.amazonaws.com/8d5dbbd910baf04816f091434cf0dfe0', '2021/04/27 13.00', 'no mask'),
//   createData('https://image-mask-detection.s3.us-west-2.amazonaws.com/5ef8bee7092706165006da108eb8d0ca', '2021/04/27 13.00', 'no mask'),
// ]

export default function StickyHeadTable(props) {
  const { rows } = props
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const classes = useStyle()

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', margin: 0 }}>
      <TableContainer sx={{ minHeight: '360px', height: '100%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: '#f5f3f4',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, i) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                  <TableCell align="left">
                    <Model item={item} />
                  </TableCell>
                  <TableCell align="left">{item.created}</TableCell>
                  {/* <TableCell align="">
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
                        boxShadow: '0 0 5px 2px #c8c7c6',
                      }}
                    >
                      {item.status}
                    </Box>
                  </TableCell> */}
                </TableRow>
              ))}
            {_isEmpty(rows) && (
              <TableCell align="center" colSpan={6}>
                <Typography>No data</Typography>
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  )
}

StickyHeadTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
}
