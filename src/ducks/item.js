import { url } from '../consts';
import { convertDateFormat, postData, putData, deleteData } from '../utils';
import { format, startOfTomorrow, isToday, isYesterday} from 'date-fns/esm';
const ITEMS_FETCHING = 'ITEMS_FETCHING';
const ITEMS_PUT = 'ITEMS_PUT';
const ALL_ITEMS_FETCHING = 'ALL_ITEMS_FETCHING';
const SET_ALL_ITEMS = 'SET_ALL_ITEMS';
const SORTED_ITEMS_FETCHING = 'SORTED_ITEMS_FETCHING';
const SET_SORTED_ITEMS = 'SET_SORTED_ITEMS';
const DRAG_ITEM_WITHIN = 'DRAG_ITEM_WITHIN';
const DRAG_ITEM_ACROSS = 'DRAG_ITEM_ACROSS';
const EDIT_NUMBER = 'EDIT_NUMBER';
const EDIT_ACTIVE_COUNT = 'EDIT_ACTIVE_COUNT';
const ADD_EXISTING_ITEM = 'ADD_EXISTING_ITEM';
const ADD_NEW_ITEM = 'ADD_NEW_ITEM';
const NEW_ITEM_POSTING = 'NEW_ITEM_POSTING';
const SORTED_ITEMS_PUT = 'SORTED_ITEMS_PUT';
const ALL_ITEMS_PUT = 'ALL_ITEMS_PUT';
const ITEM_PUT = 'ITEM_PUT';
const IMPORT_ITEMS_FETCHING = 'IMPORT_ITEMS_FETCHING';
const SET_IMPORT_ITEMS = 'SET_IMPORT_ITEMS';
const PUT_IMPORT_ITEMS = 'PUT_IMPORT_ITEMS';
const STATION_POSTING = 'STATION_POSTING';
const STATION_PUT = 'STATION_PUT';
const PUBLISHING = 'PUBLISHING';
const ITEM_DELETING = 'ITEM_DELETING';
const SET_ITEM_NUMBER = 'SET_ITEM_NUBER';
const LAST_PUT_ITEMS = 'LAST_PUT_ITEMS';
const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
const SET_UPDATED_ITEMS = 'SET_UPDATED_ITEMS';

const INITIAL_STATE = {
  sortedItemsPut: false, 
  sortedItemsFetching: false,
  allItemsFetching: false,
  importItemsFetching: false,
  newItemPosting: false,
  stationPosting: false,
  publishing: false,
  stationPut: false,
  importItems: null,
  sortedItems: null,
  allItems: null,
  itemNumberOpen: false,
  lastPutItems: null,
  updateMessage: null,
  updateMessageOpen: false,
};

export const publishCount = (sortedItems, date, locationId) => async dispatch => {

  if (!isToday(date)) {
    alert("Item has been published. Go to today's date.");
    return;
  }
  try {
    dispatch({ type:PUBLISHING, payload: true });
    const resp = await postData(`${url}/api/publish-count`, { sortedItems, date: convertDateFormat(date), locationId, todayDate: new Date(), tomorrowDate: format(startOfTomorrow(), "MM/dd/yy") });
    const json = await resp.json();
    dispatch({ type: SET_SORTED_ITEMS, payload: json.payload });
    dispatch({ type:PUBLISHING, payload: false });
  } catch(e) {
    dispatch({ type: PUBLISHING, payload: false });
  }
}

