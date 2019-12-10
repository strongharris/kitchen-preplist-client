import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as itemActions from '../../ducks/item';
import { dcf } from '../../utils';
import ItemNumberDumb from '../../components/ItemNumberDumb';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './itemCrudStyles';


const ItemCrud = ({ setItemCrud, itemCrudOpen, location }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const date = useSelector(({ ui }) => ui.date);
  const addItemKey = useSelector(({ ui }) => ui.addItemKey);
  const addItemKeyId = useSelector(({ ui }) => ui.addItemKeyId);
  let allItems = useSelector(({ item }) => item.allItems);
  let sortedItems = useSelector(({ item }) => item.sortedItems);
  const item = useSelector(({ ui }) => ui.itemCrud); 
  const lastPutItems = useSelector(({ item }) => item.lastPutItems); 
  const selectedStation = sortedItems.stations[item.stationId] || '';

 
  const addNewItem = useCallback((values, date, page) => dispatch(itemActions.addNewItem(values, date, page, lastPutItems, sortedItems)));
  const editItem = useCallback((values, sortedItems, date, allItems) => dispatch(itemActions.editItem(values, sortedItems, date, allItems)));
  const permDeleteItem =useCallback((allItems, item, sortedItems) => dispatch(itemActions.permDeleteItem(allItems, item, sortedItems))); 
  const removeItemFromList = useCallback((itemId, stationId, timeFrameId, sortedItems, allItems) => dispatch(itemActions.removeItemFromList(itemId, stationId, timeFrameId, sortedItems, allItems, location.pathname )));
  const split = (num) => {
    const numStr = num.toString();
    let splited = {
      whole: '',
      rational: '',
    }
    let wholeCompleted = false;
    for (let char of numStr) {
      if (char === '.') {
        wholeCompleted = true;
        splited.rational += char;
      } else if (wholeCompleted) {
        splited.rational += char;
      } else {
        splited.whole += char;
      }
    }
    splited.whole = Number(splited.whole);
    splited.rational = Number(splited.rational);

    return splited;
  }

  const [values, setValues] = useState({
    _id: item === 'newItem' ? '' : item._id,
    name: item === 'newItem' ? '' : item.label,
    stationId: item === 'newItem' && addItemKey === '' ? "2a029060f408c7eb67b4d77ca301dd36" : selectedStation._id || (addItemKey === 'stations' ? addItemKeyId : '2a029060f408c7eb67b4d77ca301dd36'),
    comments: item === 'newItem' ? '' : item.comments,
    parDefault: item === 'newItem' ? '' : item.parDefault,
    parApplyDaily: item === 'newItem' ? true : item.parApplyDaily,
    parDaily: item === 'newItem' ? { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' } : item.parDaily,
    onHandBeg: item === 'newItem' ? '' : item.onHandBeg,
    onHandEnd: item === 'newItem' ? '' : item.onHandEnd,
    made: item === 'newItem' ? 0 : item.made,
    active: item === 'newItem' ? true : item.active,
    count: item === 'newItem' ? true : item.count,
    prepList: item === 'newItem' ? true : item.prepList,
    timeFrameId: item === 'newItem' && (addItemKey === '' || addItemKey === 'all') ? '2a029060f408c7eb67b4d77ca301c3cb' : (addItemKey === 'stations' ? '2a029060f408c7eb67b4d77ca301c3cb' : addItemKeyId ),
  });

  const [ui, setUi] = useState({
    itemNumberOpen: false,
    itemNumberType: '',
    // wholeOnHandBeg: location.pathname === '/items' ? '' : (item === 'newItem' ? '' : split(item.onHandBeg).whole),
    // rationalOnHandBeg: location.pathname === '/items' ? '' : (item === 'newItem' ? '' : split(item.onHandBeg).rational),
    // wholeOnHandEnd: location.pathname === '/items' ? '' : (item === 'newItem' ? '' : split(item.onHandEnd).whole),
    // rationalOnHandEnd: location.pathname === '/items' ? '' : (item === 'newItem' ? '' : split(item.onHandEnd).rational),
    wholeOnHandBeg: (item === 'newItem' ? '' : split(item.onHandBeg).whole),
    rationalOnHandBeg: (item === 'newItem' ? '' : split(item.onHandBeg).rational),
    wholeOnHandEnd: (item === 'newItem' ? '' : split(item.onHandEnd).whole),
    rationalOnHandEnd: (item === 'newItem' ? '' : split(item.onHandEnd).rational),    
    wholeParDefault: item === 'newItem' ? '' : split(item.parDefault).whole,
    rationalParDefault: item === 'newItem' ? '' : split(item.parDefault).rational,
    wholeParDailyMon: item === 'newItem' ? '' : split(item.parDaily.Mon).whole, 
    rationalParDailyMon: item === 'newItem' ? '' : split(item.parDaily.Mon).rational, 
    wholeParDailyTue: item === 'newItem' ? '' : split(item.parDaily.Tue).whole, 
    rationalParDailyTue: item === 'newItem' ? '' : split(item.parDaily.Tue).rational, 
    wholeParDailyWed: item === 'newItem' ? '' : split(item.parDaily.Wed).whole, 
    rationalParDailyWed: item === 'newItem' ? '' : split(item.parDaily.Wed).rational, 
    wholeParDailyThu: item === 'newItem' ? '' : split(item.parDaily.Thu).whole, 
    rationalParDailyThu: item === 'newItem' ? '' : split(item.parDaily.Thu).rational, 
    wholeParDailyFri: item === 'newItem' ? '' : split(item.parDaily.Fri).whole, 
    rationalParDailyFri: item === 'newItem' ? '' : split(item.parDaily.Fri).rational, 
    wholeParDailySat: item === 'newItem' ? '' : split(item.parDaily.Sat).whole, 
    rationalParDailySat: item === 'newItem' ? '' : split(item.parDaily.Sat).rational, 
    wholeParDailySun: item === 'newItem' ? '' : split(item.parDaily.Sun).whole, 
    rationalParDailySun: item === 'newItem' ? '' : split(item.parDaily.Sun).rational,     
  });

  const handleInputChange = e => {
    const { name, value, checked } = e.target;
    if (name === 'parApplyDaily') {
      setValues({ ...values, [name]: checked });
    } else if (days.indexOf(name) > -1) {
      setValues({ ...values, parDaily: { ...values.parDaily, [name]: Number(value) } });
    } else {
      setValues({ ...values, [name]: value });
    }
  }

  const convertKey = (type) => {
    if (type.indexOf('whole') > -1) {
      let newType = type.slice(5);
      newType[0].toLowerCase();
      return newType;
    } else {
      let newType = type.slice(8);
      newType[0].toLowerCase();
      return newType;
    }
  }

  const findAltKey = (type) => {
    if (type.indexOf('whole') > -1) {
      let newType = type.slice(5);
      newType = 'rational' + newType;
      return newType;
    } else {
      let newType = type.slice(8);
      newType = 'whole' + newType;
      return newType;
    }  
  }
  useEffect(() => {
    setValues({
      ...values,
      onHandBeg: ui.wholeOnHandBeg + ui.rationalOnHandBeg,
      onHandEnd: ui.wholeOnHandEnd + ui.rationalOnHandEnd,
      parDefault: ui.wholeParDefault + ui.rationalParDefault,
      parDaily: { 
        Mon: ui.wholeParDailyMon + ui.rationalParDailyMon, 
        Tue: ui.wholeParDailyTue + ui.rationalParDailyTue, 
        Wed: ui.wholeParDailyWed + ui.rationalParDailyWed, 
        Thu: ui.wholeParDailyThu + ui.rationalParDailyThu,
        Fri: ui.wholeParDailyFri + ui.rationalParDailyFri,
        Sat: ui.wholeParDailySat + ui.rationalParDailySat,
        Sun: ui.wholeParDailySun + ui.rationalParDailySun, 
      }
    });
  }, [
    ui.wholeOnHandBeg, 
    ui.rationalOnHandBeg, 
    ui.wholeOnHandEnd, 
    ui.rationalOnHandEnd, 
    ui.wholeParDefault, 
    ui.rationalParDefault,
    ui.wholeParDailyMon,
    ui.rationalParDailyMon,
    ui.wholeParDailyTue,
    ui.rationalParDailyTue,
    ui.wholeParDailyWed,
    ui.rationalParDailyWed,
    ui.wholeParDailyThu,
    ui.rationalParDailyThu,
    ui.wholeParDailyFri,
    ui.rationalParDailyFri,
    ui.wholeParDailySat,
    ui.rationalParDailySat,
    ui.wholeParDailySun,
    ui.rationalParDailySun,
  ]);

  const handleNumberChange = (type, value) => () => {
    setUi({
      ...ui,
      [type]: value,
    })
  }

  const setItemNumber = (type = '') => {
    setUi({
      ...ui,
      itemNumberOpen: !ui.itemNumberOpen,
      itemNumberType: type,
    })
  }

  const renderParDaily = () => {
    return (
      <Grid container spacing={1}>
        {days.map(day => {
          return (
            <Grid key={day} item xs={3} sm>
              <TextField
                id="outlined-bare"
                name={day}
                value={dcf(values.parDaily[day])}
                label={day}
                disabled={true}
                className={classes.parDay}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleInputChange}
                onClick={() => setItemNumber(`ParDaily${day}`)}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }

  return (
    <Dialog fullScreen open={itemCrudOpen} onClose={() => setItemCrud()}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setItemCrud()} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Item
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => {
              if (item === 'newItem') {
                location.pathname === '/items'
                  ? addNewItem(values, date, 'items')
                  : addNewItem(values, date, location.pathname.slice(1));
              } else {
                editItem(values, sortedItems, date, allItems)
              }
              setItemCrud();
            }}
          >
            save
          </Button>          
        </Toolbar>
      </AppBar>

      <Container className={classes.root}>
        <form className={classes.container}>
          {item === 'newItem' 
            ? <div>
                <FormControl component="fieldset" className={classes.radioGroup}>
                  <FormLabel component="legend">Station</FormLabel>
                  <RadioGroup aria-label="station" name="stationId" value={values.stationId} onChange={handleInputChange} row>
                    {sortedItems.stationsOrder.map(stationId => {
                      return (
                        <FormControlLabel
                          key={stationId}
                          value={stationId}
                          control={<Radio color="primary" />}
                          label={sortedItems.stations[stationId].label}
                          labelPlacement="end"
                        />                    
                      );
                    })}
                  </RadioGroup>
                </FormControl>            
              </div> 
            : <div></div>
          }
          <div>
            <TextField
              id="item-name"
              name="name"
              label="Name"
              value={values.name}
              onChange={handleInputChange}
              className={classes.inputField}
              margin="normal"
              variant="outlined"
            />
          </div>
          {location.pathname !== '/items'
            ? <div>
                <TextField
                  name="onHandBeg"
                  label="Beginning On-Hand"
                  value={dcf(ui.wholeOnHandBeg + ui.rationalOnHandBeg)}
                  onChange={handleInputChange}
                  className={classes.inputField}
                  disabled={true}
                  // disabled={(location.pathname === '/count' && item !== 'newItem') || (location.pathname === '/prelist' && item === 'newItem') ? true : false}
                  margin="normal"
                  variant="outlined"
                  onClick={() =>
                    (location.pathname === '/count' && item !== 'newItem') || (location.pathname === '/prelist' && item === 'newItem') 
                      ? null
                      : setItemNumber('OnHandBeg')
                  }
                />
              </div>
            : <div></div>
          }
          {location.pathname !== '/items' 
            ? <div>
                <TextField
                  name="onHandEnd"
                  label="Ending On-Hand"
                  value={dcf(values.onHandEnd)}
                  disabled={(location.pathname === '/preplist') || (location.pathname === '/count' && item === 'newItem') ? true : false}
                  onChange={handleInputChange}
                  className={classes.inputField}
                  disabled={true}
                  margin="normal"
                  variant="outlined"
                  onClick={() => 
                    (location.pathname === '/preplist') || (location.pathname === '/count' && item === 'newItem') 
                      ? null
                      : setItemNumber('OnHandEnd')
                  }
                />
              </div>
            : <div></div>
          }
          <div>
            <TextField
              id="item-par"
              name="parDefault"
              label="Par"
              value={dcf(values.parDefault)}
              onChange={handleInputChange}
              className={classes.inputField}
              margin="normal"
              variant="outlined"
              disabled={true}
              onClick={() => 
                values.parApplyDaily === false
                  ? null
                  : setItemNumber('ParDefault')
              }            
            />
            <FormControlLabel
              control={<Switch name="parApplyDaily" checked={values.parApplyDaily} onChange={handleInputChange} />}
              label="Apply Daily"
              className={classes.parDaily}
            /> 
          </div>
          { !values.parApplyDaily ? renderParDaily() : <div></div> }
          <div>          
            <TextField
              id="item-comments"
              name="comments"
              label="Comments"
              value={values.comments}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              fullWidth
              multiline
            />
          </div>
          {
            location.pathname === '/items' && item !== 'newItem' ? 
            <div className={classes.buttonContainer}>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => {
                  permDeleteItem(allItems, item, sortedItems);
                  setItemCrud();
                }}
              >
                Remove Permanently
              </Button>               
            </div> :
            item !== 'newItem' ? 
            <div className={classes.buttonContainer}>
             <Button 
             variant="outlined" 
             color="secondary" 
             onClick={() => {
               removeItemFromList(item._id, item.stationId, item.timeFrameId, sortedItems, allItems);
               setItemCrud();
             }}
           >
             Remove From List
           </Button>
           </div> : 
           <div></div>         
          }                  
        </form>    
      </Container>
      {ui.itemNumberOpen ? <ItemNumberDumb open={ui.itemNumberOpen} item={item} ui={ui} handleNumberChange={handleNumberChange} setItemNumber={setItemNumber} /> : <div></div>}  
    </Dialog>
  );
}

const ItemCrudWithRouter = withRouter(ItemCrud);
export default ItemCrudWithRouter;

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

