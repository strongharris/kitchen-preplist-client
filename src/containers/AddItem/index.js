import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startOfDay } from 'date-fns/esm';
import * as uiActions from '../../ducks/ui';
import * as itemActions from '../../ducks/item';
import { dcf } from '../../utils';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';

import { styles } from './addItemStyles';

const AddItem = ({ addItemOpen, setAddItem }) => {
  const classes = styles();
  const [ selectedItems, setSelectedItems ] = useState([]);
  const dispatch = useDispatch();
  let allItems = useSelector(({ item }) => item.allItems);
  let sortedItems = useSelector(({ item }) => item.sortedItems);
  const addItemKey = useSelector(({ ui }) => ui.addItemKey);
  const addItemKeyId = useSelector(({ ui }) => ui.addItemKeyId);
  const sortTab = useSelector(({ ui }) => ui.sortTab);
  const createNewItem = useCallback((addItemKey, addItemKeyId) => dispatch(uiActions.createNewItem(addItemKey, addItemKeyId)));  
  const addExistingItem = useCallback((selectedItems, sortedItem, key, keyId) => dispatch(itemActions.addExistingItem(selectedItems, sortedItem, key, keyId, allItems)));
  let date = useSelector(({ ui }) => ui.date);

  const ItemsHead = () => {
    return (
      <Paper className={classes.itemHeadContainer}>
        <Grid container className={classes.itemHead} spacing={3}>
          {rowHead.map(name => {
            if (name === 'Name') {
              return (
                <Grid item xs={6} key={name} style={{padding: '0.5rem 0'}}>
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

  const RenderItems = () => {
    if (sortTab === 'stations') {
      return (
        allItems.sort((a, b) => {
          let first = sortedItems.items[a._id].parApplyDaily 
            ? (sortedItems.items[a._id].parDefault - sortedItems.items[a._id].onHandBeg < 0 ? 0 : sortedItems.items[a._id].parDefault - sortedItems.items[a._id].onHandBeg)
            : (Number(sortedItems.items[a._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[a._id].onHandBeg < 0 ? 0 : Number(sortedItems.items[a._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[a._id].onHandBeg);     
          let second = sortedItems.items[b._id].parApplyDaily 
            ? (sortedItems.items[b._id].parDefault - sortedItems.items[b._id].onHandBeg < 0 ? 0 : sortedItems.items[b._id].parDefault - sortedItems.items[b._id].onHandBeg)
            : (Number(sortedItems.items[b._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[b._id].onHandBeg < 0 ? 0 : Number(sortedItems.items[b._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[b._id].onHandBeg);   
            return second - first;
        })
        .map(item => {
          const index = selectedItems.findIndex(selectedItem => selectedItem._id === item._id)
          if (item.active && !item.prepList && (sortedItems.items[item._id].stationId === addItemKeyId)) {
            return (
              <Paper 
                key={item._id} 
                className={index > -1 ? classes.itemContainerSelected : classes.itemContainer} 
                onClick={() => {
                  if (index > -1) {
                    setSelectedItems(selectedItems.filter(prevItem => {
                      return prevItem._id !== item._id;
                    }))
                  } else {
                    setSelectedItems([...selectedItems, item]);
                  }
                }}
              > 
                <Grid container className={classes.itemHead} spacing={3}>
                  <Grid item xs={6} style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>{item.label}</Typography>
                  </Grid>
                  <Grid item xs style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>{item.parApplyDaily ? dcf(item.parDefault) : "Varies"}</Typography>
                  </Grid> 
                  <Grid item xs style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>
                    {sortedItems.items[item._id].parApplyDaily 
                      ? (sortedItems.items[item._id].parDefault - sortedItems.items[item._id].onHandBeg < 0 ? 0 : dcf(sortedItems.items[item._id].parDefault - sortedItems.items[item._id].onHandBeg))
                      : (Number(sortedItems.items[item._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[item._id].onHandBeg < 0 ? 0 : dcf(Number(sortedItems.items[item._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[item._id].onHandBeg))     
                    }
                    </Typography>
                  </Grid>                                                               
                </Grid>     
              </Paper>             
            );
          }
        })
        // allItems.map(item => {
        //   const index = selectedItems.findIndex(selectedItem => selectedItem._id === item._id)
        //   if (item.active && !item.prepList && (sortedItems.items[item._id].stationId === addItemKeyId)) {
        //     return item;
        //   }
        // }).sort((a, b) => {
        //   return 
        // })
      );
    }

    if (sortTab === 'timeFrames') {
      return (
        allItems.sort((a, b) => {
          let first = sortedItems.items[a._id].parApplyDaily 
            ? (sortedItems.items[a._id].parDefault - sortedItems.items[a._id].onHandBeg < 0 ? 0 : sortedItems.items[a._id].parDefault - sortedItems.items[a._id].onHandBeg)
            : (Number(sortedItems.items[a._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[a._id].onHandBeg < 0 ? 0 : Number(sortedItems.items[a._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[a._id].onHandBeg);     
          let second = sortedItems.items[b._id].parApplyDaily 
            ? (sortedItems.items[b._id].parDefault - sortedItems.items[b._id].onHandBeg < 0 ? 0 : sortedItems.items[b._id].parDefault - sortedItems.items[b._id].onHandBeg)
            : (Number(sortedItems.items[b._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[b._id].onHandBeg < 0 ? 0 : Number(sortedItems.items[b._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[b._id].onHandBeg);   
            return second - first;
        })
        .map(item => {
          const index = selectedItems.findIndex(selectedItem => selectedItem._id === item._id);
          if (item.active && !item.prepList && (sortedItems.items[item._id].timeFrameId === addItemKeyId)) {
            return (
              <Paper 
                key={item._id} 
                className={index > -1 ? classes.itemContainerSelected : classes.itemContainer} 
                onClick={() => {
                  if (index > -1) {
                    setSelectedItems(selectedItems.filter(prevItem => {
                      return prevItem._id !== item._id;
                    }))
                  } else {
                    setSelectedItems([...selectedItems, item]);
                  }
                }}
              > 
                <Grid container className={classes.itemHead} spacing={3}>
                  <Grid item xs={6} style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>{item.label}</Typography>
                  </Grid>
                  <Grid item xs style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>{item.parApplyDaily ? item.parDefault : "Varies"}</Typography>
                  </Grid> 
                  <Grid item xs style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>
                    {sortedItems.items[item._id].parApplyDaily 
                      ? (sortedItems.items[item._id].parDefault - sortedItems.items[item._id].onHandBeg < 0 ? 0 : dcf(sortedItems.items[item._id].parDefault - sortedItems.items[item._id].onHandBeg))
                      : (Number(sortedItems.items[item._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[item._id].onHandBeg < 0 ? 0 : dcf(Number(sortedItems.items[item._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[item._id].onHandBeg))     
                    }
                    </Typography>
                  </Grid>                                                               
                </Grid>     
              </Paper>             
            );
          }
        })
      );
    }

    if (sortTab === 'all') {
      return (
        allItems.sort((a, b) => {
          let first = sortedItems.items[a._id].parApplyDaily 
            ? (sortedItems.items[a._id].parDefault - sortedItems.items[a._id].onHandBeg < 0 ? 0 : sortedItems.items[a._id].parDefault - sortedItems.items[a._id].onHandBeg)
            : (Number(sortedItems.items[a._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[a._id].onHandBeg < 0 ? 0 : Number(sortedItems.items[a._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[a._id].onHandBeg);     
          let second = sortedItems.items[b._id].parApplyDaily 
            ? (sortedItems.items[b._id].parDefault - sortedItems.items[b._id].onHandBeg < 0 ? 0 : sortedItems.items[b._id].parDefault - sortedItems.items[b._id].onHandBeg)
            : (Number(sortedItems.items[b._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[b._id].onHandBeg < 0 ? 0 : Number(sortedItems.items[b._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[b._id].onHandBeg);   
            return second - first;
        })
        .map(item => {
          const index = selectedItems.findIndex(selectedItem => selectedItem._id === item._id)
          if (item.active && !item.prepList) {
            return (
              <Paper 
                key={item._id} 
                className={index > -1 ? classes.itemContainerSelected : classes.itemContainer} 
                onClick={() => {
                  if (index > -1) {
                    setSelectedItems(selectedItems.filter(prevItem => {
                      return prevItem._id !== item._id;
                    }))
                  } else {
                    setSelectedItems([...selectedItems, item]);
                  }
                }}
              > 
                <Grid container className={classes.itemHead} spacing={3}>
                  <Grid item xs={6} style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>{item.label}</Typography>
                  </Grid>
                  <Grid item xs style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>{item.parApplyDaily ? item.parDefault : "Varies"}</Typography>
                  </Grid>  
                  <Grid item xs style={{padding: '0.5rem 0'}}>
                    <Typography className={classes.smallFont}>
                    {sortedItems.items[item._id].parApplyDaily 
                      ? (sortedItems.items[item._id].parDefault - sortedItems.items[item._id].onHandBeg < 0 ? 0 : dcf(sortedItems.items[item._id].parDefault - sortedItems.items[item._id].onHandBeg))
                      : (Number(sortedItems.items[item._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[item._id].onHandBeg < 0 ? 0 : dcf(Number(sortedItems.items[item._id].parDaily[startOfDay(date).toString().substring(0,3)]) - sortedItems.items[item._id].onHandBeg))     
                    }
                    </Typography>
                  </Grid>                                                              
                </Grid>     
              </Paper>             
            );
          }
        })
      );
    }
  }
  return (
    <Dialog open={addItemOpen} maxWidth="xl" fullWidth={true} onClose={() => setAddItem()}>
      <DialogTitle>
        <Typography>Select Items</Typography>
        <IconButton aria-label="Close" className={classes.closeButton} onClick={() => setAddItem()}>
            <CloseIcon />
          </IconButton>      
      </DialogTitle>
      <DialogContent>
        <ItemsHead />
        <div>
          {<RenderItems />}
        </div>
      </DialogContent>
      <DialogActions>
        <Button 
          variant="outlined" 
          color="primary"
          disabled={selectedItems.length > 0 ? false : true} 
          onClick={() => {
            addExistingItem(selectedItems, sortedItems, addItemKey, addItemKeyId);
            setSelectedItems([]);
          }}
        >
          Add Selected
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          disabled={selectedItems.length === 0 ? false : true} 
          onClick={() => createNewItem(addItemKey, addItemKeyId)}
        >
          Create New
        </Button>
      </DialogActions>  
    </Dialog>
    
  );
}

export default AddItem;

const rowHead = ['Name', 'Par', 'Need'];