export const permDeleteItem = (allItems, selectedItem, sortedItems) => async dispatch => {
  let sortedItemsCopy = {...sortedItems};
  const itemId = selectedItem._id;

  try {
    dispatch({ type: ITEM_DELETING, payload: true });
    const resp = await deleteData(`${url}/api/item`, { selectedItem });
    const newAllItems = await resp.json();
    console.log(newAllItems,"resp!")
    if (!sortedItemsCopy.items[itemId]) {
      dispatch({ type: SET_SORTED_ITEMS, payload: sortedItemsCopy });
      dispatch({ type: SET_ALL_ITEMS, payload: newAllItems.payload });
    } else {
      const stationId = sortedItemsCopy.items[itemId].stationId ;
      const timeFrameId = sortedItemsCopy.items[itemId].timeFrameId;
      sortedItemsCopy.stations[stationId].itemIds = sortedItemsCopy.stations[stationId].itemIds.filter(prevId => prevId !== itemId);
      sortedItemsCopy.timeFrames[timeFrameId].itemIds = sortedItemsCopy.timeFrames[timeFrameId].itemIds.filter(prevId => prevId !== itemId);
      sortedItemsCopy.all.all.itemIds = sortedItemsCopy.all.all.itemIds.filter(prevId => prevId !== itemId);
      delete sortedItemsCopy.items[itemId];
      dispatch({ type: SET_SORTED_ITEMS, payload: sortedItemsCopy });
      dispatch({ type: SET_ALL_ITEMS, payload: newAllItems.payload });
      dispatch({ type: ITEM_DELETING, payload: false });
    }
  } catch (e) {
    console.log(e);
  }
}

export const addStation = (value, locationId, date) => async dispatch => {
  try {
    dispatch({ type: STATION_POSTING, payload: true });
    const resp = await postData(`${url}/api/station`, { name: convertLabelToName(value), label: value, date: convertDateFormat(date), locationId });
    const json = await resp.json();
    dispatch({ type: SET_SORTED_ITEMS, payload: json.payload });
    dispatch({ type: STATION_POSTING, payload: false });
  } catch(e) {
    dispatch({ type: STATION_POSTING, payload: false });
  }
}

export const fetchItems = (locationId, date, sortTab) => async dispatch => {
  try {
    dispatch({ type: ITEMS_FETCHING, payload: true });
    let [ sortedItems, allItems ] = await Promise.all([
      fetch(`${url}/api/sorted-items?locationId=${locationId}&date=${convertDateFormat(date)}&todayDate=${convertDateFormat(new Date())}&sortTab=${sortTab}`),
      fetch(`${url}/api/items?locationId=${locationId}`),
    ]);
    const sortedItemsJson = await sortedItems.json();
    const allItemsJson = await allItems.json();
    dispatch({ type: ITEMS_FETCHING, payload: false });
    if (sortedItemsJson.payload) {
      dispatch({ type: SET_SORTED_ITEMS, payload: sortedItemsJson.payload });
    } else {
      alert('No items exist on this date');
      return
    }
    dispatch({ type: SET_ALL_ITEMS, payload: allItemsJson.payload });
    
  } catch (e) {
    console.log(e);
    dispatch({ type: ITEMS_FETCHING, payload: false });
  }
}

export const setItemNumber = (item, type, num, date, sortedItems) => async dispatch => {
  if (!isToday(date) || sortedItems.published) {
    alert("You cannot edit data from previous days or future days. Go to today's date");
    return;
  }
  // if (!isToday(date) && !isYesterday(date)) {
  //   alert("You cannot edit data from previous days or future days. Go to today's date");
  //   return;
  // }
  try {
    dispatch({ type: SET_ITEM_NUMBER, payload: {item, type, num} });
  } catch (e) {
    console.log(e);
  }
}
// export const fetchItems = (location, date) => async dispatch => {
//   try {
//     dispatch({ type: ALL_ITEMS_FETCHING, payload: true });
//     const resp = await fetch(`${url}/api/items?locationId=${location}`, {mode: 'cors', credentials: "omit",})
//     const json = await resp.json();
//     dispatch({ type: SET_ALL_ITEMS, payload: json.payload });
//     dispatch({ type: ALL_ITEMS_FETCHING, payload: false });
//   } catch (e) {
//     dispatch({ type: ALL_ITEMS_FETCHING, payload: false });
//   }
// }

export const fetchSortedItems = (location, date) => async (dispatch, getState) => {
  try {
    dispatch({ type: SORTED_ITEMS_FETCHING, payload: true });
    const resp = await fetch(`${url}/api/sorted-items?locationId=${location}&date=${convertDateFormat(date)}`, {mode: 'cors', credentials: "omit",})
    const json = await resp.json(); 
    if (json.payload === 'noItemFound') {
      alert('No items on this date!!!!!');
      getState().ui.date = new Date();
      return;
    }
    dispatch({ type: SET_SORTED_ITEMS, payload: json.payload });
    dispatch({ type: SORTED_ITEMS_FETCHING, payload: false });
  } catch (e) {
    dispatch({ type: SORTED_ITEMS_FETCHING, payload: false });
  }
}

