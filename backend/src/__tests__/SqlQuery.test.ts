import { DELTA_DB } from '../consts';
import { filterToQuery } from '../utils';

jest.setTimeout(1000000);

describe('Filter to SQL', () => {
  it('should write proper query', () => {
    const readBody2 = {
      filters: {
        name: {
          filter: 'PontusVision',
          filterType: 'text',
          type: 'contains',
        },
        folder: {
          filter: 'folder 1',
          filterType: 'text',
          type: 'contains',
        },
      },
    };
    const query = filterToQuery(readBody2);

    expect(query.queryStr.toLocaleLowerCase()).toBe("where c.name like ? and c.folder like ?");
    expect(query.params).toEqual(['%PontusVision%', '%folder 1%'])

    const query2 = filterToQuery({
      filters: {
        name: {
          filter: 'PontusVision',
          filterType: 'text',
          type: 'equals',
        },
        folder: {
          filter: 'folder 1',
          filterType: 'text',
          type: 'equals',
        },
      },
    });

    expect(query2.queryStr.toLocaleLowerCase()).toBe("where c.name = ? and c.folder = ?")
    expect(query2.params).toEqual(['PontusVision', 'folder 1'])

    const query3 = filterToQuery({
      filters: {
        name: {
          filter: 'PontusVision',
          filterType: 'text',
          type: 'not contains',
        },
        folder: {
          filter: 'folder 1',
          filterType: 'text',
          type: 'not contains',
        },
      },
    });

    if(process.env.DB_SOURCE === DELTA_DB) {
      expect(query3.queryStr.toLocaleLowerCase()).toBe('where c.name not like ? and c.folder not like ?') 
    } else{
      expect(query3.queryStr.toLocaleLowerCase()).toBe('where not contains(c.name, "pontusvision") and not contains(c.folder, "folder 1")') 
    }
    expect(query3.params).toEqual(["%PontusVision%", "%folder 1%"])

    const query4 = filterToQuery({
      filters: {
        name: {
          filter: 'PontusVision',
          filterType: 'text',
          type: 'not equals',
        },
        folder: {
          filter: 'folder 1',
          filterType: 'text',
          type: 'not equals',
        },
      },
    });

    expect(query4.queryStr.toLocaleLowerCase()).toBe(
            "where not c.name = ? and not c.folder = ?",
          );
    expect(query4.params).toEqual(['PontusVision', 'folder 1'])

    const date = '2023-10-19 00:00:00';

    const query5 = filterToQuery({
      filters: {
        name: {
          condition1: {
            dateFrom: date,
            filterType: 'date',
            type: 'greaterThan',
          },
          condition2: {
            dateFrom: date,
            filterType: 'date',
            type: 'greaterThan',
          },
          filterType: 'date',
          operator: 'AND',
        },
        folder: {
          condition1: {
            dateFrom: date,
            filterType: 'date',
            type: 'lessThan',
          },
          condition2: {
            dateFrom: date,
            filterType: 'date',
            type: 'lessThan',
          },
          operator: 'AND',
          filterType: 'date',
        },
      },
    });

    expect(query5.queryStr.toLocaleLowerCase()).toBe(
      `where (c.name > ? and c.name > ?) and (c.folder < ? and c.folder < ?)`.toLocaleLowerCase(),
    )
    expect(query5.params).toEqual(['2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z'])

    const query6 = filterToQuery({
      filters: {
        name: {
          condition1: {
            dateFrom: date,
            filterType: 'date',
            type: 'greaterThan',
          },
          condition2: {
            dateFrom: date,
            filterType: 'date',
            type: 'greaterThan',
          },
          filterType: 'date',
          operator: 'OR',
        },
        folder: {
          condition1: {
            dateFrom: date,
            filterType: 'date',
            type: 'lessThan',
          },
          condition2: {
            dateFrom: date,
            filterType: 'date',
            type: 'lessThan',
          },
          operator: 'OR',
          filterType: 'date',
        },
      },
    });

    expect(query6.queryStr.toLocaleLowerCase()).toBe(
      `where (c.name > ? or c.name > ?) and (c.folder < ? or c.folder < ?)`.toLocaleLowerCase(),
    );
    expect(query6.params).toEqual(['2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z'])

    const query7 = filterToQuery({
      filters: {
        name: {
          dateFrom: date,
          filterType: 'date',
          type: 'greaterThan',

          operator: 'OR',
        },
      },
    });

    expect(query7.queryStr.toLocaleLowerCase()).toBe(
      `where c.name > ?`.toLocaleLowerCase(),
    );
    expect(query7.params).toEqual(['2023-10-19T00:00:00Z'])

    const query8 = filterToQuery({
      filters: {
        name: {
          dateFrom: date,
          dateTo: date,
          filterType: 'date',
          type: 'inRange',

          operator: 'OR',
        },
      },
    });

    expect(query8.queryStr.toLocaleLowerCase()).toBe(
      `where c.name >= ? AND c.name <= ?`.toLocaleLowerCase(),
    );
    expect(query8.params).toEqual(['2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z'])

    const query9 = filterToQuery({
      filters: {
        name: {
          condition1: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          condition2: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          operator: 'OR',
          filterType: 'date',
        },
      },
    });

    expect(query9.queryStr.toLocaleLowerCase()).toBe(
      `where (c.name >= ? AND c.name <= ?) OR (c.name >= ? AND c.name <= ?)`.toLocaleLowerCase(),
    );
    expect(query9.params).toEqual(['2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z'])

    const query10 = filterToQuery({
      filters: {
        name: {
          condition1: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          condition2: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          operator: 'OR',
          filterType: 'date',
        },
        folder: {
          condition1: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          condition2: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          operator: 'OR',
          filterType: 'date',
        },
      },
    });

    expect(query10.queryStr.toLocaleLowerCase()).toBe(
      `where ((c.name >= ? AND c.name <= ?) OR (c.name >= ? AND c.name <= ?)) and ((c.folder >= ? AND c.folder <= ?) OR (c.folder >= ? AND c.folder <= ?))`.toLocaleLowerCase(),
    );
    expect(query10.params).toEqual(['2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z'])

    const query11 = filterToQuery({
      from: 1000,
      to: 1100,
      filters: {
        name: {
          condition1: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          condition2: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          operator: 'OR',
          filterType: 'date',
        },
        folder: {
          condition1: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          condition2: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          operator: 'OR',
          filterType: 'date',
        },
      },
    });

    if(process.env.DB_SOURCE === DELTA_DB) {
      expect(query11.queryStr.toLocaleLowerCase()).toBe(
        `where ((c.name >= ? AND c.name <= ?) OR (c.name >= ? AND c.name <= ?)) and ((c.folder >= ? AND c.folder <= ?) OR (c.folder >= ? AND c.folder <= ?)) LIMIT 100  OFFSET 999`.toLocaleLowerCase(),
      );
      expect(query11.params).toEqual(['2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z'])
    }else {
      expect(query11.queryStr.toLocaleLowerCase()).toBe(
        `where ((c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z') OR (c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z')) and ((c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z') OR (c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z')) OFFSET 999 LIMIT 100`.toLocaleLowerCase(),
      );
    }


    const query12 = filterToQuery({
      from: 1000,
      to: 1100,
      filters: {
        name: {
          condition1: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          condition2: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          operator: 'OR',
          filterType: 'date',
        },
        folder: {
          sort: 'asc',
          condition1: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          condition2: {
            dateFrom: date,
            dateTo: date,
            filterType: 'date',
            type: 'inRange',
          },
          operator: 'OR',
          filterType: 'date',
        },
      },
    });

    if(process.env.DB_SOURCE === DELTA_DB) {
      expect(query12.queryStr.toLocaleLowerCase()).toBe(
        `where ((c.name >= ? AND c.name <= ?) OR (c.name >= ? AND c.name <= ?)) and ((c.folder >= ? AND c.folder <= ?) OR (c.folder >= ? AND c.folder <= ?)) ORDER BY c.folder asc LIMIT 100  OFFSET 999`.toLocaleLowerCase(),
      );
      expect(query12.params).toEqual(['2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z', '2023-10-19T00:00:00Z'])
    }else{
      expect(query12.queryStr.toLocaleLowerCase()).toBe(
        `where ((c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z') OR (c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z')) and ((c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z') OR (c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z')) ORDER BY c.folder asc OFFSET 999 LIMIT 100`.toLocaleLowerCase(),
      );
    }
  });
  it('should test query with hyphen', () => {
    const readBody2 = {
      filters: {
        ['foo-bar']: {
          filter: 'PontusVision',
          filterType: 'text',
          type: 'contains',
        },
      },
    };

    const query = filterToQuery(readBody2);

    console.log({ query });
  });
});
