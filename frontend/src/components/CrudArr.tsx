type Props = {
  name: string,
  crudSelected: string ;
  onCrudSelection: (item: {[key:string]: unknown}) => void
  onCrudArrItemSelection: (item: {[key:string]: unknown}) => void
  onCrudRemoval: () => void
}

const CrudArr = ({name, onCrudSelection}:Props) => {


    return (
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-2">Create</h2>
        <div
          onClick={() => setSelectedCrud(name)}
          className={`drop-target bg-gray-200 p-4 rounded ${
            selectedCrud === name 
              ? 'border-blue-700 border-2 border-solid'
              : ''
          }`}
        >
          {createArr?.map((item, index) => (
            <div
              onClick={() => setSelectedArrItem(item)}
              key={index}
              className={`dropped-item bg-green-300 p-2 rounded ${
                item === selectedArrItem
                  ? 'border-solid border-blue-700 border-4'
                  : ''
              }`}
            >
              {item?.name}
            </div>
          ))}
        </div>
        {selectedCrud === name && selectedArrItem && (
          <button
            onClick={() => removeFromCrudArr(name)}
            className="w-6 bg-neutral-200"
          >
            -
          </button>
        )}
      </div>
  )
}

export default CrudArr