export const putStation = (value, stationId, locationId, date) => async dispatch => {
  try {
    dispatch({ type: STATION_PUT, payload: true });
    const resp = await putData(
      `${url}/api/station`, 
      { name: convertLabelToName(value), label: value, date: convertDateFormat(date), locationId, stationId }
    );
    const json = await resp.json();
    dispatch({ type: SET_SORTED_ITEMS, payload: json.payload });
    dispatch({ type: STATION_PUT, payload: false });  
  } catch (e) {
    dispatch({ type: STATION_PUT, payload: false });
  }
}

export const clearStation = (stationId, sortedItems) => async dispatch => {
  let sortedItemsCopy = { ...sortedItems };
  let items = sortedItemsCopy.items;
  const unassignedId = '2a029060f408c7eb67b4d77ca301dd36';
  try {
    const resp = await deleteData(`${url}/api/station`, { stationId, locationId: sortedItems.locationId });
    const json = await resp.json();
    for (let id in items) {
      if (items[id].stationId === stationId) {
        items[id].stationId = unassignedId;
        sortedItemsCopy.stations[unassignedId].itemIds = [...sortedItemsCopy.stations[unassignedId].itemIds, id];
      } 
    }
    delete sortedItemsCopy.stations[stationId];
    sortedItemsCopy.stationsOrder = sortedItemsCopy.stationsOrder.filter(prevId => prevId !== stationId);
    // console.log(json.payload ,"updated al tiems after delete station")
    dispatch({ type: SET_SORTED_ITEMS, payload: sortedItemsCopy });
    dispatch({ type: SET_ALL_ITEMS, payload: json.payload });
  } catch (e) {
    console.log(e);
  }
} 

export const fetchImportItems = (locationId, date) => async dispatch => {
  try {
    dispatch({ type: IMPORT_ITEMS_FETCHING, payload: true });
    const resp = await fetch(`${url}/api/import-items?locationId=${locationId}&date=${convertDateFormat(date)}`, {mode: 'cors', credentials: "omit",});
    const json = await resp.json();
    if (!json.payload) {
      alert('No items found in that date');
    } else {
      dispatch({ type: IMPORT_ITEMS_FETCHING, payload: false });
      dispatch({ type: SET_IMPORT_ITEMS, payload: json.payload });
    }
  } catch (e) {
    dispatch({ type: IMPORT_ITEMS_FETCHING, payload: false });
  }
}

export const removeItem = (itemId, stationId, timeFrameId, sortedItems) => async dispatch => {
  try {
    let sortedItemsCopy = {...sortedItems};
    delete sortedItemsCopy.items[itemId];
    sortedItemsCopy.stations[stationId].itemIds = sortedItemsCopy.stations[stationId].itemIds.filter(prevId => prevId !== itemId);
    sortedItemsCopy.timeFrames[timeFrameId].itemIds = sortedItemsCopy.timeFrames[timeFrameId].itemIds.filter(prevId => prevId !== itemId);
    sortedItemsCopy.all.all.itemIds = sortedItemsCopy.all.all.itemIds.filter(prevId => prevId !== itemId);  
    dispatch({ type: SET_SORTED_ITEMS, payload: sortedItemsCopy });
  } catch (e) {
    console.log(e);
  }
}

export const removeItemFromList = (itemId, stationId, timeFrameId, sortedItems, allItems, page) => async dispatch => {
  const key = page === "/count" ? 'count' : 'prepList';

  try {
    let sortedItemsCopy = {...sortedItems};
    let allItemsCopy = [...allItems];
    sortedItemsCopy.items[itemId][key] = false;
    const newAllItems = allItemsCopy.map(prevItem => {
      if (prevItem._id !== itemId) {
        return prevItem;
      }
      return {
        ...prevItem,
        [key]: false,
      }
    })
    dispatch({ type: SET_SORTED_ITEMS, payload: sortedItemsCopy });
    dispatch({ type: SET_ALL_ITEMS, payload: newAllItems });
  } catch (e) {
    console.log(e);
  }
}

