import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as uiActions from '../../ducks/ui';
import { BoxedSelect } from '../../components/Select';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/ListAlt';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { styles } from './baseViewStyles';

const BaseView = ({ children, location }) => {
  const classes = styles();

  return (
    <div className={classes.root}>
      { location.pathname !== '/' ? <TopNavbarWithRouter /> : <div></div> }
      { children }
      <BottomNavbarWithRouter />
    </div>
  );
}

const BaseViewWithRouter = withRouter(BaseView);
export default BaseViewWithRouter;

const BottomNavbar = ({ location }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const page = useSelector(({ ui }) => ui.page); 
  const changePage = useCallback((selectedPage) => dispatch(uiActions.changePage(selectedPage)));
  const [value, setValue] = useState(location.pathname);
  useEffect(() => { 
    changePage(location.pathname); 
  },[]);
  return (
    <BottomNavigation
      value={page}
      onChange={(e, selectedPage) => {
        changePage(selectedPage);
      }}
      showLabels
      className={classes.bottomNav}
    >
      <BottomNavigationAction label="Home" value="/" to="/" icon={<HomeIcon />} component={Link} />
      <BottomNavigationAction label="Prep List" value="/preplist" to="/preplist" icon={<ListIcon />} component={Link} />
      <BottomNavigationAction label="Count" value="/count" to="/count" icon={<CheckIcon />} component={Link} />
      <BottomNavigationAction label="Items" value="/items" to="/items" icon={<EditIcon />} component={Link} />
    </BottomNavigation>
  );
}
const BottomNavbarWithRouter = withRouter(BottomNavbar);

const TopNavbar = ({ location }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const sortTab = useSelector(({ ui }) => ui.sortTab);
  const locations = useSelector(({ ui }) => ui.locations);
  const selectedLocation = useSelector(({ ui }) => ui.selectedLocation); 
  const date = useSelector(({ ui }) => ui.date);  
  const changeSortTab = useCallback((selectedTab) => dispatch(uiActions.changeSortTab(selectedTab)));
  const changeLocation = useCallback((selectedLocation) => dispatch(uiActions.changeLocation(selectedLocation)));
  const changeDate = useCallback((selectedDate) => dispatch(uiActions.changeDate(selectedDate)));

  const renderTabs = () => {
    return (
      <Tabs 
        value={sortTab} 
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, selectedTab) => changeSortTab(selectedTab)}
        className={classes.tabs}
      >
        {views.map((view) => 
          <Tab key={view} label={view} value={view} className={classes.tab} /> 
        )}
      </Tabs>
    );
  }

  return (
    <HideOnScroll>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <BoxedSelect
            name="location"   
            label="Location" 
            items={locations} 
            selected={selectedLocation}
            onChange={e => { changeLocation(e.target.value) }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              margin="normal"
              variant="inline"
              inputVariant="outlined"
              label="Select Date"
              value={date}
              format="MM/dd/yyyy"
              onChange={(date) => changeDate(date)}
              className={classes.datePicker}
            />        
          </MuiPickersUtilsProvider>
        </Toolbar>
        { location.pathname === '/preplist' || location.pathname === '/count' ? renderTabs() : <div></div> }
      </AppBar>
    </HideOnScroll>
  );
}
const TopNavbarWithRouter = withRouter(TopNavbar);

const HideOnScroll = ({ children, window }) => {
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );  
}

const views = ['all', 'stations', 'timeFrames'];