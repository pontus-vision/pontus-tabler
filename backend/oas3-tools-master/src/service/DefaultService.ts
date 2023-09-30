// import { createTable } from '../docker/test/app';

import { dashboardCreate } from "./dashboardCreate";

/**
 * Create a new group
 * Create a new group with a name, parents, and symlinks
 *
 * body NewGroup
 * returns authGroup
 **/
export async function authGroupCreatePOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      groupId: "groupId",
      name: "name",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Delete a group
 * Delete a group by ID
 *
 * body DeleteGroup
 * no response value expected for this operation
 **/
export function authGroupDeletePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Get group by ID
 * Retrieve group by id
 *
 * body Group_read_body
 * returns authGroup
 **/
export function authGroupReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      groupId: "groupId",
      name: "name",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Update group by ID
 * Update group details by ID
 *
 * body UpdateGroup
 * no response value expected for this operation
 **/
export function authGroupUpdatePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Get all groups
 * Retrieve all groups (nodes that Aggrid is using a new pagination filter model)
 *
 * body ReadPaginationFilter
 * returns inline_response_200_1
 **/
export function authGroupsReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      authGroups: [
        {
          groupId: "groupId",
          name: "name",
        },
        {
          groupId: "groupId",
          name: "name",
        },
      ],
      totalGroups: 0,
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Create a new user
 * Create a new user with a name and associated groups
 *
 * body NewUser
 * returns User
 **/
export function authUserCreatePOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      authGroups: ["authGroups", "authGroups"],
      name: "name",
      userId: "userId",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Delete a user
 * Delete a user by ID
 *
 * body DeleteUser
 * no response value expected for this operation
 **/
export function authUserDeletePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Get user by ID
 * Retrieve user by ID
 *
 * body User_read_body
 * returns User
 **/
export function authUserReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      authGroups: ["authGroups", "authGroups"],
      name: "name",
      userId: "userId",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Update user by ID
 * Update user details by ID
 *
 * body UpdateUser
 * no response value expected for this operation
 **/
export function authUserUpdatePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Get all users
 * Retrieve all users
 *
 * body ReadPaginationFilter
 * returns inline_response_200_2
 **/
export function authUsersReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      totalUsers: 0,
      users: [
        {
          authGroups: ["authGroups", "authGroups"],
          name: "name",
          userId: "userId",
        },
        {
          authGroups: ["authGroups", "authGroups"],
          name: "name",
          userId: "userId",
        },
      ],
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Create a new dashboard
 * Create a new dashboard with properties, auth group, folder, and owner
 *
 * body NewDashboard
 * returns Dashboard
 **/