export const putItems = (locationId, date, lastPutItems, sortedItems, allItems) => async dispatch => {
  // if (!isToday(date) && !isYesterday(date)) {
  //   return;
  // }
  if (!isToday(date)) {
    return;
  }
  try {
    dispatch({ type: LAST_PUT_ITEMS, payload: lastPutItems || new Date()});
    dispatch({ type: ITEMS_PUT, payload: true });
    const [ resp1, resp2 ] = await Promise.all([
      postData(
        `${url}/api/sorted-items`, 
        { newSortedItems: sortedItems, date: convertDateFormat(date), locationId, lastEdited: lastPutItems }
      ),
      postData(`${url}/api/items`, { newAllItems: allItems, locationId, lastEdited: lastPutItems }),
    ]);
    const { payload: { status, message }} = await resp1.json();

    if (status === 'updated') {
      dispatch({ type: UPDATE_MESSAGE, payload: message});
      dispatch({ type: ITEMS_PUT, payload: false });
      return;
    } 
    dispatch({ type: ITEMS_PUT, payload: false });
  } catch (e) {
    console.log(e);
    dispatch({ type: ITEMS_PUT, payload: false });
  }
}

export const putSortedItems = (sortedItems, date, locationId) => async dispatch => {
  try {
    dispatch({ type: SORTED_ITEMS_PUT, payload: true });
    await putData(
      `${url}/api/sorted-items`, 
      { newSortedItems: sortedItems, date: convertDateFormat(date), locationId }
    );
    dispatch({ type: SORTED_ITEMS_PUT, payload: false });
  } catch (e) {
    dispatch({ type: SORTED_ITEMS_PUT, payload: false });
  }
};

export const putAllItems = (allItems, locationId) => async dispatch => {
  try {
    dispatch({ type: ALL_ITEMS_PUT, payload: true });
    await putData(`${url}/api/items`, { newAllItems: allItems, locationId });
    dispatch({ type: ALL_ITEMS_PUT, payload: false });
  } catch(e) {
    dispatch({ type: ALL_ITEMS_PUT, payload: false });
  }
}

export const editNumber = (math, item, key) => dispatch => {
  dispatch({
    type: EDIT_NUMBER,
    payload: { math, item, key },
  })
}

export const editActiveCount = (key, item, sortedItems) => dispatch => {
  const altKey = key === 'active' ? 'count' : '';
  const onPrepList = sortedItems.items[item._id] ? true : false;

  dispatch({
    type: EDIT_ACTIVE_COUNT,
    payload: { key, item, altKey, onPrepList }
  })
}

export const addNewItem = (values, date, page = 'list', lastPutItems, sortedItems) => async dispatch => {
  try {
    const newAllItem = fillInBlanks(values, sortedItems.locationId, 'all');
    const newSortedItem = fillInBlanks(values, sortedItems.locationId, 'sorted');
    dispatch({ type: NEW_ITEM_POSTING, payload: true });
    const resp = await postData(`${url}/api/new-item`, { newAllItem, newSortedItem, date: convertDateFormat(date), page, lastEdited: lastPutItems });
    const { payload: { updatedAllItems, updatedSortedItems }} = await resp.json();
    console.log(updatedSortedItems,"!!!!hello!!!")
    dispatch({ type: SET_SORTED_ITEMS, payload:  updatedSortedItems });
    dispatch({ type: SET_ALL_ITEMS, payload: updatedAllItems });
    
    dispatch({ type: NEW_ITEM_POSTING, payload: false });
  } catch (e) {
    dispatch({ type: NEW_ITEM_POSTING, payload: false });
  }
};

export const editItem = (values, sortedItems, date, allItems) => async dispatch => {
  let sortedItemsCopy = { ...sortedItems };
  let allItemsCopy = [ ...allItems ];
  dispatch({ type: ITEM_PUT, payload: true });

  try {
    const newAllItem = fillInBlanks(values, sortedItemsCopy.locationId, 'all', true);
    const newSortedItem = fillInBlanks(values, sortedItemsCopy.locationId, 'sorted', true)
    const updatedAllItems = allItemsCopy.map(item => {
      if (item._id !== newAllItem._id) {
        return item
      }
      return newAllItem;
    })
    sortedItemsCopy.items[newSortedItem._id] = newSortedItem;
    dispatch({ type: SET_SORTED_ITEMS, payload: sortedItemsCopy });
    dispatch({ type: SET_ALL_ITEMS, payload: updatedAllItems});

    // const resp = await putData(`${url}/api/item`, { newAllItem, newSortedItem, date: convertDateFormat(date), });
    // const { payload: { updatedAllItems, updatedSortedItems }} = await resp.json();
    // dispatch({ type: SET_SORTED_ITEMS, payload: updatedSortedItems });
    // dispatch({ type: SET_ALL_ITEMS, payload: updatedAllItems });
    dispatch({ type: ITEM_PUT, payload: false });
  } catch (e) {
    dispatch({ type: ITEM_PUT, payload: false });
  }
};

