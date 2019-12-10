import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as itemActions from '../../ducks/item';
import * as uiActions from '../../ducks/ui';
import { dcf } from '../../utils';
import BaseView from '../../containers/BaseView';
import ItemCrud from '../../containers/ItemCrud';
import AddItem from '../../containers/AddItem';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { styles } from './itemsStyles.js';

const Items = () => {
  const classes = styles();
  const dispatch = useDispatch();
  const [ inactive, setInactiveItems ] = useState({ filtered: false, items: [], });
  const allItems = useSelector(({ item }) => item.allItems); 
  const sortedItems = useSelector(({ item }) => item.sortedItems);
  const itemCrud = useSelector(({ ui }) => ui.itemCrud);
  const itemCrudOpen = useSelector(({ ui }) => ui.itemCrudOpen);
  const addItemOpen = useSelector(({ ui }) => ui.addItemOpen);   
  const updateMessage = useSelector(({ item }) => item.updateMessage);
  const updateMessageOpen = useSelector(({ item }) => item.updateMessageOpen);
  const setItemCrud = useCallback((key, id, item) => dispatch(uiActions.setItemCrud(key, id, item, date)));
  const selectedLocation = useSelector(({ ui }) => ui.selectedLocation); 
  const date = useSelector(({ ui }) => ui.date);  
  const lastPutItems = useSelector(({ item }) => item.lastPutItems); 

  const editActiveCount = useCallback((key, item, sortedItems) => dispatch(itemActions.editActiveCount(key, item, sortedItems)));
  const fetchItems = useCallback((locationId, date) => dispatch(itemActions.fetchItems(locationId, date)));
  const putItems = useCallback((locationId, date, sortedItems, allItems) => dispatch(itemActions.putItems(locationId, date, lastPutItems, sortedItems, allItems )));
  const setAddItem = useCallback((key, id) => dispatch(uiActions.setAddItem(key, id))); 
  useEffect(() => {
    fetchItems(selectedLocation, date); 
  },[selectedLocation, date]);
  useEffect(() => {
    putItems(selectedLocation, date, sortedItems, allItems); 
  },[sortedItems, allItems]);
  // useEffect(() => { 
  //   console.log("PUT ITEMS ADD ITEM OPEN")
  //   putItems(selectedLocation, date) 
  // },[addItemOpen]);
  // useEffect(() => { 
  //   console.log('PUT ITEM CRUD OPEN')
  //   putItems(selectedLocation, date) 
  // },[itemCrudOpen]);
  // useEffect(() => { 
  //   putItems(selectedLocation, date) 
  // },[sortedItems, allItems, addItemOpen, itemCrudOpen]);
  const TopButtons = () => {
    const classes = styles();
  
    return (
      <Grid container justify="flex-end" spacing={1} className={classes.button}>
        <Grid item>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary" 
            className={`${classes.smallFont}`} 
            onClick={() => setInactiveItems(prevState => ({
              ...prevState,
              filtered: !prevState.filtered,
              items: allItems.filter(item => item.active),
            }))}
          >
            Active Items
          </Button>
        </Grid>
        <Grid item>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary" 
            className={`${classes.smallFont}`}
            onClick={() => setItemCrud()}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
    );
  }
  const items = inactive.filtered ? inactive.items : allItems;
  return (
    <BaseView>
      <Container className={classes.root}>
      <TopButtons />  
      {allItems && sortedItems ?   
        <Card className={classes.itemListContainer}>
          <Typography variant="caption" className={classes.stationTitle}>All Items</Typography>
          <ItemsHead />
          {items.sort((a, b) => {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          }).map(item => {
            return (
              <Paper key={item._id} className={classes.itemContainer}>
                <Grid container className={classes.itemHead} spacing={3}>
                  <Grid item xs={3} style={{padding: '0.5rem 0'}} onClick={() => setItemCrud('', '', sortedItems.items[item._id])}>
                    <Typography className={classes.smallFont}>{item.label}</Typography>
                  </Grid>
                  <Grid item xs={3} style={{padding: '0.5rem 0'}} onClick={() => setItemCrud('', '', sortedItems.items[item._id])}>
                    <Typography className={classes.smallFont}>{item.parApplyDaily ? dcf(item.parDefault) : 'Varies'}</Typography>
                  </Grid>  
                  <Grid item xs style={{padding: '0.3rem 0'}}>
                    <Checkbox 
                      checked={item.active}
                      color="primary"
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      className={classes.checkbox}
                      onClick={(e) => {
                        editActiveCount('active', item, sortedItems);
                      }}
                    />
                  </Grid> 
                  <Grid item xs style={{padding: '0.3rem 0'}}>
                    <Checkbox 
                      checked={item.count}
                      color="primary"
                      disabled={item.active ? false : true}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      className={classes.checkbox}
                      onClick={(e) => {
                        editActiveCount('count', item, sortedItems);
                      }}
                    />
                  </Grid>                                                                 
                </Grid>               
              </Paper>
            );
          })} 
          <Paper className={classes.addItemContainer} onClick={() => setItemCrud()}>
            <Grid container className={classes.itemHead} spacing={3}>
              <Grid item style={{padding: '0.5rem 0'}}>
                <Typography className={`${classes.smallFont} ${classes.addItem}`}>
                  + Add New Item
                </Typography>
              </Grid>
            </Grid>
          </Paper>  
        </Card> 
        : <div>loading...</div>}
      </Container>
      { itemCrudOpen ? <ItemCrud setItemCrud={setItemCrud} itemCrudOpen={itemCrudOpen} item={itemCrud}/> : <div></div> }
      {/* { addItemOpen ? <AddItem addItemOpen={addItemOpen} setAddItem={setAddItem} /> : <div></div> } */}
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
  );
};

export default Items;

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
          } else if (name === 'Par') {
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


const rowHead = ['Name', 'Par', 'Active', 'Count']

