'use strict';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  ColDef,
  ColGroupDef,
  Grid,
  GridOptions,
  GridReadyEvent,
  ITextFilterParams,
} from 'ag-grid-community';
// import { IOlympicData } from './interfaces';

function contains(target: string, lookingFor: string) {
  return target && target.indexOf(lookingFor) >= 0;
}

var athleteFilterParams: ITextFilterParams = {
  filterOptions: ['contains', 'notContains'],
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/ç/g, 'c')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/ñ/g, 'n')
      .replace(/[òóôõö]/g, 'o')
      .replace(/œ/g, 'oe')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y');
  },
  debounceMs: 200,
  maxNumConditions: 1,
};

var countryFilterParams: ITextFilterParams = {
  filterOptions: ['contains'],
  textMatcher: ({ value, filterText }) => {
    var aliases: Record<string, string> = {
      usa: 'united states',
      holland: 'netherlands',
      niall: 'ireland',
      sean: 'south africa',
      alberto: 'mexico',
      john: 'australia',
      xi: 'china',
    };
    var literalMatch = contains(value, filterText || '');
    return !!literalMatch || !!contains(value, aliases[filterText || '']);
  },
  trimInput: true,
  debounceMs: 1000,
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '30rem', width: '100%' }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: 'athlete',
      // filterParams: athleteFilterParams,
    },
    {
      field: 'country',
      filter: 'agTextColumnFilter',
      // filterParams: countryFilterParams,
    },
    {
      field: 'sport',
      filter: 'agTextColumnFilter',
      filterParams: {
        caseSensitive: true,
        defaultOption: 'startsWith',
      } as ITextFilterParams,
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      sortable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      hey
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default GridExample