export const fillInBlanks = (values, locationId, key, edit = false) => {
  const newValues = { ...values };
  if (key === 'sorted') {
    newValues.made = edit ? newValues.made : 0;
    newValues.onHandEnd = edit ? Number(newValues.onHandEnd) : 0;
    newValues.onHandBeg = edit ? Number(newValues.onHandBeg) : 0; 
    newValues.stationId = newValues.stationId === '' ? '2a029060f408c7eb67b4d77ca301dd36' : newValues.stationId;
    newValues.timeFrameId = newValues.timeFrameId === '' ? "2a029060f408c7eb67b4d77ca301c3cb" : newValues.timeFrameId;
  }
  newValues.label = newValues.name === '' ? '' : newValues.name;
  newValues.name = newValues.name === '' ? '' : convertLabelToName(newValues.name);
  newValues.comments = newValues.comments === '' ? '' : newValues.comments;
  newValues.parDefault = newValues.parDefault === '' ? 0 : Number(newValues.parDefault);
  newValues.createdDate = new Date();
  newValues.active = edit ? newValues.active : true;
  newValues.count = edit ? newValues.count : true; 
  newValues.prepList = edit ? newValues.prepList : true; 
  newValues.locationId = locationId;
  return newValues;
}

export const convertLabelToName = (label) => {
  return label.toLowerCase().split(' ').join('-');
}

export const putImportItems = (selectedItems, sortedItems, allItems) => dispatch => {
  let newSortedItems = {...sortedItems};
  let allItemsCopy = [...allItems];

  for (let item of selectedItems) {
    if(!sortedItems.items[item._id]) {
      alert("Error: You're trying to import an item that doesn't exist on count page. Please proceed to create new item");
    } else {
      newSortedItems.items[item._id].prepList = true;
      for (let allItem of allItemsCopy) {
        if (allItem._id === item._id) {
          allItemsCopy.prepList = true;
        }
      }
    }
  }

  // // }
  // // for (let item of selectedItems) {
  // //   item.onHandBeg = 0;
  // //   item.onHandEnd = 0;
  // //   item.made = 0;
  // //   item.comments= '';
  // //   item.timeFrameId = '2a029060f408c7eb67b4d77ca301c3cb';
  // //   item.stationId = !newSortedItems.stations[item.stationId] ? "2a029060f408c7eb67b4d77ca301dd36" : item.stationId;
    
  // //   newSortedItems.items[item._id] = item; 
  // //   newSortedItems.timeFrames['2a029060f408c7eb67b4d77ca301c3cb'].itemIds = [...newSortedItems.timeFrames['2a029060f408c7eb67b4d77ca301c3cb'].itemIds, item._id];
  // //   newSortedItems.all.all.itemIds = [...newSortedItems.all.all.itemIds, item._id];
  // //   //if you're importing an item which the station is no longer available in today's preplist
  // //   if (!newSortedItems.stations[item.stationId]) {
  // //     //add item to today's preplist's unassigned station
  // //     newSortedItems.stations["2a029060f408c7eb67b4d77ca301dd36"].itemIds = [...newSortedItems.stations["2a029060f408c7eb67b4d77ca301dd36"].itemIds, item._id];
  // //     //if you're importing an item which no longer exists in the all items list
  // //     if (allItemsCopy.findIndex(prevItem => prevItem._id === item._id) === -1) {
  // //       let newItemCopy = {...item};
  // //       newItemCopy.stationId = "2a029060f408c7eb67b4d77ca301dd36";
  // //       delete newItemCopy.comments;
  // //       delete newItemCopy.made;
  // //       delete newItemCopy.onHandBeg;
  // //       delete newItemCopy.onHandEnd;
  // //       delete newItemCopy.timeFrameId;
  // //       allItemsCopy = [...allItemsCopy, newItemCopy];
  // //     } else {
  // //       allItemsCopy = allItemsCopy.map(prevItem => {
  // //         if (prevItem !== item._id) {
  // //           return prevItem;
  // //         }
  // //         return {
  // //           ...prevItem,
  // //           stationId: "2a029060f408c7eb67b4d77ca301dd36",
  // //         }
  // //       });
  // //     }
  // //   } else {
  // //     if (allItemsCopy.findIndex(prevItem => prevItem._id === item._id) === -1) {
  // //       let newItemCopy = {...item};
  // //       newItemCopy.stationId = "2a029060f408c7eb67b4d77ca301dd36";
  // //       delete newItemCopy.comments;
  // //       delete newItemCopy.made;
  // //       delete newItemCopy.onHandBeg;
  // //       delete newItemCopy.onHandEnd;
  // //       delete newItemCopy.timeFrameId;
  // //       allItemsCopy = [...allItemsCopy, newItemCopy];
  // //     }   
  // //     newSortedItems.stations[item.stationId].itemIds = [...newSortedItems.stations[item.stationId].itemIds, item._id];
  // //   }
  // // }
  dispatch({ type: SET_ALL_ITEMS, payload: allItemsCopy });
  dispatch({
    type: PUT_IMPORT_ITEMS,
    payload: newSortedItems,
  });
};

