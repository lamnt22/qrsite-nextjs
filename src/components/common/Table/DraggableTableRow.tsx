import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Button, Grid, TableCell, TableRow } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import router from "next/router";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import moment from "moment";

interface Props {
  row: any,
  header: any[],
  urlEdit?: any,
  urlDetail?: any,
  handleOpen?: any,
  onDelete?: any,
  dragable?: boolean
}
export const DraggableTableRow = ({ row, header, urlEdit, urlDetail, handleOpen, onDelete, dragable }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: row.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <TableRow
      hover
      tabIndex={-1}
      key={row.id}
      sx={{ cursor: 'pointer' }}
      ref={setNodeRef}
      style={style}
    >
      {
        isDragging ? (
          <TableCell sx={{ background: "#bbbbbbad", height: "134px" }} colSpan={header.length + (urlEdit ? 1 : 0) + (onDelete ? 1 : 0)}>&nbsp;</TableCell>
        ) : (
          header.map((headerCell: any, i: any) => {
            if (i == 0) {
              return (
                <TableCell key={i}>
                  <Grid sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    {
                      dragable &&
                      <DragIndicatorIcon
                        sx={{
                          marginRight: "15px",
                          fontSize: "30px",
                          cursor: 'grab'
                        }}
                        {...attributes}
                        {...listeners}
                      />
                    }
                    {
                      headerCell.type == 'text' &&
                      <span style={{
                        maxWidth: '300px',
                        wordWrap: 'break-word'
                      }}
                      >
                        {row[headerCell.id] ? row[headerCell.id] : ''}
                      </span>

                    }
                    {
                      headerCell.type == 'image' &&
                      <img src={row[headerCell.id] && row[headerCell.id]} alt="" height={100} />
                    }
                  </Grid>
                </TableCell>
              )
            } else {
              return (
                <TableCell key={i}>
                  {
                    headerCell.type == 'text' &&
                    <span style={{
                      maxWidth: '300px',
                      wordWrap: 'break-word'
                    }}
                    >
                      {row[headerCell.id] ? row[headerCell.id] : ''}
                    </span>
                  }
                  {
                    headerCell.type == 'object' && 
                    <span style={{
                      maxWidth: '300px',
                      wordWrap: 'break-word'
                    }}
                    >
                      {row[headerCell.id] ? row[headerCell.id].name : ''}
                    </span>
                  }
                  {
                    headerCell.type == 'date' && 
                    <span style={{
                      maxWidth: '300px',
                      wordWrap: 'break-word'
                    }}
                    >
                      {row[headerCell.id] ? moment(row[headerCell.id]).format("DD/MM/YYYY")  : ''}
                    </span>
                  }
                  {
                    headerCell.type == 'image' &&
                    <img src={row[headerCell.id] && row[headerCell.id]} alt="" height={100} />
                  }
                </TableCell>
              )
            }
          })
        )
      }
      {
        !isDragging && urlEdit &&
        <TableCell>
      
            <Button onClick={() => router.push(urlEdit + row.id)}>
              <BorderColorIcon></BorderColorIcon>
            </Button>

        </TableCell>
      }
      {
        !isDragging && onDelete &&
        <TableCell>
            <Button onClick={() => handleOpen(row.id)}>
              <DeleteIcon></DeleteIcon>
            </Button>
        </TableCell>
      }
      {
        !isDragging && urlDetail &&
        <TableCell>

            <Button onClick={() => router.push(urlDetail + row.id)}>
              <InfoIcon></InfoIcon>
            </Button>
        </TableCell>
      }
    </TableRow>
  )
}
