import React, { Children, useEffect, useState } from 'react';
import FileItem from './components/Tree/FileItem';
import data from './components/Tree/data';
import FolderItem from './components/Tree/FolderItem';
import { Child, DataRoot } from './types';

const DragAndDropArray = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [createArr, setCreateArr] = useState<Array<Child|DataRoot>>([]);
  const [selectedCrud, setSelectedCrud] = useState();
  const [selectedGroup, setSelectedGroup] = useState<Child|DataRoot>();
  const [selectedDashboard, setSelectedDashboard] = useState<Child|DataRoot>();
  const [readArr, setReadArr] = useState<Array<Child|DataRoot>>([]);
  const [updateArr, setUpdateArr] = useState<Array<Child|DataRoot>>([]);
  const [deleteArr, setDeleteArr] = useState<Array<Child|DataRoot>>([]);
  const [selectedArrItem, setSelectedArrItem] = useState();

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number, item: Child | DataRoot) => {
    console.log({ item });
    // if (item.id === 'root') return;
    event.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const data = event.dataTransfer.getData('text/plain');
    console.log(data);
    const item = JSON.parse(data);
    // console.log();
    setCreateArr([...createArr, item]);

    // const item = items[index];
    // const newItems = items.filter((_, i) => i !== index);

    // setItems(newItems);
  };

  const addToCrudArr = () => {
    if (selectedCrud === 'Create' && selectedGroup) {
      setCreateArr([...new Set([...createArr, selectedGroup])]);
    }
    if (selectedCrud === 'Read' && selectedGroup) {
      setReadArr([...new Set([...readArr, selectedGroup])]);
    }
    if (selectedCrud === 'Update' && selectedGroup) {
      setUpdateArr([...new Set([...updateArr, selectedGroup])]);
    }
    if (selectedCrud === 'Delete' && selectedGroup) {
      setDeleteArr([...new Set([...deleteArr, selectedGroup])]);
    }
  };

  const removeFromCrudArr = (arr: string) => {
    if (arr === 'Create') {
      setCreateArr(createArr.filter((el) => el !== selectedArrItem));
    }
    if (arr === 'Read') {
      setReadArr(readArr.filter((el) => el !== selectedArrItem));
    }
    if (arr === 'Update') {
      setUpdateArr(updateArr.filter((el) => el !== selectedArrItem));
    }
    if (arr === 'Delete') {
      setDeleteArr(deleteArr.filter((el) => el !== selectedArrItem));
    }
  };

  useEffect(() => {
    console.log({ selectedGroup });
  }, [selectedGroup]);

  const handleGroupSelect = (folder:Child | DataRoot) => {
    if(folder.type !== 'folder') return
    setSelectedGroup(folder);
    console.log({group: folder})
  };

  const handleDashboardSelect = (dashboard: DataRoot | Child) => {
    if(dashboard.type !== 'file') return
    setSelectedDashboard(dashboard);
    console.log({dash:dashboard})
  };

  const searchItems = (folder:DataRoot | Child, term: string): Array<Child| DataRoot> | undefined=> {
    const results = [];

    if (folder.name.toLowerCase().includes(term.toLowerCase())) {
      results.push(folder);
    }
    
    if(!folder?.children) return
    for (const child of folder?.children) {
      if (child.type === 'folder') {
      results.push(...searchItems(child, term));
      } else if (child.name.toLowerCase().includes(term.toLowerCase())) {
        results.push(child);
      }
    }

    return results;
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <div className="flex flex-col items-center">
        <label htmlFor="">Selected Dashboard</label>
        {selectedDashboard && <h1>{selectedDashboard?.path}</h1>}
      </div>
      <div className="flex justify-center p-8 gap-12">
        <div className="flex flex-col space-y-4 w-52">
          <h2 className="text-xl font-semibold mb-2">Dashboards</h2>
          <FolderItem
            selected={selectedDashboard?.path}
            onSelect={handleDashboardSelect}
            onDragStart={handleDragStart}
            folder={data}
          />
        </div>
        <div
          className="flex flex-col space-y-4 w-80"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Create</h2>
            <div
              onClick={() => setSelectedCrud('Create')}
              className={`drop-target bg-gray-200 p-4 rounded ${
                selectedCrud === 'Create'
                  ? 'border-blue-700 border-2 border-solid'
                  : ''
              }`}
            >
              {createArr?.map((item, index) => (
                <div
                  onClick={() => setSelectedArrItem(item)}
                  key={index}
                  className={`dropped-item bg-green-300 p-2 rounded ${
                    item === selectedArrItem && selectedCrud === "Create"
                      ? 'border-solid border-blue-700 border-4'
                      : ''
                  }`}
                >
                  {item?.path}
                </div>
              ))}
            </div>
            {selectedCrud === 'Create' && selectedArrItem && createArr.length > 0 && (
              <button
                onClick={() => removeFromCrudArr('Create')}
                className="w-6 bg-neutral-200"
              >
                -
              </button>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Read</h2>
            <div
              onClick={() => setSelectedCrud('Read')}
              className={`drop-target bg-gray-200 p-4 rounded ${
                selectedCrud === 'Read'
                  ? 'border-blue-700 border-2 border-solid'
                  : ''
              }`}
            >
              {readArr?.map((item, index) => (
                <div
                  onClick={() => setSelectedArrItem(item)}
                  key={index}
                  className={`dropped-item bg-green-300 p-2 rounded ${
                    item === selectedArrItem && selectedCrud === "Read"
                      ? 'border-solid border-blue-700 border-4'
                      : ''
                  }`}
                >
                  {item?.path}
                </div>
              ))}
            </div>
            {selectedCrud === 'Read' && selectedArrItem && readArr.length > 0 &&(
              <button
                onClick={() => removeFromCrudArr('Read')}
                className="w-6 bg-neutral-200"
              >
                -
              </button>
            )}
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Update</h2>
            <div
              onClick={() => setSelectedCrud('Update')}
              className={`drop-target bg-gray-200 p-4 rounded ${
                selectedCrud === 'Update'
                  ? 'border-blue-700 border-2 border-solid'
                  : ''
              }`}
            >
              {updateArr?.map((item, index) => (
                <div
                  onClick={() => setSelectedArrItem(item)}
                  key={index}
                  className={`dropped-item bg-green-300 p-2 rounded ${
                    item === selectedArrItem && selectedCrud === "Update"
                      ? 'border-solid border-blue-700 border-4'
                      : ''
                  }`}
                >
                  {item?.path}
                </div>
              ))}
            </div>
            {selectedCrud === 'Update' && selectedArrItem  && updateArr.length > 0 && (
              <button
                onClick={() => removeFromCrudArr('Update')}
                className="w-6 bg-neutral-200"
              >
                -
              </button>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Delete</h2>
            <div
              onClick={() => setSelectedCrud('Delete')}
              className={`drop-target bg-gray-200 p-4 rounded ${
                selectedCrud === 'Delete'
                  ? 'border-blue-700 border-2 border-solid'
                  : ''
              }`}
            >
              {deleteArr?.map((item, index) => (
                <div
                  onClick={() => setSelectedArrItem(item)}
                  key={index}
                  className={`dropped-item bg-green-300 p-2 rounded ${
                    item === selectedArrItem && selectedCrud === "Delete"
                      ? 'border-solid border-blue-700 border-4'
                      : ''
                  }`}
                >
                  {item?.path}
                </div>
              ))}
            </div>
            {selectedCrud === 'Delete' && selectedArrItem && deleteArr.length > 0 && (
              <button
                onClick={() => removeFromCrudArr('Delete')}
                className="w-6 bg-neutral-200"
              >
                -
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-4 w-52">
          <h2 className="text-xl font-semibold mb-2">Groups</h2>
          <div>
            {selectedDashboard && selectedCrud && selectedGroup && (
              <button onClick={addToCrudArr} className="bg-neutral-200 ">
                +
              </button>
            )}
          </div>
          {selectedGroup && (
            <label htmlFor="">Selected: {selectedGroup.name}</label>
          )}
          <FolderItem
            onSelect={handleGroupSelect}
            selected={selectedGroup?.path}
            onDragStart={handleDragStart}
            folder={data}
          />
        </div>
      </div>
    </div>
    // <DndProvider backend={MultiBackend} options={getBackendOptions()}>
    //   <Tree
    //     tree={treeData}
    //     rootId={0}
    //     onDrop={handleDrop}
    //     render={(node, { depth, isOpen, onToggle }) => (
    //       <div style={{ marginLeft: depth * 10 }}>
    //         {node.droppable && (
    //           <span onClick={onToggle}>{isOpen ? '[-]' : '[+]'}</span>
    //         )}
    //         {node.text}
    //       </div>
    //     )}
    //   />
    // </DndProvider>
  );
};

export default DragAndDropArray;
