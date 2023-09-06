import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

function TreeItem({ item }) {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'treeItem', id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {item.name}
    </div>
  );
}

function DropBox({ onDropItem }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'treeItem',
    drop: (item, monitor) => onDropItem(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}
    >
      Drop items here
    </div>
  );
}

function MyComponent() {
  const [items, setItems] = useState([]);

  const handleDropItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  return (
    <div>
      {treeData.map((item) => (
        <TreeItem key={item.id} item={item} />
      ))}
      <DropBox onDropItem={handleDropItem} />
      {/* Render the items in the box here */}
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
