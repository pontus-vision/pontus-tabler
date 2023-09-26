import * as utils from '../utils/writer.js';
import * as Default from '../service/DefaultService';

export async function authGroupCreatePOST(req, res, next, body) {
  try {
    const response = await Default.authGroupCreatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authGroupDeletePOST(req, res, next, body) {
  try {
    const response = await Default.authGroupDeletePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authGroupReadPOST(req, res, next, body) {
  try {
    const response = await Default.authGroupReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authGroupUpdatePOST(req, res, next, body) {
  try {
    const response = await Default.authGroupUpdatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authGroupsReadPOST(req, res, next, body) {
  try {
    const response = await Default.authGroupsReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authUserCreatePOST(req, res, next, body) {
  try {
    const response = await Default.authUserCreatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authUserDeletePOST(req, res, next, body) {
  try {
    const response = await Default.authUserDeletePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authUserReadPOST(req, res, next, body) {
  try {
    const response = await Default.authUserReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authUserUpdatePOST(req, res, next, body) {
  try {
    const response = await Default.authUserUpdatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function authUsersReadPOST(req, res, next, body) {
  try {
    const response = await Default.authUsersReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardCreatePOST(req, res, next, body) {
  try {
    const response = await Default.dashboardCreatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardDeletePOST(req, res, next, body) {
  try {
    const response = await Default.dashboardDeletePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardGroupAuthCreatePOST(req, res, next, body) {
  try {
    const response = await Default.dashboardGroupAuthCreatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardGroupAuthDeletePOST(req, res, next, body) {
  try {
    const response = await Default.dashboardGroupAuthDeletePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardGroupAuthReadPOST(req, res, next, body) {
  try {
    const response = await Default.dashboardGroupAuthReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardGroupAuthUpdatePOST(req, res, next, body) {
  try {
    const response = await Default.dashboardGroupAuthUpdatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardReadPOST(req, res, next, body) {
  try {
    const response = await Default.dashboardReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardUpdatePOST(req, res, next, body) {
  try {
    const response = await Default.dashboardUpdatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function dashboardsReadPOST(req, res, next, body) {
  try {
    const response = await Default.dashboardsReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function getTableData(req, res, next, body) {
  try {
    const response = await Default.getTableData(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function menuPOST(req, res, next) {
  try {
    const response = await Default.menuPOST();
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function tableCreatePOST(req, res, next, body) {
  try {
    const response = await Default.tableCreatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function tableDataCreatePOST(req, res, next, body) {
  try {
    const response = await Default.tableDataCreatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function tableDataDeletePOST(req, res, next, body) {
  try {
    const response = await Default.tableDataDeletePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function tableDataUpdatePOST(req, res, next, body) {
  try {
    const response = await Default.tableDataUpdatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function tableDeletePOST(req, res, next, body) {
  try {
    const response = await Default.tableDeletePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function tableReadPOST(req, res, next, body) {
  try {
    const response = await Default.tableReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function tableUpdatePOST(req, res, next, body) {
  try {
    const response = await Default.tableUpdatePOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}

export async function tablesReadPOST(req, res, next, body) {
  try {
    const response = await Default.tablesReadPOST(body);
    utils.writeJson(res, response);
  } catch (error) {
    utils.writeJson(res, error);
  }
}
