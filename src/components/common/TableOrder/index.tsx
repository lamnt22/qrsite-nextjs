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
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, MenuItem, Pagination, Select } from '@mui/material';
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableTableRow } from "./DraggableTableRow"
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: number) => void;
  order: Order;
  orderBy: number;
  header: any;
  isEdit: boolean;
  isDelete: boolean;
  isClose: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, header, onRequestSort, isEdit, isDelete, isClose } =
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
        {
          isClose &&
          <TableCell></TableCell>
        }
      </TableRow>
    </TableHead>
  );
}

interface Props {
  page: number;
  maxPage: number;
  data: any[];
  setData?: any;
  header: any;
  setPage?: any;
  setSort?: any;
  urlEdit?: string;
  urlDetail?: string;
  onDelete?: any;
  loading?: boolean;
  dragable?: boolean;
  onDragEnd?: any;
  size?: any;
  onChangeSize?: any;
  messageDelete?: any;
  messageButton?: any;
  orderIds?: any;
  onClose?: any;
}

export default function TableOrder(
  {
    page = 0,
    maxPage = 0,
    data,
    setData,
    header,
    setPage,
    setSort,
    urlEdit = '',
    urlDetail = '',
    onDelete = undefined,
    loading,
    dragable,
    onDragEnd,
    size,
    onChangeSize,
    messageDelete,
    messageButton,
    orderIds,
    onClose
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
    setSort(`${property},${newOrder}`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
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

  const confirmClose = () => {
    onClose(selectId);
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
        per_page: page,
        total: maxPage
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
        <TableContainer>
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
                isClose={onClose}
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
                                onClose={onClose}
                                handleOpen={handleOpen}
                                onDelete={onDelete}
                                dragable={dragable}
                                orderIds={orderIds}
                              />
                            );
                          })}
                        </SortableContext>
                        : (
                          <TableRow
                            style={{
                              height: "53px",
                            }}
                          >
                            <TableCell align='center' colSpan={header.length + (urlEdit ? 1 : 0) + (onDelete ? 1 : 0) + (onClose ? 1 : 0)}  >
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
                      <TableCell colSpan={header.length - 1 + (urlEdit ? 1 : 0) + (onDelete ? 1 : 0) + (onClose ? 1 : 0)}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </DragOverlay>
          </DndContext>
        </TableContainer>
        <Grid item sx={{ padding: 4, display: 'flex' }}>
          <Pagination sx={{ marginTop: "5px" }} count={maxPage} page={page <= maxPage ? page : maxPage} onChange={handleChangePage} />
          <Grid item sx={{ width: '70px' }}>
            <FormControl fullWidth size="small">
              <Select
                value={size ? size : 10}
                onChange={(e) => onChangeSize(e.target.value)}
              >
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="50">50</MenuItem>
                {/* <MenuItem value="all">{translation("common.all")}</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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
          {onClose &&
            <Button onClick={() => confirmClose()}>{messageButton}</Button>
          }

          {onDelete &&
            <Button onClick={() => confirmDelete()}>{messageButton}</Button>
          }
        </DialogActions>
      </Dialog>
    </Box>
  );
}
