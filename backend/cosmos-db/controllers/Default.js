'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.authGroupCreatePOST = function authGroupCreatePOST (req, res, next, body) {
  Default.authGroupCreatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authGroupDeletePOST = function authGroupDeletePOST (req, res, next, body) {
  Default.authGroupDeletePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authGroupReadPOST = function authGroupReadPOST (req, res, next, body) {
  Default.authGroupReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authGroupUpdatePOST = function authGroupUpdatePOST (req, res, next, body) {
  Default.authGroupUpdatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authGroupsReadPOST = function authGroupsReadPOST (req, res, next, body) {
  Default.authGroupsReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authUserCreatePOST = function authUserCreatePOST (req, res, next, body) {
  Default.authUserCreatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authUserDeletePOST = function authUserDeletePOST (req, res, next, body) {
  Default.authUserDeletePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authUserReadPOST = function authUserReadPOST (req, res, next, body) {
  Default.authUserReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authUserUpdatePOST = function authUserUpdatePOST (req, res, next, body) {
  Default.authUserUpdatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authUsersReadPOST = function authUsersReadPOST (req, res, next, body) {
  Default.authUsersReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardCreatePOST = function dashboardCreatePOST (req, res, next, body) {
  Default.dashboardCreatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardDeletePOST = function dashboardDeletePOST (req, res, next, body) {
  Default.dashboardDeletePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardGroupAuthCreatePOST = function dashboardGroupAuthCreatePOST (req, res, next, body) {
  Default.dashboardGroupAuthCreatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardGroupAuthDeletePOST = function dashboardGroupAuthDeletePOST (req, res, next, body) {
  Default.dashboardGroupAuthDeletePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardGroupAuthReadPOST = function dashboardGroupAuthReadPOST (req, res, next, body) {
  Default.dashboardGroupAuthReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardGroupAuthUpdatePOST = function dashboardGroupAuthUpdatePOST (req, res, next, body) {
  Default.dashboardGroupAuthUpdatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardReadPOST = function dashboardReadPOST (req, res, next, body) {
  Default.dashboardReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardUpdatePOST = function dashboardUpdatePOST (req, res, next, body) {
  Default.dashboardUpdatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dashboardsReadPOST = function dashboardsReadPOST (req, res, next, body) {
  Default.dashboardsReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTableData = function getTableData (req, res, next, body) {
  Default.getTableData(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.menuPOST = function menuPOST (req, res, next) {
  Default.menuPOST()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.tableCreatePOST = function tableCreatePOST (req, res, next, body) {
  Default.tableCreatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.tableDataCreatePOST = function tableDataCreatePOST (req, res, next, body) {
  Default.tableDataCreatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.tableDataDeletePOST = function tableDataDeletePOST (req, res, next, body) {
  Default.tableDataDeletePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.tableDataUpdatePOST = function tableDataUpdatePOST (req, res, next, body) {
  Default.tableDataUpdatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.tableDeletePOST = function tableDeletePOST (req, res, next, body) {
  Default.tableDeletePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.tableReadPOST = function tableReadPOST (req, res, next, body) {
  Default.tableReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.tableUpdatePOST = function tableUpdatePOST (req, res, next, body) {
  Default.tableUpdatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.tablesReadPOST = function tablesReadPOST (req, res, next, body) {
  Default.tablesReadPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
