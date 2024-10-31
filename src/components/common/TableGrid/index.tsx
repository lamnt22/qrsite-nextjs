import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, MenuItem, Pagination, Select, Table, TableBody, TableCell } from '@mui/material';
import React from 'react';
import TableRow from '@mui/material/TableRow';
import { DraggableTableGrid } from './DraggableTableGrid';
import { translation } from 'src/utils/i18n.util';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface Props {
    page: number;
    maxPage: number;
    data: any[];
    setData?: any;
    header: any;
    setPage?: any;
    urlEdit?: string;
    urlDetail?: string;
    onDelete?: any;
    onChangeStatus?: any;
    loading?: boolean;
    dragable?: boolean;
    onDragEnd?: any;
    size?: any;
    onChangeSize?: any;
    messageDelete?: any;
    messageChange?: any;
}
export default function GridExample({
    page = 0,
    maxPage = 0,
    data,
    setData,
    header,
    setPage,
    urlEdit = '',
    urlDetail = '',
    onDelete = undefined,
    onChangeStatus = undefined,
    loading,
    dragable,
    onDragEnd,
    size,
    onChangeSize,
    messageDelete,
    messageChange
}: Props

) {
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openChangeStatusDialog, setOpenChangeStatusDialog] = React.useState(false);
    const [selectId, setSelectId] = React.useState(null);
    const [activeId, setActiveId] = React.useState(null);
    const items = React.useMemo(() => data.map(({ id }) => id), [data]);
    const [selectStatus, setSelectStatus] = React.useState(null);


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

    const handleChangeStatus = (id: any, status: any) => {
        setSelectId(id);
        setSelectStatus(status);
        setOpenChangeStatusDialog(true);
    }

    const handleCloseChange = () => {
        setOpenChangeStatusDialog(false);
    };

    const confirmChangeStatus = () => {
        onChangeStatus(selectId, selectStatus);
        setOpenChangeStatusDialog(false);
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
        <Grid container spacing={2}>
            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
            >
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
                        </TableRow> :
                        (
                            data.length > 0 ? 
                            <DraggableTableGrid
                            data={data}
                            urlDetail={urlDetail}
                            urlEdit={urlEdit}
                            handleOpen={handleOpen}
                            row={undefined}
                            dragable={dragable}
                            onChangeStatus={handleChangeStatus}/> 
                            :
                             <Table sx={{background: 'white'}}>
                            <TableRow
                            style={{
                              height: "53px",
                            }}
                          >                           
                            <TableCell align='center' colSpan={header.length + (urlEdit ? 1 : 0) + (onDelete ? 1 : 0)}  >
                              No data
                            </TableCell>
                          </TableRow>
                          </Table>
                        )
                        
                }
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
            {
                data.length > 0 &&
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
            }
            
            <Dialog
                open={openDeleteDialog}
                onClose={() => handleClose()}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {translation("common.confirm")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {messageDelete}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => handleClose()}>
                        {translation("common.cancel")}
                    </Button>
                    <Button onClick={() => confirmDelete()}>{translation("common.delete")}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openChangeStatusDialog}
                onClose={() => handleCloseChange()}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {translation("common.confirm")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {messageChange}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => handleCloseChange()}>
                        {translation("common.cancel")}
                    </Button>
                    <Button onClick={() => confirmChangeStatus()}>{translation("common.save")}</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

