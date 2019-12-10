import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as itemActions from '../../ducks/item';
import { dcf } from '../../utils';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { styles } from './importStyles';

const Import = ({ setImportOpen, importOpen }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedItems, setSelectedItems] = useState([]);
  const selectedLocation = useSelector(({ ui }) => ui.selectedLocation);
  const importItems = useSelector(({ item }) => item.importItems);
  const sortedItems = useSelector(({ item }) => item.sortedItems);
  const allItems = useSelector(({ item }) => item.allItems);
  const fetchImportItems = useCallback((location, date) => dispatch(itemActions.fetchImportItems(location, date)), [dispatch]);
  const putImportItems = useCallback((selectedItems, sortedItems, allItems) => dispatch(itemActions.putImportItems(selectedItems, sortedItems, allItems)), [dispatch]);  
  useEffect(() => {
    fetchImportItems(selectedLocation, selectedDate);
  },[]);

  return (
    <Dialog
      fullScreen
      open={importOpen}
      onClose={() => setImportOpen(!importOpen)}
      aria-labelledby="import-dialog"
    >
      <DialogTitle id="import-dialog-title">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            margin="normal"
            variant="inline"
            inputVariant="outlined"
            label="Select Date"
            value={selectedDate}
            format="MM/dd/yyyy"
            onChange={(date) => {
              setSelectedDate(date); 
              fetchImportItems(selectedLocation, date);
            }}
            className={classes.datePicker}
          />        
        </MuiPickersUtilsProvider>        
      </DialogTitle>
      {importItems ? 
      <DialogContent>
      <DialogContentText>
        Select Items To Import
      </DialogContentText>
      {importItems.stationsOrder.map(stationId => {
        return (
          <Card key={stationId} className={classes.itemListContainer}>
            <Typography variant="caption" className={classes.stationTitle}>
              {importItems.stations[stationId].label}
            </Typography>
            <Paper className={classes.itemHeadContainer}>
              <Grid container className={classes.itemHead} spacing={3}>
                {rowHead.map(name => {
                  return (
                    <Grid item xs key={name} style={{padding: '0.5rem 0'}}>
                      <Typography className={classes.smallFont}>{name}</Typography>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
            {importItems.stations[stationId].itemIds.map(itemId => {
              const index = selectedItems.findIndex(selectedItem => selectedItem._id === itemId)
              if (
                !sortedItems.items[itemId].prepList 
                && importItems.items[itemId] 
                && importItems.items[itemId].active 
                && sortedItems.items[itemId].active) {
                return (
                  <Paper 
                    key={itemId} 
                    className={index > -1 ? classes.itemContainerSelected : classes.itemContainer}
                    onClick={() => {
                      if (index > -1) {
                        setSelectedItems(selectedItems.filter(prevItem => {
                          return prevItem._id !== itemId;
                        }));
                      } else {
                        setSelectedItems([...selectedItems, importItems.items[itemId]])
                      }
                    }}
                  >
                    <Grid container className={classes.itemHead} spacing={3}>
                      <Grid item xs style={{padding: '0.5rem 0'}}>
                        <Typography className={classes.smallFont}>
                          {importItems.items[itemId].label}
                        </Typography>
                      </Grid>
                      <Grid item xs style={{padding: '0.5rem 0'}}>
                        <Typography className={classes.smallFont}>{dcf(importItems.items[itemId].parDefault)}</Typography>
                      </Grid>                                                                
                    </Grid>
                  </Paper>  
                );
              }
            })}
          </Card> 
        );
      })}
    </DialogContent>      
      :<div>loading...</div>
      }

      <DialogActions>
        <Button onClick={() => {
          putImportItems(selectedItems, sortedItems, allItems);
          setImportOpen(!importOpen)
        }} color="primary">
          Import
        </Button>
        <Button onClick={() => setImportOpen(!importOpen)} color="primary">
          Cancel
        </Button>
      </DialogActions>      
    </Dialog>
  );
}

export default Import;

const rowHead = ['Name', 'Par'];
