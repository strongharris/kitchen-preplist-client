import React from 'react';

import { styles } from './itemStyles';

export const Item = ({ item, }) => {
  const classes = styles();
  alert('hey!')
  return (
    <Paper key={itemId} className={classes.itemContainer} onClick={() => setItemOpen(!itemOpen)}>
      <Grid container className={classes.itemHead} spacing={3}>
        <Grid item xs style={{padding: '0.5rem 0'}}>
          <Typography className={classes.smallFont}>{item.name}</Typography>
        </Grid>
        <Grid item xs style={{padding: '0.5rem 0'}}>
          <Typography className={classes.smallFont}>{item.onHand.end}</Typography>
        </Grid>
        <Grid item xs style={{padding: '0.5rem 0'}}>
          <Typography className={classes.smallFont}>{item.par.default}</Typography>
        </Grid>  
        <Grid item xs style={{padding: '0.5rem 0'}}>
          <Typography className={classes.smallFont}>{item.par.default - item.onHand.end}</Typography>
        </Grid> 
        <Grid item xs style={{padding: '0.5rem 0'}}>
          <Typography className={classes.smallFont}>{item.made}</Typography>
        </Grid>                                                                 
      </Grid>
    </Paper>  
  );
}

export const ItemHead = ({ rowHead }) => {
  const classes = styles();

  return (
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
  );
}

