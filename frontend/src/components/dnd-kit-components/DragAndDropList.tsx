import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import SortableItem from './SortableItem';
import {v4 as uuidV4} from 'uuid'

function DragAndDropList({ items }) {
  const [elements, setElements] = useState([
    { name: 'JavaScript', id: 'kjndjkasnasdj' },
    { name: 'Java', id: 'kjndjkasnaj' },
    'TypeScript',
  ]);

  useEffect(() => {
    setElements(items.map(el=>{return{name: el, id: }}));
  }, [items]);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Container className="p-3" style={{ width: '50%' }} align="center">
        <SortableContext
          items={elements}
          strategy={verticalListSortingStrategy}
        >
          {/* We need components that use the useSortable hook */}
          {elements.map((element) => (
            <SortableItem
              name={element.name}
              key={element.id}
              id={element.id}
            />
          ))}
        </SortableContext>
      </Container>
    </DndContext>
  );

  function handleDragEnd(event) {
    console.log('Drag end called');
    const { active, over } = event;
    console.log('ACTIVE: ' + active.id);
    console.log('OVER :' + over.id);

    if (active.id !== over.id) {
      setElements((items) => {
        const activeIndex = items.findIndex((el) => el.id === active.id);
        const overIndex = items.findIndex((el) => el.id === over.id);
        console.log(arrayMove(items, activeIndex, overIndex));
        return arrayMove(items, activeIndex, overIndex);
        // items: [2, 3, 1]   0  -> 2
        // [1, 2, 3] oldIndex: 0 newIndex: 2  -> [2, 3, 1]
      });
    }
  }
}

export default DragAndDropList;
