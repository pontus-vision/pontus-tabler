'use strict';


/**
 * Create a new group
 * Create a new group with a name, parents, and symlinks
 *
 * body NewGroup 
 * returns authGroup
 **/
exports.authGroupCreatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "groupId" : "groupId",
  "name" : "name"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.authGroupDeletePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get group by ID
 * Retrieve group by id
 *
 * body Group_read_body 
 * returns authGroup
 **/
exports.authGroupReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "groupId" : "groupId",
  "name" : "name"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.authGroupUpdatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get all groups
 * Retrieve all groups
 *
 * body ReadPaginationFilter2 
 * returns inline_response_200_1
 **/
exports.authGroupsReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "authGroups" : [ {
    "groupId" : "groupId",
    "name" : "name"
  }, {
    "groupId" : "groupId",
    "name" : "name"
  } ],
  "totalGroups" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.authUserCreatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "authGroups" : [ "authGroups", "authGroups" ],
  "name" : "name",
  "userId" : "userId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.authUserDeletePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get user by ID
 * Retrieve user by ID
 *
 * body User_read_body 
 * returns User
 **/
exports.authUserReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "authGroups" : [ "authGroups", "authGroups" ],
  "name" : "name",
  "userId" : "userId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.authUserUpdatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get all users
 * Retrieve all users
 *
 * body ReadPaginationFilter2 
 * returns inline_response_200_2
 **/
exports.authUsersReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "totalUsers" : 0,
  "users" : [ {
    "authGroups" : [ "authGroups", "authGroups" ],
    "name" : "name",
    "userId" : "userId"
  }, {
    "authGroups" : [ "authGroups", "authGroups" ],
    "name" : "name",
    "userId" : "userId"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.dashboardCreatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "owner" : "owner",
  "folder" : "folder",
  "name" : "name",
  "id" : "id",
  "state" : { }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.dashboardDeletePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a new dashboard state
 * Create a new dashboard state with name and state information
 *
 * body Auth_create_body 
 * returns DashboardAuthGroup
 **/
exports.dashboardGroupAuthCreatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "authGroups" : {
    "read" : [ "read", "read" ],
    "create" : [ "create", "create" ],
    "update" : [ "update", "update" ],
    "delete" : [ "delete", "delete" ]
  },
  "dashboardId" : "dashboardId",
  "dashboardName" : "dashboardName"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.dashboardGroupAuthDeletePOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "authGroups" : {
    "read" : [ "read", "read" ],
    "create" : [ "create", "create" ],
    "update" : [ "update", "update" ],
    "delete" : [ "delete", "delete" ]
  },
  "dashboardId" : "dashboardId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.dashboardGroupAuthReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "authGroups" : {
    "read" : [ "read", "read" ],
    "create" : [ "create", "create" ],
    "update" : [ "update", "update" ],
    "delete" : [ "delete", "delete" ]
  },
  "dashboardId" : "dashboardId",
  "dashboardName" : "dashboardName"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.dashboardGroupAuthUpdatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "authGroups" : {
    "read" : [ "read", "read" ],
    "create" : [ "create", "create" ],
    "update" : [ "update", "update" ],
    "delete" : [ "delete", "delete" ]
  },
  "dashboardId" : "dashboardId",
  "dashboardName" : "dashboardName"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.dashboardReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "owner" : "owner",
  "folder" : "folder",
  "name" : "name",
  "id" : "id",
  "state" : { }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.dashboardUpdatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get all dashboards
 * Retrieve all dashboards with pagination and search
 *
 * body ReadPaginationFilter2 
 * returns inline_response_200
 **/
exports.dashboardsReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "totalDashboards" : 0,
  "dashboards" : [ {
    "owner" : "owner",
    "folder" : "folder",
    "name" : "name",
    "id" : "id"
  }, {
    "owner" : "owner",
    "folder" : "folder",
    "name" : "name",
    "id" : "id"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 *
 * body AgGridInput  (optional)
 * returns agGridOutput
 **/
exports.getTableData = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "totalAvailable" : 1,
  "records" : [ "records", "records" ],
  "from" : 0,
  "to" : 6,
  "type" : "type"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.tableCreatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "name" : "name",
  "tableId" : "tableId",
  "cols" : [ {
    "filter" : true,
    "headerName" : "headerName",
    "field" : "field",
    "name" : "name",
    "id" : "id",
    "sortable" : true
  }, {
    "filter" : true,
    "headerName" : "headerName",
    "field" : "field",
    "name" : "name",
    "id" : "id",
    "sortable" : true
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.tableDataCreatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update a row
 * Update a row data, by using key/value pair for each column.
 *
 * body DeleteTableRow 
 * no response value expected for this operation
 **/
exports.tableDataDeletePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update a row
 * Update a row data, by using key/value pair for each column.
 *
 * body UpdateTableRow 
 * no response value expected for this operation
 **/
exports.tableDataUpdatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Delete a table
 * Delete a table by ID
 *
 * body DeleteTable 
 * no response value expected for this operation
 **/
exports.tableDeletePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get table by id
 * Get table by id
 *
 * body GetTable 
 * returns Table
 **/
exports.tableReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "name" : "name",
  "tableId" : "tableId",
  "cols" : [ {
    "filter" : true,
    "headerName" : "headerName",
    "field" : "field",
    "name" : "name",
    "id" : "id",
    "sortable" : true
  }, {
    "filter" : true,
    "headerName" : "headerName",
    "field" : "field",
    "name" : "name",
    "id" : "id",
    "sortable" : true
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
exports.tableUpdatePOST = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get all tables
 * Retrieve all tables with pagination and search
 *
 * body ReadPaginationFilter2 
 * returns GetTablesResponse
 **/
exports.tablesReadPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "tables" : [ {
    "name" : "name",
    "tableId" : "tableId",
    "cols" : [ {
      "filter" : true,
      "headerName" : "headerName",
      "field" : "field",
      "name" : "name",
      "id" : "id",
      "sortable" : true
    }, {
      "filter" : true,
      "headerName" : "headerName",
      "field" : "field",
      "name" : "name",
      "id" : "id",
      "sortable" : true
    } ]
  }, {
    "name" : "name",
    "tableId" : "tableId",
    "cols" : [ {
      "filter" : true,
      "headerName" : "headerName",
      "field" : "field",
      "name" : "name",
      "id" : "id",
      "sortable" : true
    }, {
      "filter" : true,
      "headerName" : "headerName",
      "field" : "field",
      "name" : "name",
      "id" : "id",
      "sortable" : true
    } ]
  } ],
  "totalTables" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

