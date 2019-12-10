import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as uiActions from '../../ducks/ui';
import BaseView from '../../containers/BaseView';
import { BoxedSelect } from '../../components/Select';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { styles } from './homeStyles';

const Home = () => {
  const classes = styles();
  const dispatch = useDispatch();  
  const selectedLocation = useSelector(({ ui }) => ui.selectedLocation); 
  const changeLocation = useCallback((selectedLocation) => dispatch(uiActions.changeLocation(selectedLocation)), [dispatch]);
  const locations = useSelector(({ ui }) => ui.locations);
  
  return (
    <BaseView>
      <Container className={classes.root}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <BoxedSelect
              name="location"   
              label="Location" 
              items={locations} 
              selected={selectedLocation}
              onChange={e => { changeLocation(e.target.value) }}
            />
          </Grid>
        </Grid>        
      </Container>
    </BaseView>
  );
};

export default Home;
