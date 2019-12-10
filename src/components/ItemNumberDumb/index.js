import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { dcf } from '../../utils';
import { styles } from './itemNumberDumbStyles';

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

const ItemNumberDumb = ({ open, item, handleNumberChange, setItemNumber, ui}) => {
  const classes = styles();
  const renderNumbers = (type) => {
    const list = type.indexOf('whole') > -1 ? wholeNumbers : rationalNumbers;
    const handleType = type === 'whole' ? type + ui.itemNumberType : 'rational' + ui.itemNumberType;
    return (
      <List className={classes.list}>
        {list.map(number => {
          return (
            <div id={number.value} key={number.value} >
            <ListItem 
              key={number.value} 
              className={number.value == ui[handleType] ? classes.listItemSelected : classes.listItem}
              onClick={handleNumberChange(handleType, number.value)}
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
    <Dialog open={open} onClose={() => setItemNumber()}>
      <div className={classes.root}>
        <Typography>
          {ui.itemNumberType}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <FormControl className={classes.formControl}>
              <Typography variant="caption" className={classes.inputLabel}>
                {`Selected: ${ui[`whole${ui.itemNumberType}`] || ''}`}
              </Typography>
              {renderNumbers('whole')}
            </FormControl>  
          </Grid>
          <Grid item xs={5}>
            <FormControl className={classes.formControl}>
              <Typography variant="caption" className={classes.inputLabel}>
              {`Selected: ${dcf(ui[`rational${ui.itemNumberType}`]) || ''}`}
              </Typography>
              {renderNumbers('rational')}
            </FormControl>  
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}

export default ItemNumberDumb;