export const addExistingItem = (selectedItems, sortedItems, key, keyId, allItems) => dispatch => {
  let newSortedItems = {...sortedItems};
  let newAllItems = [...allItems];

  // if (key === 'all') {
  //   key = 'stations';
  //   keyId = '2a029060f408c7eb67b4d77ca301dd36';
  // } 

  // const altKey = key === 'stations' ? 'timeFrames' : 'stations';
  // const unassignedId = key === 'stations' ? '2a029060f408c7eb67b4d77ca301c3cb' : '2a029060f408c7eb67b4d77ca301dd36';
  
  for (let item of selectedItems) {
    newSortedItems.items[item._id].prepList = true;
    for (let allItem of newAllItems) {
      if (allItem._id === item._id) {
        allItem.prepList = true;
      }
    }
  }

  dispatch({ type: SET_ALL_ITEMS, payload: newAllItems });
  dispatch({ type: SET_SORTED_ITEMS, payload:  newSortedItems });

  //original code below from here
  // selectedItems.forEach(item => {
  //   item.onHandBeg = 0;
  //   item.onHandEnd = 0;
  //   item.made = 0;
  //   item.comments= '';

  //   if (key === 'timeFrames') {
  //     item[`${key.slice(0, -1)}Id`]= keyId;
  //   } else {
  //     item.timeFrameId = "2a029060f408c7eb67b4d77ca301c3cb"
  //   }
  //   // item[`${key.slice(0, -1)}Id`]= keyId;
  //   // item[`${altKey.slice(0, -1)}Id`] = unassignedId;
  //   newSortedItems.items[item._id] = item;
  //   newSortedItems.stations = {
  //     ...newSortedItems.stations,
  //     [item.stationId]: {
  //       ...newSortedItems.stations[item.stationId],
  //       itemIds: [...newSortedItems.stations[item.stationId].itemIds, item._id]
  //     }
  //   };
  //   newSortedItems.all.all.itemIds = [...newSortedItems.all.all.itemIds, item._id];
  //   if (key === 'timeFrames') {
  //     newSortedItems[key][keyId].itemIds = [...newSortedItems[key][keyId].itemIds, item._id];
  //   } else {
  //     newSortedItems.timeFrames["2a029060f408c7eb67b4d77ca301c3cb"].itemIds = [...newSortedItems.timeFrames["2a029060f408c7eb67b4d77ca301c3cb"].itemIds, item._id];
  //   }

  //to here


    // newSortedItems[altKey] = {
    //   ...newSortedItems[altKey],
    //   [unassignedId]: {
    //     ...newSortedItems[altKey][unassignedId],
    //     itemIds: [ ...newSortedItems[altKey][unassignedId].itemIds, item._id]
    //   }
    // }
  // });
}

