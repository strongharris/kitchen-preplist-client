import { url } from '../consts';
import { dateMatched } from '../utils';

const locations = [ 
  { 
    _id: '2a029060f408c7eb67b4d77ca300186b',
    name: 'albany',
    label: 'Albany' 
  },
  { 
    _id: '2a029060f408c7eb67b4d77ca30027e9',
    name: 'oakland',
    label: 'Oakland' 
  },
];

const INITIAL_STATE = {
  sortTab: 'stations',
  locations,
  selectedLocation: localStorage.getItem('lastVisited') || '2a029060f408c7eb67b4d77ca30027e9',
  date: new Date(),
  itemCrud: 'newItem',
  itemCrudOpen: false,
  stationCrud: 'newStation',
  stationCrudOpen: false,
  addItemOpen: false,
  page: '/',
};

const LOCATIONS_FETCHING = 'LOCATIONS_FETCHING';
const SET_LOCATIONS = 'SET_LOCATIONS';
const CHANGE_SORT_TAB = 'CHANGE_SORT_TAB';
const CHANGE_LOCATION = 'CHANGE_LOCATION';
const CHANGE_DATE = 'CHANGE_DATE';
const SET_ITEM_CRUD = 'SET_ITEM_CRUD';
const SET_STATION_CRUD = 'SET_STATION_CRUD';
const SET_ADD_ITEM = 'SET_ADD_ITEM';
const CREATE_NEW_ITEM = 'CREATE_NEW_ITEM';
const CHANGE_PAGE = 'CHANGE_PAGE';

export const fetchLocations = () => async dispatch => {
  try {
    dispatch({ type: LOCATIONS_FETCHING, payload: true });
    const resp = await fetch(`${url}/api/locations`, {mode: 'no-cors', credentials: "omit",});
    const json = await resp.json();
    dispatch({ type: SET_LOCATIONS, payload: json.payload });
    dispatch({ type: LOCATIONS_FETCHING, payload: false });
  } catch(e) {
    dispatch({ type: LOCATIONS_FETCHING, payload: false });
  }
}

export const changePage = (selectedPage) => dispatch => {
  dispatch({
    type: CHANGE_PAGE,
    payload: selectedPage
  });
};

export const changeSortTab = (selectedTab) => dispatch => {
  dispatch({
    type: CHANGE_SORT_TAB,
    payload: selectedTab,
  });
};

export const changeLocation = (selectedLocation) => dispatch => {
  localStorage.setItem('lastVisited', selectedLocation);
  dispatch({
    type: CHANGE_LOCATION,
    payload: selectedLocation,
  });
};

export const changeDate = (selectedDate) => dispatch => {
  dispatch({
    type: CHANGE_DATE,
    payload: selectedDate,
  });
};

export const setItemCrud = (key, id, item, date) => dispatch => {
  console.log('opened CRUD!');
  item = item || 'newItem';
  key = key || '';
  id = id || '';

  if (!dateMatched(date)) {
    alert("Item has been published. Go to today's date");
    return;
  }
  dispatch({
    type: SET_ITEM_CRUD,
    payload: {
      item,
      key,
      id
    }
  })
};

export const setStationCrud = (station= 'newStation', date) => dispatch => {
  if (!dateMatched(date)) {
    alert("List has been published. Go to today's date");
    return;
  }
  dispatch({
    type: SET_STATION_CRUD,
    payload: station, 
  })
}

export const setAddItem = (key, id, date) => dispatch => {
  if (!dateMatched(date)) {
    alert("List has been published. Go to today's date");
    return;
  }
  dispatch({
    type: SET_ADD_ITEM,
    payload: {
      key,
      id,
    },
  });
}

export const createNewItem = (key='', id='') => dispatch => {
  dispatch({
    type: CREATE_NEW_ITEM,
    payload: { type: 'newItem', key, id },
  });
}

export default function reducer(state = INITIAL_STATE, {type, payload}) {
  switch (type) {
    case LOCATIONS_FETCHING: 
      return {
        ...state,
        locationFetching: payload, 
      };
    case SET_LOCATIONS: 
      return {
        ...state,
        locations: payload,
      };
    case CHANGE_SORT_TAB:
      return {
        ...state,
        sortTab: payload,
      };
    case CHANGE_LOCATION:
      return {
        ...state,
        selectedLocation: payload,
      };
    case CHANGE_DATE:
      return {
        ...state,
        date: payload,
      };  
    case CHANGE_PAGE:
      return {
        ...state,
        page: payload,
      }
    case SET_ITEM_CRUD:
      return {
        ...state,
        itemCrud: payload.item,
        itemCrudOpen: !state.itemCrudOpen,
        addItemKey: payload.key,
        addItemKeyId: payload.id,
      }
    case SET_STATION_CRUD:
      return {
        ...state,
        stationCrud: payload,
        stationCrudOpen: !state.stationCrudOpen,
      }  
    case SET_ADD_ITEM:
      return {
        ...state,
        addItemOpen: !state.addItemOpen,
        addItemKey: payload.key,
        addItemKeyId: payload.id,
      } 
    case CREATE_NEW_ITEM:
      return {
        ...state,
        addItemOpen: !state.addItemOpen,
        itemCrud: payload.type,
        itemCrudOpen: !state.itemCrudOpen,
        addItemKey: payload.key,
        addItemKeyId: payload.id,
      }                         
    default:
      return state;
  }
};