import React from "react";
import { Button, Grid, IconButton, ImageListItem, ImageListItemBar, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { translation } from "src/utils/i18n.util";
import { useRouter } from "next/router";
import { RequestQuote } from "@mui/icons-material";


interface Props {
  row: any,
  data: any,
  urlEdit?: any,
  urlDetail?: any,
  handleOpen?: any,
  onDelete?: any,
  onChangeStatus?: any,
  dragable?: boolean
}
export const DraggableTableGrid = ({ data, urlDetail, urlEdit, handleOpen, onChangeStatus }: Props) => {

  const router = useRouter();
  
  return (
    <Grid container xs={12} spacing={2}>
      {
        data.length > 0 ?
          data.map((dt: any, i: any) => {
            return (
              <Grid item xs={4} key={i}>

                <Paper style={{ backgroundColor: 'white' }}>
                  <ImageListItem key={dt.image}>
                    <img src="https://www.shutterstock.com/image-vector/dining-table-semi-flat-color-600nw-2156604615.jpg" alt="" loading="lazy" />

                    <ImageListItemBar
                      title={dt.name}
                      subtitle={"Seat: "+dt.seatNumber}
                      actionIcon={
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)', paddingRight: 5 }}
                            aria-label={`info about ${dt.name}`} onClick={() => router.push(urlEdit + dt.id)}
                          >
                            <BorderColorIcon></BorderColorIcon>
                          </IconButton> 
                      }

                    />
                  </ImageListItem>
                  <Grid display='flex' justifyContent='space-between'>
                    {
                      dt.status === 'Available' ?
                      <Button onClick={() => onChangeStatus(dt.id, "0")}>{translation("table.avaliable")}</Button> :
                      <Button onClick={() => onChangeStatus(dt.id, "1")}>{translation("table.not_avaliable")}</Button>
                    }
                    
                    {
                      dt.status === 'Available' ?
                      <Button onClick={() => handleOpen(dt.id)}>
                        <DeleteIcon></DeleteIcon>
                      </Button> :
                      <Button onClick={() => router.push(urlDetail + dt.id)}>
                        <RequestQuote></RequestQuote>
                      </Button>
                    }
                  </Grid>
                </Paper>

              </Grid>
            )
          }) :
          <Grid item xs={12}>{translation("common.no_data")}</Grid >
      }
      {/* {
        !isDragging && urlEdit &&
        <TableCell>
          {
            role && (role === ROLE.ADMIN || role === ROLE.EDITOR) &&
            <Button onClick={() => router.push(urlEdit + row.id)}>
              <BorderColorIcon></BorderColorIcon>
            </Button>
          }
        </TableCell>
      }
      {
        !isDragging && onDelete &&
        <TableCell>
          {
            role && (role === ROLE.ADMIN || role === ROLE.EDITOR) &&
            <Button onClick={() => handleOpen(row.id)}>
              <DeleteIcon></DeleteIcon>
            </Button>
          }
        </TableCell>
      }
      {
        !isDragging && urlDetail &&
        <TableCell>
          {
            role && (role === ROLE.ADMIN || role === ROLE.EDITOR) &&
            <Button onClick={() => router.push(urlDetail + row.id)}>
              <InfoIcon></InfoIcon>
            </Button>
          }
        </TableCell>
      } */}
    </Grid>
  )
}
