import React, { useState } from 'react';
import BaseView from '../../containers/BaseView';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { initialData } from '../../dndData';
import Card from '@material-ui/core/Card';


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => { 
  console.log(draggableStyle,"_dragstyle")
  return ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'red',
    // styles we need to apply on draggables
    ...draggableStyle,
    })
} 

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'grey',
  padding: grid,
  width: 250,
});

const PrepList = () => {
  const [data, setData] = useState(dndData);

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) { return; } 
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return; }
    
    const start = data.stations[source.droppableId];
    const finish = data.stations[destination.droppableId];

    if (start === finish) {
      const newItemIds = Array.from(start.itemIds);
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);
      const newStation = {...start, itemIds: newItemIds};
      setData({...data, stations: {...data.stations, [newStation.id]: newStation }});
      return;
    }

    const startItemIds = Array.from(start.itemIds);
    startItemIds.splice(source.index, 1);
    const newStart = {...start, itemIds: startItemIds};
    const finishItemIds = Array.from(finish.itemIds);
    finishItemIds.splice(destination.index, 0, draggableId);
    const newFinish = {...finish, itemIds: finishItemIds};
    setData({...data, stations: {...data.stations, [newStart.id]: newStart, [newFinish.id]: newFinish}});

  }

  return (
    <BaseView>
      <DragDropContext onDragEnd={onDragEnd}>
          {data.stationOrder.map((stationId, index) => {
            return (
              <div key={stationId} style={{ marginBottom: 25, width: '100%'}}>
                <Droppable droppableId={stationId} index={index}>
                {(dropProvided, dropSnapshot) => (
                  <Card ref={dropProvided.innerRef} style={getListStyle(dropSnapshot.isDraggingOver)}>
                    {data.stations[stationId].itemIds.map((itemId, index) => (
                        <Draggable key={itemId} draggableId={itemId} index={index}>
                          {(dragProvided, dragSnapshot) => (
                            <Card
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              style={getItemStyle(
                                dragSnapshot.isDragging,
                                dragProvided.draggableProps.style,
                              )}                      
                            >
                              {data.items[itemId].name}
                            </Card> 
                          )}
                        </Draggable>
                      ))}
                      {dropProvided.placeholder}
                  </Card>
                )}
              </Droppable>
            </div>
            );
          })}
      </DragDropContext>
    </BaseView>
  );
};

export default PrepList;

const dndData = {
  items: {
    'item-1': { id: 'item-1', name: 'Chicken'},
    'item-2': { id: 'item-2', name: 'Salmon'},
    'item-3': { id: 'item-3', name: 'Kimchi'},
    'item-4': { id: 'item-4', name: 'Beef'},
    'item-5': { id: 'item-5', name: 'Teriyaki'},
    'item-6': { id: 'item-6', name: 'Wasabi'},
    'item-7': { id: 'item-7', name: 'Gyoza'}
  },
  stations: {
    'station-1': { id: 'station-1', name: 'Kitchen Fridge', itemIds: ['item-1','item-2','item-3',] },
    'station-2': { id: 'station-2', name: 'Sauces', itemIds: ['item-5', 'item-6'] },
    'station-3': { id: 'station-3', name: 'Unassigned', itemIds: ['item-7'] }
  },
  stationOrder: ['station-1', 'station-2', 'station-3'],
}
























// const Column = ({ column, tasks }) => {
//   return (
//     <Card style={{ minWidth: 300, padding: 15, marginTop: 15}}>
//       <Typography>{column.title}</Typography>
//       <Droppable droppableId={column.id}>
//         {(droppableProvided) => (
//           <Card ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
//             {tasks.map((task, i) => {
//               return (
//                 <Task key={task.id} task={task} i={i} />
//               );
//             })}
//             {droppableProvided.placeholder}
//           </Card>
//         )}
//       </Droppable>
//     </Card>
//   );
// }

// const Task = ({ task, i }) => {
//   return (
//     <Draggable draggableId={task.id} index={i}>
//       {(draggableProvided) => (
//         <Card {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps} ref={draggableProvided.innerRef} style={{margin: 10}}>
//           {task.content}
//         </Card>
//       )}
//     </Draggable>
//   );
// }









// import React, { useState } from 'react';
// import BaseView from '../../containers/BaseView';

// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { initialData } from '../../dndData';
// import Card from '@material-ui/core/Card';
// import Typography from '@material-ui/core/Typography';

// const PrepList = () => {
//   const [tasks] = useState(initialData.tasks);
//   const [columns] = useState(initialData.columns);
//   const [columnOrder] = useState(initialData.columnOrder);

//   const onDragEnd = result => {
//     console.log('drag ended')
//   }

//   return (
//     <BaseView>
//       <DragDropContext onDragEnd={onDragEnd}>
//         {columnOrder.map(columnId => {
//           const column = columns[columnId];
//           const taskList = column.taskIds.map(taskId => tasks[taskId]);

//           return <Column key={column.id} column={column} tasks={taskList}/>
//         })}
//       </DragDropContext>
//     </BaseView>
//   );
// };

// export default PrepList;

// const Column = ({ column, tasks }) => {
//   return (
//     <Card style={{ minWidth: 300, padding: 15, marginTop: 15}}>
//       <Typography>{column.title}</Typography>
//       <Droppable droppableId={column.id}>
//         {(droppableProvided) => (
//           <Card ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
//             {tasks.map((task, i) => {
//               return (
//                 <Task key={task.id} task={task} i={i} />
//               );
//             })}
//             {droppableProvided.placeholder}
//           </Card>
//         )}
//       </Droppable>
//     </Card>
//   );
// }

// const Task = ({ task, i }) => {
//   return (
//     <Draggable draggableId={task.id} index={i}>
//       {(draggableProvided) => (
//         <Card {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps} ref={draggableProvided.innerRef} style={{margin: 10}}>
//           {task.content}
//         </Card>
//       )}
//     </Draggable>
//   );
// }