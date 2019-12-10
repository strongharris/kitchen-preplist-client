import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as itemActions from '../../ducks/item';
import * as uiActions from '../../ducks/ui';
import { isToday } from 'date-fns/esm';
import { dcf } from '../../utils';
import BaseView from '../../containers/BaseView';
import ItemCrud from '../../containers/ItemCrud';
import AddItem from '../../containers/AddItem';
import Import from '../../containers/Import';
import ItemNumber from '../../components/ItemNumber';
import Loadable from "react-loading-overlay";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { startOfDay } from 'date-fns/esm';
import { styles } from './countStyles';

const Count = () => {
  const classes = styles();
  const dispatch = useDispatch();
  const [ importOpen, setImportOpen ] = useState(false);
  const [ confirmOpen, setConfirmOpen ] = useState(false);
  let allItems = useSelector(({ item }) => item.allItems); 
  let sortedItems = useSelector(({ item }) => item.sortedItems);
  const sortTab = useSelector(({ ui }) => ui.sortTab);
  const itemCrudOpen = useSelector(({ ui }) => ui.itemCrudOpen);
  const itemCrud = useSelector(({ ui }) => ui.itemCrud);
  const addItemOpen = useSelector(({ ui }) => ui.addItemOpen);      
  let selectedLocation = useSelector(({ ui }) => ui.selectedLocation); 
  let date = useSelector(({ ui }) => ui.date);
  const publishing = useSelector(({ item }) => item.publishing);
  const itemNumberOpen = useSelector(({ item }) => item.itemNumberOpen); 
  const itemNumberItem = useSelector(({ item }) => item.itemNumberItem);  
  const itemNumberType = useSelector(({ item }) => item.itemNumberType); 
  const lastPutItems = useSelector(({ item }) => item.lastPutItems); 
  const updateMessage = useSelector(({ item }) => item.updateMessage);
  const updateMessageOpen = useSelector(({ item }) => item.updateMessageOpen);

  const setItemNumber = useCallback((item, type, num) => dispatch(itemActions.setItemNumber(item, type, num, date, sortedItems)));
  const fetchItems = useCallback((locationId, date) => dispatch(itemActions.fetchItems(locationId, date)));
  const putItems = useCallback((locationId, date, sortedItems, allItems) => dispatch(itemActions.putItems(locationId, date, lastPutItems, sortedItems, allItems )));
  const dragItem = useCallback((result) => dispatch(itemActions.dragItem(result, sortedItems, allItems, sortTab, date)));
  const setItemCrud = useCallback((key, id, item) => dispatch(uiActions.setItemCrud(key, id, item, date)));
  const setAddItem = useCallback((key, id) => dispatch(uiActions.setAddItem(key, id, date)));
  const publishCount = useCallback((sortedItems, date, location) => dispatch(itemActions.publishCount(sortedItems, date, location)));
  useEffect(() => { 
    fetchItems(selectedLocation, date, sortTab); 
  },[selectedLocation, date, sortTab]);
  useEffect(() => { 
    putItems(selectedLocation, date, sortedItems, allItems); 
  },[sortedItems, allItems]);
  // useEffect(() => { 
  //   putItems(selectedLocation, date) 
  // },[sortedItems, allItems, itemCrudOpen, confirmOpen ]);
 

  const TopButtons = () => {
    const classes = styles();
  
    return (
      <Grid container justify="flex-end" spacing={1} className={classes.button}>
        <Grid item>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary" 
            disabled={sortedItems.published ? true : false}
            className={`${classes.smallFont}`}
            onClick={() => setConfirmOpen(!confirmOpen)}
          >
            Publish
          </Button>
        </Grid>
      </Grid>
    );
  }

  const sortItems = () => {
    switch(sortTab) {
      case 'stations':
        return (
          <DragDropContext onDragEnd={dragItem}>
            {sortedItems.stationsOrder.map((stationId, index) => {
              return (
                <Droppable key={stationId} droppableId={stationId} index={index}>
                  {(dropProvided, dropSnapshot) => {
                    return (
                      <Card 
                        ref={dropProvided.innerRef} 
                        className={dropSnapshot.isDraggingOver ? classes.itemListContainerDrag : classes.itemListContainer }
                      >
                        <Typography 
                          variant="caption" 
                          className={classes.stationTitle} 
                        >
                          {sortedItems.stations[stationId].label}
                        </Typography>
                        <ItemsHead />
                        {sortedItems.stations[stationId].itemIds.filter(itemId => sortedItems.items[itemId])
                          .map((itemId, index) => {
                            if (sortedItems.items[itemId].active && sortedItems.items[itemId].count) {
                              return (
                                <Draggable key={itemId} draggableId={itemId} index={index}>
                                  {(dragProvided, dragSnapshot) => { 
                                    return (
                                      <Paper 
                                        ref={dragProvided.innerRef} 
                                        {...dragProvided.draggableProps} 
                                        {...dragProvided.dragHandleProps} 
                                        className={dragSnapshot.isDragging ? classes.itemContainerDrag : classes.itemContainer} 
                                        
                                       > 
                                       
                                        <Grid container className={classes.itemHead} spacing={3}>
                                          <Grid 
                                            item 
                                            xs={3} 
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published && isToday(date) ? setItemCrud('stations', stationId, sortedItems.items[itemId]) : null}
                                          >
                                            <Typography className={classes.smallFont}>{sortedItems.items[itemId].label}</Typography>
                                          </Grid>
                                          <Grid 
                                            item 
                                            xs 
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published && isToday(date) ? setItemCrud('stations', stationId, sortedItems.items[itemId]) : null}
                                          >
                                            <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].onHandBeg)}</Typography>
                                          </Grid>  
                                          <Grid item xs style={{padding: '0.5rem 0'}}>
                                          <div
                                            className={classes.smallFont} 
                                            onClick={e => {
                                              setItemNumber(sortedItems.items[itemId], 'onHandEnd', sortedItems.items[itemId].onHandEnd)
                                            }}
                                          >
                                              {dcf(sortedItems.items[itemId].onHandEnd)}
                                              <span style={{marginLeft: 4}}>&#9999;</span>
                                              {/* {!sortedItems.published ? 
                                                <Fragment>
                                                  <span onClick={e => {e.stopPropagation(); editNumber('increment', sortedItems.items[itemId], 'onHandEnd'); }} className={classes.plusSign}>+</span>
                                                  {sortedItems.items[itemId].onHandEnd > 0 
                                                    ? <span onClick={e => {e.stopPropagation(); editNumber('decrement', sortedItems.items[itemId], 'onHandEnd'); }} className={classes.minusSign}>&mdash;</span>
                                                    : <span></span>
                                                  }
                                                </Fragment> :
                                                <span></span>
                                              } */}
                                            </div>
                                          </Grid>
                                          <Grid 
                                            item 
                                            xs 
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published && isToday(date) ? setItemCrud('stations', stationId, sortedItems.items[itemId]) : null}
                                          >
                                            <Typography className={classes.smallFont}>
                                              {sortedItems.items[itemId].onHandBeg + sortedItems.items[itemId].made - sortedItems.items[itemId].onHandEnd < 0 ? 0 
                                                : dcf(sortedItems.items[itemId].onHandBeg + sortedItems.items[itemId].made - sortedItems.items[itemId].onHandEnd)}
                                            </Typography>
                                          </Grid> 
                                          <Grid 
                                            item 
                                            xs 
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published && isToday(date) ? setItemCrud('stations', stationId, sortedItems.items[itemId]) : null}
                                          >
                                            {sortedItems.items[itemId].parApplyDaily ? 
                                              <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].parDefault)}</Typography> :
                                              <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].parDaily[startOfDay(date).toString().substring(0,3)])}</Typography> 
                                            }
                                          </Grid>                                                               
                                        </Grid>                            
                                      </Paper>
                                    );
                                  }}
                                </Draggable>
                              ); 
                            } else {
                              return (
                                <Draggable key={itemId} draggableId={itemId} index={index}>
                                  {(dragProvided, dragSnapshot) => { 
                                    return (
                                    <div
                                      ref={dragProvided.innerRef} 
                                      {...dragProvided.draggableProps} 
                                      {...dragProvided.dragHandleProps} 
                                    >
                                    </div>
                                    );
                                  }}
                                </Draggable>
                              )                                 
                            }

                        })}
                        {dropProvided.placeholder}
                        {/* {!sortedItems.published ? 
                        <Paper className={classes.addItemContainer} onClick={() => setAddItem('stations', stationId)}>
                          <Grid container className={classes.itemHead} spacing={3}>
                            <Grid item style={{padding: '0.5rem 0'}}>
                              <Typography className={`${classes.smallFont} ${classes.addItem}`}>
                                + Add New Item
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>   
                        : <div></div>                        
                        }                   */}
                      </Card>                  
                    );
                  }}
                </Droppable>
              );
            })}  
          </DragDropContext> 
        );
      case 'timeFrames':
        return (
          <DragDropContext onDragEnd={dragItem}>
            {sortedItems.timeFramesOrder.map((timeFrameId, index) => {
              return (
                <Droppable key={timeFrameId} droppableId={timeFrameId} index={index}>
                  {(dropProvided, dropSnapshot) => {
                    return (
                      <Card 
                        ref={dropProvided.innerRef} 
                        className={dropSnapshot.isDraggingOver ? classes.itemListContainerDrag : classes.itemListContainer }
                      >
                        <Typography variant="caption" className={classes.stationTitle}>
                          {sortedItems.timeFrames[timeFrameId].label}
                        </Typography>
                        <ItemsHead />
                        {sortedItems.timeFrames[timeFrameId].itemIds.filter(itemId => sortedItems.items[itemId])
                          .map((itemId, index) => {
                            if (sortedItems.items[itemId].active && sortedItems.items[itemId].count) {
                              return (
                                <Draggable key={itemId} draggableId={itemId} index={index}>
                                  {(dragProvided, dragSnapshot) => { 
                                    return (
                                      <Paper 
                                        ref={dragProvided.innerRef} 
                                        {...dragProvided.draggableProps} 
                                        {...dragProvided.dragHandleProps} 
                                        className={dragSnapshot.isDragging ? classes.itemContainerDrag : classes.itemContainer} 
                                        
                                      >
                                        <Grid container className={classes.itemHead} spacing={3}>
                                          <Grid 
                                            item 
                                            xs={3} 
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published ? setItemCrud('timeFrames', timeFrameId, sortedItems.items[itemId]) : null}
                                          >
                                              <Typography className={classes.smallFont}>{sortedItems.items[itemId].label}</Typography>
                                          </Grid>
                                          <Grid 
                                            item 
                                            xs
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published ? setItemCrud('timeFrames', timeFrameId, sortedItems.items[itemId]) : null}
                                          >
                                            <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].onHandBeg)}</Typography>
                                          </Grid>  
                                          <Grid item xs style={{padding: '0.5rem 0'}}>
                                          <div
                                            className={classes.smallFont} 
                                            onClick={e => {
                                              setItemNumber(sortedItems.items[itemId], 'onHandEnd', sortedItems.items[itemId].onHandEnd)
                                            }}
                                          >
                                              {dcf(sortedItems.items[itemId].onHandEnd)}
                                              <span style={{marginLeft: 4}}>&#9999;</span>
                                              {/* {!sortedItems.published ? 
                                                  <Fragment>
                                                    <span onClick={e => {e.stopPropagation(); editNumber('increment', sortedItems.items[itemId], 'onHandEnd'); }} className={classes.plusSign}>+</span>
                                                    {sortedItems.items[itemId].onHandEnd > 0 
                                                      ? <span onClick={e => {e.stopPropagation(); editNumber('decrement', sortedItems.items[itemId], 'onHandEnd'); }} className={classes.minusSign}>&mdash;</span>
                                                      : <span></span>
                                                    }
                                                  </Fragment> :
                                                  <span></span>
                                                } */}
                                            </div>
                                          </Grid>
                                          <Grid 
                                            item 
                                            xs
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published ? setItemCrud('timeFrames', timeFrameId, sortedItems.items[itemId]) : null}
                                          >
                                            <Typography className={classes.smallFont}>
                                                {sortedItems.items[itemId].onHandBeg + sortedItems.items[itemId].made - sortedItems.items[itemId].onHandEnd < 0 ? 0 
                                                  : dcf(sortedItems.items[itemId].onHandBeg + sortedItems.items[itemId].made - sortedItems.items[itemId].onHandEnd)}
                                            </Typography>
                                          </Grid> 
                                          <Grid 
                                            item 
                                            xs
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published ? setItemCrud('timeFrames', timeFrameId, sortedItems.items[itemId]) : null}
                                          >           
                                            {sortedItems.items[itemId].parApplyDaily ? 
                                                <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].parDefault)}</Typography> :
                                                <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].parDaily[startOfDay(date).toString().substring(0,3)])}</Typography> 
                                              }
                    
                                          </Grid>                                                                
                                        </Grid>                            
                                      </Paper>
                                    );
                                  }}
                                </Draggable>
                              );
                            } else {
                              return (
                                <Draggable key={itemId} draggableId={itemId} index={index}>
                                  {(dragProvided, dragSnapshot) => { 
                                    return (
                                    <div
                                      ref={dragProvided.innerRef} 
                                      {...dragProvided.draggableProps} 
                                      {...dragProvided.dragHandleProps} 
                                    >
                                    </div>
                                    );
                                  }}
                                </Draggable>
                              )                               
                            }
                        })}
                        {dropProvided.placeholder}
                        {/* {!sortedItems.published ? 
                        <Paper className={classes.addItemContainer} onClick={() => setAddItem('timeFrames', timeFrameId)}>
                          <Grid container className={classes.itemHead} spacing={3}>
                            <Grid item style={{padding: '0.5rem 0'}}>
                              <Typography className={`${classes.smallFont} ${classes.addItem}`}>
                                + Add New Item
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>   
                        : <div></div>                        
                        }                         */}
                      </Card>                  
                    );
                  }}
                </Droppable>
              );
            })}  
          </DragDropContext> 
        );
      case 'all': 
        return (
          <DragDropContext onDragEnd={dragItem}>
            {sortedItems.allOrder.map((allId, index) => {
              return (
                <Droppable key={allId} droppableId={allId} index={index}>
                  {(dropProvided, dropSnapshot) => {
                    return (
                      <Card 
                        ref={dropProvided.innerRef} 
                        className={dropSnapshot.isDraggingOver ? classes.itemListContainerDrag : classes.itemListContainer }
                      >
                        <Typography variant="caption" className={classes.stationTitle}>
                          {sortedItems.all[allId].label}
                        </Typography>
                        <ItemsHead />
                        {sortedItems.all[allId].itemIds.filter(itemId => sortedItems.items[itemId])
                          .map((itemId, index) => {
                            if (sortedItems.items[itemId].count) {
                              return (
                                <Draggable key={itemId} draggableId={itemId} index={index}>
                                  {(dragProvided, dragSnapshot) => { 
                                    return (
                                      <Paper 
                                        ref={dragProvided.innerRef} 
                                        {...dragProvided.draggableProps} 
                                        {...dragProvided.dragHandleProps} 
                                        className={dragSnapshot.isDragging ? classes.itemContainerDrag : classes.itemContainer} 
                                        
                                      >
                                        <Grid container className={classes.itemHead} spacing={3}>
                                          <Grid 
                                            item 
                                            xs={3} 
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published ? setItemCrud('all', allId, sortedItems.items[itemId]) : null}
                                          >
                                            <Typography className={classes.smallFont}>{sortedItems.items[itemId].label}</Typography>
                                          </Grid>
                                          <Grid 
                                            item 
                                            xs
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published ? setItemCrud('all', allId, sortedItems.items[itemId]) : null}
                                          >
                                            <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].onHandBeg)}</Typography>
                                          </Grid>  
                                          <Grid item xs style={{padding: '0.5rem 0'}}>
                                          <div
                                            className={classes.smallFont} 
                                            onClick={e => {
                                              setItemNumber(sortedItems.items[itemId], 'onHandEnd', sortedItems.items[itemId].onHandEnd);
                                            }}
                                          >
                                            {dcf(sortedItems.items[itemId].onHandEnd)}
                                            <span style={{marginLeft: 4}}>&#9999;</span>
                                              {/* {!sortedItems.published ? 
                                                <Fragment>
                                                  <span onClick={e => {e.stopPropagation(); editNumber('increment', sortedItems.items[itemId], 'onHandEnd'); }} className={classes.plusSign}>+</span>
                                                  {sortedItems.items[itemId].onHandEnd > 0 
                                                    ? <span onClick={e => {e.stopPropagation(); editNumber('decrement', sortedItems.items[itemId], 'onHandEnd'); }} className={classes.minusSign}>&mdash;</span>
                                                    : <span></span>
                                                  }
                                                </Fragment> :
                                                <span></span>
                                              } */}

                                            </div>
                                          </Grid>
                                          <Grid 
                                            item 
                                            xs 
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published ? setItemCrud('all', allId, sortedItems.items[itemId]) : null}
                                          >
                                          <Typography className={classes.smallFont}>
                                              {sortedItems.items[itemId].onHandBeg + sortedItems.items[itemId].made - sortedItems.items[itemId].onHandEnd < 0 ? 0 
                                                : dcf(sortedItems.items[itemId].onHandBeg + sortedItems.items[itemId].made - sortedItems.items[itemId].onHandEnd)}
                                            </Typography>
                                          </Grid> 
                                          <Grid 
                                            item 
                                            xs
                                            style={{padding: '0.5rem 0'}}
                                            onClick={() => !sortedItems.published ? setItemCrud('all', allId, sortedItems.items[itemId]) : null}
                                          >
                                           
                                            {sortedItems.items[itemId].parApplyDaily ? 
                                              <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].parDefault)}</Typography> :
                                              <Typography className={classes.smallFont}>{dcf(sortedItems.items[itemId].parDaily[startOfDay(date).toString().substring(0,3)])}</Typography> 
                                            }
                                        
                                          </Grid>
                                                                                                           
                                        </Grid>                            
                                      </Paper>
                                    );
                                  }}
                                </Draggable>
                              );
                            } else {
                              return (
                                <Draggable key={itemId} draggableId={itemId} index={index}>
                                  {(dragProvided, dragSnapshot) => { 
                                    return (
                                    <div
                                      ref={dragProvided.innerRef} 
                                      {...dragProvided.draggableProps} 
                                      {...dragProvided.dragHandleProps} 
                                    >
                                    </div>
                                    );
                                  }}
                                </Draggable>
                              )                                
                            }
                        })}
                        {dropProvided.placeholder}
                        {/* {!sortedItems.published ? 
                        <Paper className={classes.addItemContainer} onClick={() => setAddItem('all', allId)}>
                          <Grid container className={classes.itemHead} spacing={3}>
                            <Grid item style={{padding: '0.5rem 0'}}>
                              <Typography className={`${classes.smallFont} ${classes.addItem}`}>
                                + Add New Item
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>   
                        : <div></div>                        
                        }    */}
                      </Card>                  
                    );
                  }}
                </Droppable>
              );
            })}  
          </DragDropContext>           
        );
    }
  }

  return (
    <Loadable
      active={publishing}
      spinner
      animate={true}
      text="Publishing..."
    >
      <BaseView>
        <Container className={classes.root}>
        { allItems && sortedItems ? <TopButtons /> : <div></div> }  
        { allItems && sortedItems ? sortItems() : <div>loading...</div> }  
        </Container>
        { importOpen ? <Import setImportOpen={setImportOpen} importOpen={importOpen}/> : <div></div> }
        { itemCrudOpen ? <ItemCrud setItemCrud={setItemCrud} itemCrudOpen={itemCrudOpen} item={itemCrud}/> : <div></div> }
        { addItemOpen ? <AddItem addItemOpen={addItemOpen} setAddItem={setAddItem} /> : <div></div> }
        { itemNumberOpen ? <ItemNumber open={itemNumberOpen} item={itemNumberItem} setItemNumber={setItemNumber} type={itemNumberType}/> : <div></div>}      
        { confirmOpen
            ? <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(!confirmOpen)}
              >
                <DialogTitle id="alert-dialog-title">Continue Publish Count Page?</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Once you click publish, you will not be able to edit any items on today's date
                    </DialogContentText>
                  </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setConfirmOpen(!confirmOpen)} color="primary">
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => {
                          setConfirmOpen(!confirmOpen);
                          publishCount(sortedItems, date, selectedLocation)
                        }} 
                        color="primary" 
                        autoFocus
                      >
                        Publish
                      </Button>
                    </DialogActions>
              </Dialog>
            : <div></div>
        }  
        <Dialog 
          open={updateMessageOpen} 
          onClose={() => document.location.reload(true)}
        >
          <DialogTitle>
            What You've Missed
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {updateMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => document.location.reload(true) } color="primary">
              Refresh
            </Button>
          </DialogActions>
        </Dialog>
      </BaseView>
    </Loadable>
  );

};

export default Count;


const ItemsHead = () => {
  const classes = styles();

  return (
    <Paper className={classes.itemHeadContainer}>
      <Grid container className={classes.itemHead} spacing={3}>
        {rowHead.map(name => {
          if (name === 'Name') {
            return (
              <Grid item xs={3} key={name} style={{padding: '0.5rem 0'}}>
                <Typography className={classes.smallFont}>{name}</Typography>
              </Grid>
            );
          } else {
            return (
              <Grid item xs key={name} style={{padding: '0.5rem 0'}}>
                <Typography className={classes.smallFont}>{name}</Typography>
              </Grid>
            );
          }
        })}
      </Grid>
    </Paper>
  );
}

const rowHead = ['Name', 'Beg OH', 'End OH', 'Used', 'Par'];