export const  dashboardCreatePOST = async (body) => {
  await dashboardCreate();
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      owner: "owner",
      folder: "folder",
      name: "name",
      id: "id",
      state: {},
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Delete a dashboard
 * Delete a dashboard by ID
 *
 * body DeleteDashboard
 * no response value expected for this operation
 **/
export function dashboardDeletePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Create a new dashboard state
 * Create a new dashboard state with name and state information
 *
 * body Auth_create_body
 * returns DashboardAuthGroup
 **/
export function dashboardGroupAuthCreatePOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      authGroups: {
        read: ["read", "read"],
        create: ["create", "create"],
        update: ["update", "update"],
        delete: ["delete", "delete"],
      },
      dashboardId: "dashboardId",
      dashboardName: "dashboardName",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Delete group from dashboard
 * Create a new dashboard state with name and state information
 *
 * body Auth_delete_body
 * returns auth_delete_body
 **/
export function dashboardGroupAuthDeletePOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      authGroups: {
        read: ["read", "read"],
        create: ["create", "create"],
        update: ["update", "update"],
        delete: ["delete", "delete"],
      },
      dashboardId: "dashboardId",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Create a new dashboard state
 * Create a new dashboard state with name and state information
 *
 * body Auth_read_body
 * returns DashboardAuthGroup
 **/
export function dashboardGroupAuthReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      authGroups: {
        read: ["read", "read"],
        create: ["create", "create"],
        update: ["update", "update"],
        delete: ["delete", "delete"],
      },
      dashboardId: "dashboardId",
      dashboardName: "dashboardName",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Create a new dashboard state
 * Create a new dashboard state with name and state information
 *
 * body Auth_update_body
 * returns DashboardAuthGroup
 **/
export function dashboardGroupAuthUpdatePOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      authGroups: {
        read: ["read", "read"],
        create: ["create", "create"],
        update: ["update", "update"],
        delete: ["delete", "delete"],
      },
      dashboardId: "dashboardId",
      dashboardName: "dashboardName",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Get dashboard by id
 * Retrieve dashboard by id
 *
 * body Dashboard_read_body
 * returns Dashboard
 **/
export function dashboardReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      owner: "owner",
      folder: "folder",
      name: "name",
      id: "id",
      state: {},
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Update dashboard by ID
 * Update dashboard properties, auth group, folder, and owner by ID
 *
 * body UpdateDashboard
 * no response value expected for this operation
 **/
export function dashboardUpdatePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Get all dashboards
 * Retrieve all dashboards with pagination and search
 *
 * body ReadPaginationFilter
 * returns inline_response_200
 **/
export function dashboardsReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      totalDashboards: 0,
      dashboards: [
        {
          owner: "owner",
          folder: "folder",
          name: "name",
          id: "id",
        },
        {
          owner: "owner",
          folder: "folder",
          name: "name",
          id: "id",
        },
      ],
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 *
 * body AgGridInput  (optional)
 * returns agGridOutput
 **/
export function getTableData(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      totalAvailable: 1,
      records: ["records", "records"],
      from: 0,
      to: 6,
      type: "type",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 *
 * returns DataRoot
 **/
export function menuPOST() {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      path: "path",
      children: [
        {
          path: "path",
          children: [null, null],
          name: "name",
          id: "id",
          type: "type",
        },
        {
          path: "path",
          children: [null, null],
          name: "name",
          id: "id",
          type: "type",
        },
      ],
      name: "name",
      id: "id",
      type: "type",
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Create a new table
 * Create a new table with properties and associated columns
 *
 * body NewTable  (optional)
 * returns Table
 **/
export function tableCreatePOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      name: "name",
      tableId: "tableId",
      cols: [
        {
          filter: true,
          headerName: "headerName",
          field: "field",
          name: "name",
          id: "id",
          sortable: true,
        },
        {
          filter: true,
          headerName: "headerName",
          field: "field",
          name: "name",
          id: "id",
          sortable: true,
        },
      ],
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Create a new row
 * Create a new row data, by using key/value pair for each column.
 *
 * body NewTableRow
 * no response value expected for this operation
 **/
export function tableDataCreatePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Update a row
 * Update a row data, by using key/value pair for each column.
 *
 * body DeleteTableRow
 * no response value expected for this operation
 **/
export function tableDataDeletePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Update a row
 * Update a row data, by using key/value pair for each column.
 *
 * body UpdateTableRow
 * no response value expected for this operation
 **/
export function tableDataUpdatePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Delete a table
 * Delete a table by ID
 *
 * body DeleteTable
 * no response value expected for this operation
 **/
export function tableDeletePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Get table by id
 * Get table by id
 *
 * body GetTable
 * returns Table
 **/
export function tableReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      name: "name",
      tableId: "tableId",
      cols: [
        {
          filter: true,
          headerName: "headerName",
          field: "field",
          name: "name",
          id: "id",
          sortable: true,
        },
        {
          filter: true,
          headerName: "headerName",
          field: "field",
          name: "name",
          id: "id",
          sortable: true,
        },
      ],
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}

/**
 * Update table by ID
 * Update table properties and associated columns by ID
 *
 * body UpdateTable
 * no response value expected for this operation
 **/
export function tableUpdatePOST(body) {
  return new Promise((resolve, reject) => {
    resolve("");
  });
}

/**
 * Get all tables
 * Retrieve all tables with pagination and search
 *
 * body ReadPaginationFilter
 * returns GetTablesResponse
 **/
export function tablesReadPOST(body) {
  return new Promise((resolve, reject) => {
    const examples = {};
    examples["application/json"] = {
      tables: [
        {
          name: "name",
          tableId: "tableId",
          cols: [
            {
              filter: true,
              headerName: "headerName",
              field: "field",
              name: "name",
              id: "id",
              sortable: true,
            },
            {
              filter: true,
              headerName: "headerName",
              field: "field",
              name: "name",
              id: "id",
              sortable: true,
            },
          ],
        },
        {
          name: "name",
          tableId: "tableId",
          cols: [
            {
              filter: true,
              headerName: "headerName",
              field: "field",
              name: "name",
              id: "id",
              sortable: true,
            },
            {
              filter: true,
              headerName: "headerName",
              field: "field",
              name: "name",
              id: "id",
              sortable: true,
            },
          ],
        },
      ],
      totalTables: 0,
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve("");
    }
  });
}