//reducer
export default function reducer(state = INITIAL_STATE, { type, payload }) {
  const { sortedItems, allItems, } = state;

  switch (type) {
    case ALL_ITEMS_FETCHING:
      return {
        ...state,
        allItemsFetching: payload
      };
    case SET_ALL_ITEMS:
      return {
        ...state,
        allItems: payload,
      }; 
    case SORTED_ITEMS_FETCHING:
        return {
          ...state,
          sortedItemsFetching: payload,
        };
    case SET_SORTED_ITEMS:
      return {
        ...state,
        sortedItems: payload,
      };       
    case DRAG_ITEM_WITHIN:
      return (function() {
        const { newStation, sort } = payload;
        return {
          ...state,
          sortedItems: {
            ...sortedItems,
            [sort]: {...sortedItems[sort], [newStation._id]: newStation}
          },
        };
      }());
    case DRAG_ITEM_ACROSS:
      return (function() {
        const { newStart, newFinish, draggableId, destDroppableId, sort } = payload;
        if (sort === 'stations') {
          return {
            ...state,
            sortedItems: {
              ...sortedItems,
              [sort]: {...sortedItems[sort], [newStart._id]: newStart, [newFinish._id]: newFinish, },
              items: {
                ...sortedItems.items,
                [draggableId]: {
                  ...sortedItems.items[draggableId],
                  [`${sort.slice(0, -1)}Id`]: destDroppableId,
                }
              }
            },
            allItems: allItems.map(prevItem => {
              if (prevItem._id !== draggableId) {
                return prevItem;
              }
              return {
                ...prevItem,
                stationId: destDroppableId,
              } 
            })
          }; 
        } else {
          return {
            ...state,
            sortedItems: {
              ...sortedItems,
              [sort]: {...sortedItems[sort], [newStart._id]: newStart, [newFinish._id]: newFinish, },
              items: {
                ...sortedItems.items,
                [draggableId]: {
                  ...sortedItems.items[draggableId],
                  [`${sort.slice(0, -1)}Id`]: destDroppableId,
                }
              }
            },
            allItems: allItems.map(prevItem => {
              if (prevItem._id !== draggableId) {
                return prevItem;
              }
              return {
                ...prevItem,
                [`${sort.slice(0, -1)}Id`]: destDroppableId,
              }
            })
          };           
        }
      }());        
    case EDIT_NUMBER:
      const { math, item, key } = payload;
      return {
        ...state,
        sortedItems: {
          ...sortedItems,
          items: {
            ...sortedItems.items,
            [item._id]: {
              ...sortedItems.items[item._id],
              [key]: math === 'increment' ? sortedItems.items[item._id][key] + 1 : sortedItems.items[item._id][key] - 1
            }
          }
        },
      };
    case UPDATE_MESSAGE:
      return {
        ...state,
        updateMessage: payload,
        updateMessageOpen: true,
      }
    case EDIT_ACTIVE_COUNT:
      return (function() {
        const { key, item, altKey, onPrepList } = payload;
        if (onPrepList) {
          if (altKey === 'count') {
            return {
              ...state,
              allItems: allItems.map(prevItem => {
                if (prevItem._id !== item._id) {
                  return prevItem;
                } 
                return {
                  ...prevItem,
                  [key]: !prevItem[key],
                  [altKey]: !prevItem[key],
                }
              }),
              sortedItems: {
                ...sortedItems,
                items: {
                  ...sortedItems.items,
                  [item._id]: {
                    ...sortedItems.items[item._id],
                    [key]: !sortedItems.items[item._id][key],
                    [altKey]: !sortedItems.items[item._id][key],
                  }
                }
              }
            }; 
          } else {
            return {
              ...state,
              allItems: allItems.map(prevItem => {
                if (prevItem._id !== item._id) {
                  return prevItem;
                } 
                return {
                  ...prevItem,
                  [key]: !prevItem[key],
                }
              }),
              sortedItems: {
                ...sortedItems,
                items: {
                  ...sortedItems.items,
                  [item._id]: {
                    ...sortedItems.items[item._id],
                    [key]: !sortedItems.items[item._id][key],
                  }
                }
              }
            }; 
          }
        } else {
          if (altKey === 'count') {
            return {
              ...state,
              allItems: allItems.map(prevItem => {
                if (prevItem._id !== item._id) {
                  return prevItem;
                } 
                return {
                  ...prevItem,
                  [key]: !prevItem[key],
                  [altKey]: !prevItem[key]
                }
              })
            }; 
          } else {
            return {
              ...state,
              allItems: allItems.map(prevItem => {
                if (prevItem._id !== item._id) {
                  return prevItem;
                } 
                return {
                  ...prevItem,
                  [key]: !prevItem[key],
                }
              }),
            }; 
          }          
        }
      }());
    case SET_ITEM_NUMBER:
      return {
        ...state,
        itemNumberOpen: !state.itemNumberOpen,
        itemNumberItem: payload.item,
        itemNumberType: payload.type,
        sortedItems: {
          ...sortedItems,
          items: {
            ...sortedItems.items,
            [payload.item._id]: {
              ...sortedItems.items[payload.item._id],
              [payload.type]: payload.num
            }
          },
        }
      }
    case LAST_PUT_ITEMS:
      return {
        ...state,
        lastPutItems: payload,
      }
    case ADD_EXISTING_ITEM:
      return {
        ...state,
        sortedItems: payload.newSortedItems,
        allItems: payload.newAllItems,
      };
    case NEW_ITEM_POSTING:
      return {
        ...state,
        newItemPosting: payload,
      };
    case ADD_NEW_ITEM:
      return {
        ...state,
        sortedItems: payload.updatedSortedItems,
        allItems: payload.updatedAllItems,
      };
    case SORTED_ITEMS_PUT:
      return {
        ...state,
        sortedItemsPut: payload
      };   
    case ALL_ITEMS_PUT: 
      return {
        ...state,
        allItemsPut: payload,
      };  
    case ITEM_PUT:
      return {
        ...state,
        itemPut: payload,
      };
    case IMPORT_ITEMS_FETCHING:
      return {
        ...state,
        importItemsFetching: payload,
      };
    case SET_IMPORT_ITEMS:
      return {
        ...state,
        importItems: payload,
      }
    case PUT_IMPORT_ITEMS:
      return {
        ...state,
        sortedItems: payload,
      }
    case STATION_POSTING:
      return {
        ...state,
        stationPosting: payload,
      }
    case STATION_PUT:
      return {
        ...state,
        stationPut: payload,
      }
    case PUBLISHING:
      return {
        ...state,
        publishing: payload,
      }  
    case SET_UPDATED_ITEMS: {
      return {
        ...state,
        sortedItems: payload.sortedItems,
        allItems: payload.allItems,
      }
    }       
    default:
      return state;
  }
}



