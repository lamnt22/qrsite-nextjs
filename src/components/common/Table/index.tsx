import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DraggableTableRow } from './DraggableTableRow';

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: number) => void;
  order: Order;
  orderBy: number;
  header: any;
  isEdit: boolean;
  isDelete: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, header, onRequestSort, isEdit, isDelete } =
    props;
  const createSortHandler =
    (property: number) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {header.map((headCell: any) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {
          isEdit &&
          <TableCell></TableCell>
        }
        {
          isDelete &&
          <TableCell></TableCell>
        }
      </TableRow>
    </TableHead>
  );
}

interface Props {

  data: any[];
  setData?: any;
  header: any;

  urlEdit?: string;
  urlDetail?: string;
  onDelete?: any;
  loading?: boolean;
  dragable?: boolean;
  onDragEnd?: any;
  messageDelete?: any;
  messageButton?: any;
}

export default function TableList(
  {

    data,
    setData,
    header,
    urlEdit = '',
    urlDetail = '',
    onDelete = undefined,
    loading,
    dragable,
    onDragEnd,
    messageDelete,
    messageButton
  }: Props

) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<number>(1);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectId, setSelectId] = React.useState(null);
  const [activeId, setActiveId] = React.useState(null);
  const items = React.useMemo(() => data.map(({ id }) => id), [data]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: number,
  ) => {

    let newOrder: Order = 'asc';
    if (orderBy === property) {
      newOrder = order === 'asc' ? 'desc' : 'asc';
    }

    setOrder(newOrder);
    setOrderBy(property);
  };

  const handleOpen = (id: any) => {
    setSelectId(id)
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const confirmDelete = () => {
    onDelete(selectId);
    setOpenDeleteDialog(false);
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      data = arrayMove(data, oldIndex, newIndex);
      setData({
        data: data,
      });
      onDragEnd(data)
    }

    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, paddingTop: 2 }}>
        <TableContainer sx={{ maxHeight: 400}}>
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
          >
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                header={header}
                isEdit={urlEdit ? true : false}
                isDelete={onDelete}
              />
              <TableBody>
                {
                  loading ?
                    <TableRow
                      style={{
                        height: 53,
                      }}
                    >
                      <TableCell align='center' colSpan={header.length + (urlEdit ? 1 : 0) + (onDelete ? 1 : 0)} >
                        <CircularProgress></CircularProgress>
                      </TableCell>
                    </TableRow>
                    : (
                      data.length > 0 ?
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                          {data.map((row: any) => {
                            return (
                              <DraggableTableRow
                                key={row.id}
                                row={row}
                                header={header}
                                urlEdit={urlEdit}
                                urlDetail={urlDetail}
                                handleOpen={handleOpen}
                                onDelete={onDelete}
                                dragable={dragable} />
                            );
                          })}
                        </SortableContext>
                        : (
                          <TableRow
                            style={{
                              height: "53px",
                            }}
                          >
                            <TableCell align='center' colSpan={header.length + (urlEdit ? 1 : 0) + (onDelete ? 1 : 0)} >
                              No data
                            </TableCell>
                          </TableRow>
                        )
                    )
                }
              </TableBody>
            </Table>
            <DragOverlay>
              {activeId && (
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                >
                  <TableBody>
                    <TableRow
                      hover
                      tabIndex={-1}
                      sx={{ cursor: 'pointer', height: "134px" }}
                    >
                      <TableCell>
                        <DragIndicatorIcon sx={{ marginBottom: "-9px", marginRight: "5px", fontSize: "30px", cursor: 'grabbing' }} />
                      </TableCell>
                      <TableCell colSpan={header.length - 1 + (urlEdit ? 1 : 0) + (onDelete ? 1 : 0)}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </DragOverlay>
          </DndContext>
        </TableContainer>
      </Paper>
      <Dialog
        open={openDeleteDialog}
        onClose={() => handleClose()}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Confirm
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {messageDelete}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button onClick={() => confirmDelete()}>{messageButton}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
