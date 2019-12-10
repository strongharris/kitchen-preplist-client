import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { dcf } from '../../utils';
import { styles } from './itemNumberStyles';

const rationalNumbers = [
  {value: 0, label: '0'},
  {value: 0.25, label: '1/4'},
  {value: 0.5, label: '1/2'},
  {value: 0.75, label: '3/4'},
];

const wholeNumbers = [];

for (let i = 0; i < 100; i++) {
  wholeNumbers.push({ value: i, label: i + '' });
}

const ItemNumber = ({ open, item, editNumber, setItemNumber, type }) => {
  const classes = styles();
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
  const initValue = split(item[type])
  const [state, setState] = useState({
    whole: initValue.whole,
    rational: initValue.rational,
  });

  const handleChange = (number, value) => () => {
    setState({
      ...state,
      [number]: value,
    });
  }

  const renderNumbers = (type) => {
    const list = type === 'whole' ? wholeNumbers : rationalNumbers;

    return (
      <List className={classes.list}>
        {list.map(number => {
          return (
            <div id={number.value} key={number.value} >
            <ListItem 
              key={number.value} 
              className={number.value === state[type] ? classes.listItemSelected : classes.listItem}
              onClick={handleChange(type, number.value)}
            >
              <ListItemText primary={number.label} className={classes.listItemText} />
            </ListItem>
            </div>
          );
        })}
      </List>
    );
  }

  return (
    <Dialog open={open} onClose={() => setItemNumber(item, type, Number(state.whole+state.rational))}>
      <div className={classes.root}>
      <Typography>
        {type}
      </Typography>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <FormControl className={classes.formControl}>
                <Typography variant="caption" className={classes.inputLabel}>
                  {`Selected: ${state.whole}`}
                </Typography>
                {renderNumbers('whole')}
              </FormControl>  
            </Grid>
            <Grid item xs={5}>
              <FormControl className={classes.formControl}>
                <Typography variant="caption" className={classes.inputLabel}>
                {`Selected: ${dcf(state.rational)}`}
                </Typography>
                {renderNumbers('rational')}
              </FormControl>  
            </Grid>
          </Grid>
          </div>
    </Dialog>
  );
}

export default ItemNumber;

//editItemNumber(selectedNum, type)
//onHand Beg 5.5
//