export const dragItem = (result, sortedItems, allItems, sort, date) => dispatch => {
  const { destination, source, draggableId } = result;
  if (sortedItems.published) {
    alert('The list has already been published');
    return;
  }

  if (isToday(date)) {
    if (!destination) { return; } 
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return; }
    const start = sortedItems[sort][source.droppableId];
    const finish = sortedItems[sort][destination.droppableId];
    //within same station
    if (start === finish) {
      const newItemIds = Array.from(start.itemIds);
      newItemIds.splice(source.index, 1);

      newItemIds.splice(destination.index, 0, draggableId);
      const newStation = {...start, itemIds: newItemIds};
      dispatch({ type: DRAG_ITEM_WITHIN, payload: { newStation, sort } });
      return;
    }
  
    //across different station
    const startItemIds = Array.from(start.itemIds);
    startItemIds.splice(source.index, 1);
    const newStart = {...start, itemIds: startItemIds};
    const finishItemIds = Array.from(finish.itemIds);
    finishItemIds.splice(destination.index, 0, draggableId);
    const newFinish = {...finish, itemIds: finishItemIds};
    dispatch({ 
      type: DRAG_ITEM_ACROSS, 
      payload: { 
        newStart, 
        newFinish,
        sort, 
        draggableId,
        sourceDroppableId: source.droppableId,
        destDroppableId: destination.droppableId, 
      } 
    });
  } else {
    alert("You cannot edit data from previous or fututure dates. Go to today's date.");
    return;
  }
}      