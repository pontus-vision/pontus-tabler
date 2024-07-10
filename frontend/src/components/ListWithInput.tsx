import React, { useEffect, useState } from 'react';

type Props = {
  items: string[];
};

const ListWithInput = ({ items }: Props) => {
  const [itemsArr, setItemsArr] = useState<string[]>([]);
  const [newItemContent, setNewItemContent] = useState('');

  const addItem = () => {
    if (newItemContent.trim() !== '') {
      setItemsArr([...itemsArr, newItemContent]);
      setNewItemContent(''); // Clear the input field
    }
  };

  useEffect(() => {
    if (!items) return;
    setItemsArr(items);
    console.log({ items });
  }, [items]);

  return (
    <div className="list-with-input">
      <input
        type="text"
        value={newItemContent}
        onChange={(e) => setNewItemContent(e.target.value)}
        placeholder="Enter new item"
        className="list-with-input__input"
      />
      <button onClick={addItem} className="list-with-input__button">
        Add Item
      </button>
      <ul className="list-with-input__items">
        {itemsArr?.map((item, index) => (
          <li key={index} className="list-with-input__item">
            <div>{item}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListWithInput;
