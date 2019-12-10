import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as itemActions from '../../ducks/item';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { styles } from './stationCrudStyles';

const StationCrud = ({ setStationCrud, stationCrudOpen, station }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const sortedItems = useSelector(({ item }) => item.sortedItems);
  const [value, setValues ] = useState(
    station === 'newStation' ? '' : station.label
  );
  const selectedLocation = useSelector(({ ui }) => ui.selectedLocation); 
  const date = useSelector(({ ui }) => ui.date);
  const stationPosting = useSelector(({ item }) => item.stationPosting);
  const stationPut = useSelector(({ item }) => item.stationPut);
  const addStation = useCallback((value, locationId, date) => dispatch(itemActions.addStation(value, locationId, date)), [dispatch]);
  const putStation = useCallback((value, stationId, locationId, date) => dispatch(itemActions.putStation(value, stationId, locationId, date)), [dispatch]); 
  const clearStation = useCallback((stationId, sortedItems) => dispatch(itemActions.clearStation(stationId, sortedItems)), [dispatch]);
  return (
    <Dialog open={stationCrudOpen} fullWidth={true} maxWidth="xl" onClose={() => setStationCrud()}>
      <DialogTitle>Station</DialogTitle>
      <form>
        <DialogContent>
          <TextField
            id="item-name"
            name="label"
            label="Name"
            value={value}
            onChange={(e) => setValues(e.target.value)}
            className={classes.inputField}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          {station === 'newStation' 
            ? <Button 
                variant="outlined" 
                color="primary"
                disabled={stationPosting ? true : false} 
                onClick={() => {
                  addStation(value, selectedLocation, date)
                  setStationCrud();
                }}
              >
                Add
              </Button>
            : <Button 
                variant="outlined" 
                color="primary" 
                disabled={stationPut ? true : false}
                onClick={() => {
                  putStation(value, station._id, selectedLocation, date);
                  setStationCrud();
                }}
              >
                Save
              </Button>
          }
          <Button 
            variant="outlined" 
            disabled={station === 'newStation' ? true : false}
            color="secondary" 
            onClick={() => {
              clearStation(station._id, sortedItems);
              setStationCrud();
            }}
          >
            Delete
          </Button>
        </DialogActions>                     
      </form>    
    </Dialog>
  );
}

export default StationCrud;


