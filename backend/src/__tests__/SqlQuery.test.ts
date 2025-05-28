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

    expect(query.toLocaleLowerCase() === "where c.name like '%pontusvision%' and c.folder like '%folder 1%'" || query.toLocaleLowerCase() === "where c.name like '%pontusvision%' and c.folder like '%folder 1%'").toBeTruthy();

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

    console.log({query2: query2.toLocaleLowerCase()})
    expect(query2.toLocaleLowerCase() === "where c.name = 'pontusvision' and c.folder = 'folder 1'" || query2.toLocaleLowerCase() ===  "where c.name = \"pontusvision\" and c.folder = \"folder 1\"").toBeTruthy();

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

    expect(query3.toLocaleLowerCase() === 'where not contains(c.name, "pontusvision") and not contains(c.folder, "folder 1")' || query3.toLocaleLowerCase() === "where c.name not like '%pontusvision%' and c.folder not like '%folder 1%'").toBeTruthy()

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

    expect(query4.toLocaleLowerCase()).toBe(
            "where not c.name = 'pontusvision' and not c.folder = 'folder 1'",
          );

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

    expect(query5.toLocaleLowerCase()).toBe(
      `where (c.name > '2023-10-19T00:00:00Z' and c.name > '2023-10-19T00:00:00Z') and (c.folder < '2023-10-19T00:00:00Z' and c.folder < '2023-10-19T00:00:00Z')`.toLocaleLowerCase(),
    );

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

    expect(query6.toLocaleLowerCase()).toBe(
      `where (c.name > '2023-10-19T00:00:00Z' or c.name > '2023-10-19T00:00:00Z') and (c.folder < '2023-10-19T00:00:00Z' or c.folder < '2023-10-19T00:00:00Z')`.toLocaleLowerCase(),
    );

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

    expect(query7.toLocaleLowerCase()).toBe(
      `where c.name > '2023-10-19T00:00:00Z'`.toLocaleLowerCase(),
    );

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

    expect(query8.toLocaleLowerCase()).toBe(
      `where c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z'`.toLocaleLowerCase(),
    );

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

    expect(query9.toLocaleLowerCase()).toBe(
      `where (c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z') OR (c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z')`.toLocaleLowerCase(),
    );

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

    expect(query10.toLocaleLowerCase()).toBe(
      `where ((c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z') OR (c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z')) and ((c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z') OR (c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z'))`.toLocaleLowerCase(),
    );

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
      expect(query11.toLocaleLowerCase()).toBe(
        `where ((c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z') OR (c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z')) and ((c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z') OR (c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z')) LIMIT 100  OFFSET 999`.toLocaleLowerCase(),
      );
    }else {
      expect(query11.toLocaleLowerCase()).toBe(
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
      expect(query12.toLocaleLowerCase()).toBe(
        `where ((c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z') OR (c.name >= '2023-10-19T00:00:00Z' AND c.name <= '2023-10-19T00:00:00Z')) and ((c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z') OR (c.folder >= '2023-10-19T00:00:00Z' AND c.folder <= '2023-10-19T00:00:00Z')) ORDER BY c.folder asc LIMIT 100  OFFSET 999`.toLocaleLowerCase(),
      );
    }else{
      expect(query12.toLocaleLowerCase()).toBe(
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
