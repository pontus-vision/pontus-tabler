import ResultSet from "./resultset.js";
import Connection from "./connection.js";
import Jinst from "./jinst.js";

const java = Jinst.getInstance();

enum RowIdLifetime {
  ROWID_UNSUPPORTED = 0, // The database does not support ROWIDs
  ROWID_VALID_FOREVER = 1, // The ROWID is valid forever
  ROWID_VALID_SESSION = 2, // The ROWID is valid for the duration of the session
  ROWID_VALID_TRANSACTION = 3, // The ROWID is valid for the duration of the transaction
  ROWID_VALID_OTHER = 4, // The ROWID is valid for some other duration
}
interface IDatabaseMetaData {
  getSchemas(
    catalog?: string | null,
    schemaPattern?: string | null
  ): Promise<ResultSet>;
  getTables(
    catalog?: string | null,
    schemaPattern?: string | null,
    tableNamePattern?: string | null,
    types?: string[] | null
  ): Promise<ResultSet>;
  // allProceduresAreCallable: (
  //   callback: (err: Error | null, result: any) => void
  // ) => void;
  // Define more methods here as needed
}

class DatabaseMetaData implements IDatabaseMetaData {
  private _dbm: any;

  constructor(dbm: any) {
    this._dbm = dbm;
  }

  static async initialize() {
    const staticAttrs = [
      "attributeNoNulls",
      "attributeNullable",
      "attributeNullableUnknown",
      "bestRowNotPseudo",
      // Add all other static fields as needed
    ];

    for (const attr of staticAttrs) {
      (DatabaseMetaData as any)[attr] = await java.getStaticFieldValue(
        "java.sql.DatabaseMetaData",
        attr
      );
    }
  }

  async getSchemas(
    catalog: string | null = null,
    schemaPattern: string | null = null
  ): Promise<ResultSet> {
    if (catalog !== null && typeof catalog !== 'string') {
      throw new Error("INVALID_ARGUMENTS: catalog must be a string or null.");
    }
    if (schemaPattern !== null && typeof schemaPattern !== 'string') {
      throw new Error(
        "INVALID_ARGUMENTS: schemaPattern must be a string or null."
      );
    }

    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.getSchemasSync(catalog, schemaPattern));
      } catch (error) {
        reject(reject)
      }
    });
  }

  async getTables(
    catalog: string | null = null,
    schemaPattern: string | null = null,
    tableNamePattern: string | null = null,
    types: string[] | null = null
  ): Promise<ResultSet> {
    if (catalog !== null && typeof catalog !== 'string') {
      throw new Error("INVALID_ARGUMENTS: catalog must be a string or null.");
    }
    if (schemaPattern !== null && typeof schemaPattern !== 'string') {
      throw new Error(
        "INVALID_ARGUMENTS: schemaPattern must be a string or null."
      );
    }
    if (tableNamePattern !== null && typeof tableNamePattern !== 'string') {
      throw new Error(
        "INVALID_ARGUMENTS: tableNamePattern must be a string or null."
      );
    }
    if (types !== null && !Array.isArray(types)) {
      throw new Error("INVALID_ARGUMENTS: types must be an array or null.");
    }
    if (Array.isArray(types)) {
      for (const type of types) {
        if (typeof type !== 'string') {
          throw new Error(
            "INVALID_ARGUMENTS: all elements in types array must be strings."
          );
        }
      }
    }

    return new Promise((resolve, reject) => {
      try {  
        resolve(this._dbm.getTablesSync(catalog, schemaPattern, tableNamePattern, types));
      } catch (error) {
        reject(error)
      }
    });
  }

  async allProceduresAreCallable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.allProceduresAreCallableSync());
      } catch (error) {
        reject(error)
      }
    });
  }

  async allTablesAreSelectable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.allTablesAreSelectableSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async autoCommitFailureClosesAllResultSets(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.autoCommitFailureClosesAllResultSetsSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async dataDefinitionCausesTransactionCommit(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.dataDefinitionCausesTransactionCommitSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async dataDefinitionIgnoredInTransactions(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.dataDefinitionIgnoredInTransactionsSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async deletesAreDetected(type: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!Number.isInteger(type)) {
        return reject(new Error("INVALID ARGUMENTS"));
      }
      try {
        resolve(this._dbm.deletesAreDetectedSync(type));
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async doesMaxRowSizeIncludeBlobs(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.doesMaxRowSizeIncludeBlobsSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of generatedKeyAlwaysReturned
  async generatedKeyAlwaysReturned(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.generatedKeyAlwaysReturnedSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of getAttributes
  async getAttributes(
    catalog: string | null | undefined,
    schemaPattern: string | null | undefined,
    typeNamePattern: string | null | undefined,
    attributeNamePattern: string | null | undefined
  ): Promise<ResultSet> {
    return new Promise((resolve, reject) => {
      if (
        (catalog === null || catalog === undefined || typeof catalog === "string") &&
        (schemaPattern === null || schemaPattern === undefined || typeof schemaPattern === "string") &&
        (typeNamePattern === null || typeNamePattern === undefined || typeof typeNamePattern === "string") &&
        (attributeNamePattern === null || attributeNamePattern === undefined || typeof attributeNamePattern === "string")
      ) {
        try {
          resolve(new ResultSet(this._dbm.getAttributesSync(catalog, schemaPattern, typeNamePattern, attributeNamePattern)));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("INVALID ARGUMENTS"));
      }
    });
  }
  
  // Promisified version of getBestRowIdentifier
  async getBestRowIdentifier(
    catalog: string | null | undefined,
    schema: string | null | undefined,
    table: string,
    scope: number,
    nullable: boolean
  ): Promise<ResultSet> {
    return new Promise((resolve, reject) => {
      if (
        (catalog === null || catalog === undefined || typeof catalog === "string") &&
        (schema === null || schema === undefined || typeof schema === "string") &&
        typeof table === "string" &&
        Number.isInteger(scope) &&
        typeof nullable === "boolean"
      ) {
        try {
          resolve(new ResultSet(this._dbm.getBestRowIdentifierSync(catalog, schema, table, scope, nullable)));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("INVALID ARGUMENTS"));
      }
    });
  }
  
  // Promisified version of getCatalogs
  async getCatalogs(): Promise<ResultSet> {
    return new Promise((resolve, reject) => {
      try {
        resolve(new ResultSet(this._dbm.getCatalogsSync()));
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of getCatalogSeparator
  async getCatalogSeparator(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.getCatalogSeparatorSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of getCatalogTerm
  async getCatalogTerm(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.getCatalogTermSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of getClientInfoProperties
  async getClientInfoProperties(): Promise<ResultSet> {
    return new Promise((resolve, reject) => {
      try {
        resolve(new ResultSet(this._dbm.getClientInfoPropertiesSync()));
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of getColumnPrivileges
  async getColumnPrivileges(
    catalog: string | null | undefined,
    schema: string | null | undefined,
    table: string,
    columnNamePattern: string | null | undefined
  ): Promise<ResultSet> {
    return new Promise((resolve, reject) => {
      if (
        (catalog === null || catalog === undefined || typeof catalog === "string") &&
        (schema === null || schema === undefined || typeof schema === "string") &&
        typeof table === "string" &&
        (columnNamePattern === null || columnNamePattern === undefined || typeof columnNamePattern === "string")
      ) {
        try {
          resolve(new ResultSet(this._dbm.getColumnPrivilegesSync(catalog, schema, table, columnNamePattern)));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("INVALID ARGUMENTS"));
      }
    });
  }
  
  // Promisified version of getColumns
  async getColumns(
    catalog: string | null | undefined,
    schemaPattern: string | null | undefined,
    tableNamePattern: string | null | undefined,
    columnNamePattern: string | null | undefined
  ): Promise<ResultSet> {
    return new Promise((resolve, reject) => {
      if (
        (catalog === null || catalog === undefined || typeof catalog === "string") &&
        (schemaPattern === null || schemaPattern === undefined || typeof schemaPattern === "string") &&
        (tableNamePattern === null || tableNamePattern === undefined || typeof tableNamePattern === "string") &&
        (columnNamePattern === null || columnNamePattern === undefined || typeof columnNamePattern === "string")
      ) {
        try {
          resolve(new ResultSet(this._dbm.getColumnsSync(catalog, schemaPattern, tableNamePattern, columnNamePattern)));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("INVALID ARGUMENTS"));
      }
    });
  }
  
  // Promisified version of getConnection
  async getConnection(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      try {
        resolve(new Connection(this._dbm.getConnectionSync()));
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async getCrossReference(
    parentCatalog: string | null | undefined,
    parentSchema: string | null | undefined,
    parentTable: string,
    foreignCatalog: string | null | undefined,
    foreignSchema: string | null | undefined,
    foreignTable: string
  ): Promise<ResultSet> {
    return new Promise((resolve, reject) => {
      if (
        (parentCatalog === null || typeof parentCatalog === "string") &&
        (parentSchema === null || typeof parentSchema === "string") &&
        typeof parentTable === "string" &&
        (foreignCatalog === null || typeof foreignCatalog === "string") &&
        (foreignSchema === null || typeof foreignSchema === "string") &&
        typeof foreignTable === "string"
      ) {
        try {
          resolve(new ResultSet(this._dbm.getCrossReferenceSync(parentCatalog, parentSchema, parentTable, foreignCatalog, foreignSchema, foreignTable)));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("INVALID ARGUMENTS"));
      }
    });
  }
  
  // Promisified version of getDatabaseMajorVersion
  async getDatabaseMajorVersion(): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.getDatabaseMajorVersionSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of getDatabaseMinorVersion
  async getDatabaseMinorVersion(): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.getDatabaseMinorVersionSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of getDatabaseProductName
  async getDatabaseProductName(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.getDatabaseProductNameSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Promisified version of getDatabaseProductVersion
  async getDatabaseProductVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this._dbm.getDatabaseProductVersionSync());
      } catch (error) {
        reject(error);
      }
    });
  }
  

// Promisified version of getDefaultTransactionIsolation
async getDefaultTransactionIsolation(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getDefaultTransactionIsolationSync());
    } catch (error) {
      reject(error);
    }
  });
}

// Promisified version of getDriverMajorVersion
async getDriverMajorVersion(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getDriverMajorVersionSync());
    } catch (error) {
      reject(error);
    }
  });
}

// Promisified version of getDriverMinorVersion
async getDriverMinorVersion(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getDriverMinorVersionSync());
    } catch (error) {
      reject(error);
    }
  });
}

// Promisified version of getDriverName
async getDriverName(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getDriverNameSync());
    } catch (error) {
      reject(error);
    }
  });
}

// Promisified version of getDriverVersion
async getDriverVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getDriverVersionSync());
    } catch (error) {
      reject(error);
    }
  });
}

// Promisified version of getExportedKeys
async getExportedKeys(
  catalog: string | null,
  schema: string | null,
  table: string
): Promise<ResultSet> {
  const validParams =
    (catalog === null || catalog === undefined || typeof catalog === "string") &&
    (schema === null || schema === undefined || typeof schema === "string") &&
    typeof table === "string";

  if (!validParams) {
    throw new Error("INVALID ARGUMENTS");
  }

  return new Promise((resolve, reject) => {
    try {
      resolve(new ResultSet(this._dbm.getExportedKeysSync(catalog, schema, table)));
    } catch (error) {
      reject(error);
    }
  });
}

// Promisified version of getExtraNameCharacters
async getExtraNameCharacters(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getExtraNameCharactersSync());
    } catch (error) {
      reject(error);
    }
  });
}

// Promisified version of getFunctionColumns
async getFunctionColumns(
  catalog: string | null,
  schemaPattern: string | null,
  functionNamePattern: string | null,
  columnNamePattern: string | null
): Promise<ResultSet> {
  const validParams =
    (catalog === null || catalog === undefined || typeof catalog === "string") &&
    (schemaPattern === null || schemaPattern === undefined || typeof schemaPattern === "string") &&
    (functionNamePattern === null || functionNamePattern === undefined || typeof functionNamePattern === "string") &&
    (columnNamePattern === null || columnNamePattern === undefined || typeof columnNamePattern === "string");

  if (!validParams) {
    throw new Error("INVALID ARGUMENTS");
  }

  return new Promise((resolve, reject) => {
    try {
      resolve(
        new ResultSet(
          this._dbm.getFunctionColumnsSync(
            catalog,
            schemaPattern,
            functionNamePattern,
            columnNamePattern
          )
        )
      );
    } catch (error) {
      reject(error);
    }
  });
}

// Promisified version of getFunctions
async getFunctions(
  catalog: string | null,
  schemaPattern: string | null,
  functionNamePattern: string | null
): Promise<ResultSet> {
  const validParams =
    (catalog === null || catalog === undefined || typeof catalog === "string") &&
    (schemaPattern === null || schemaPattern === undefined || typeof schemaPattern === "string") &&
    (functionNamePattern === null || functionNamePattern === undefined || typeof functionNamePattern === "string");

  if (!validParams) {
    throw new Error("INVALID ARGUMENTS");
  }

  return new Promise((resolve, reject) => {
    try {
      resolve(
        new ResultSet(
          this._dbm.getFunctionsSync(catalog, schemaPattern, functionNamePattern)
        )
      );
    } catch (error) {
      reject(error);
    }
  });
}

async getIdentifierQuoteString(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getIdentifierQuoteStringSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getImportedKeys(
  catalog: string | null,
  schema: string | null,
  table: string
): Promise<ResultSet> {
  const validParams =
    (catalog === null || typeof catalog === "string") &&
    (schema === null || typeof schema === "string") &&
    typeof table === "string";

  if (!validParams) {
    throw new Error("INVALID ARGUMENTS");
  }

  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getImportedKeysSync(catalog, schema, table);
      resolve(new ResultSet(result));
    } catch (error) {
      reject(error);
    }
  });
}

async getIndexInfo(
  catalog: string | null,
  schema: string | null,
  table: string,
  unique: boolean,
  approximate: boolean
): Promise<ResultSet> {
  const validParams =
    (catalog === null || typeof catalog === "string") &&
    (schema === null || typeof schema === "string") &&
    typeof table === "string" &&
    typeof unique === "boolean" &&
    typeof approximate === "boolean";

  if (!validParams) {
    throw new Error("INVALID ARGUMENTS");
  }

  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getIndexInfoSync(catalog, schema, table, unique, approximate);
      resolve(new ResultSet(result));
    } catch (error) {
      reject(error);
    }
  });
}

async getJDBCMajorVersion(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getJDBCMajorVersionSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getJDBCMinorVersion(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getJDBCMinorVersionSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxBinaryLiteralLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxBinaryLiteralLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}


async getMaxCatalogNameLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxCatalogNameLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxCharLiteralLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxCharLiteralLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxColumnNameLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxColumnNameLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxColumnsInGroupBy(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxColumnsInGroupBySync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxColumnsInIndex(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxColumnsInIndexSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxColumnsInOrderBy(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxColumnsInOrderBySync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxColumnsInSelect(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxColumnsInSelectSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxColumnsInTable(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxColumnsInTableSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxConnections(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxConnectionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxCursorNameLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxCursorNameLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxIndexLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxIndexLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxProcedureNameLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxProcedureNameLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxRowSize(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxRowSizeSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxSchemaNameLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxSchemaNameLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxStatementLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxStatementLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxStatements(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxStatementsSync());
    } catch (error) {
      reject(error);
    }
  });
}

async getMaxTableNameLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxTableNameLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves the maximum number of tables this database allows in a SELECT statement.
 *
 * @returns A promise that resolves to the maximum number of tables allowed in a SELECT statement.
 */
async getMaxTablesInSelect(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxTablesInSelectSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves the maximum number of characters allowed in a user name.
 *
 * @returns A promise that resolves to the maximum number of characters allowed for a user name.
 */
async getMaxUserNameLength(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getMaxUserNameLengthSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a comma-separated list of math functions available with this database.
 *
 * @returns A promise that resolves to the list of math functions supported by this database.
 */
async getNumericFunctions(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getNumericFunctionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of the given table's primary key columns.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param table - A table name; must match the table name as it is stored in this database
 * @returns A promise that resolves to a ResultSet describing the primary key columns of the table.
 */
async getPrimaryKeys(catalog: string | null, schema: string | null, table: string): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    try {
      resolve(new ResultSet(this._dbm.getPrimaryKeysSync(catalog, schema, table)));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of the given catalog's stored procedure parameter and result columns.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param procedureNamePattern - A procedure name pattern; must match the procedure name as it is stored in the database; "" retrieves those without a procedure; null means that the procedure name should not be used to narrow the search
 * @param columnNamePattern - A column name pattern; must match the column name as it is stored in the database; "" retrieves those without a column; null means that the column name should not be used to narrow the search
 * @returns A promise that resolves to a ResultSet describing the procedure columns.
 */
async getProcedureColumns(catalog: string | null, schemaPattern: string | null, procedureNamePattern: string | null, columnNamePattern: string | null): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    try {
      resolve(new ResultSet(this._dbm.getProcedureColumnsSync(catalog, schemaPattern, procedureNamePattern, columnNamePattern)));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of the stored procedures available in the given catalog.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param procedureNamePattern - A procedure name pattern; must match the procedure name as it is stored in the database; "" retrieves those without a procedure; null means that the procedure name should not be used to narrow the search
 * @returns A promise that resolves to a ResultSet describing the procedures.
 */
async getProcedures(catalog: string | null, schemaPattern: string | null, procedureNamePattern: string | null): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    try {
      resolve(new ResultSet(this._dbm.getProceduresSync(catalog, schemaPattern, procedureNamePattern)));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves the database vendor's preferred term for "procedure".
 *
 * @returns A promise that resolves to the database vendor's preferred term for "procedure".
 */
async getProcedureTerm(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getProcedureTermSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of the pseudo or hidden columns available in a given table.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param tableNamePattern - A table name pattern; must match the table name as it is stored in this database; "" retrieves those without a table; null means that the table name should not be used to narrow the search
 * @param columnNamePattern - A column name pattern; must match the column name as it is stored in the database; "" retrieves those without a column; null means that the column name should not be used to narrow the search
 * @returns A promise that resolves to a ResultSet describing the pseudo columns.
 */
async getPseudoColumns(catalog: string | null, schemaPattern: string | null, tableNamePattern: string | null, columnNamePattern: string | null): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    try {
      resolve(new ResultSet(this._dbm.getPseudoColumnsSync(catalog, schemaPattern, tableNamePattern, columnNamePattern)));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves this database's default holdability for ResultSet objects.
 *
 * @returns A promise that resolves to the database's default holdability for ResultSet objects.
 */
async getResultSetHoldability(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getResultSetHoldabilitySync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Indicates whether this data source supports the SQL ROWID type.
 *
 * @returns A promise that resolves to the RowIdLifetime indicating if the data source supports the SQL ROWID type.
 */
async getRowIdLifetime(): Promise<RowIdLifetime> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getRowIdLifetimeSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves the database vendor's preferred term for "schema".
 *
 * @returns A promise that resolves to the database vendor's preferred term for "schema".
 */
async getSchemaTerm(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getSchemaTermSync());
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Retrieves the string that can be used to escape wildcard characters.
 *
 * @returns A promise that resolves to the string used to escape wildcard characters.
 */
async getSearchStringEscape(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getSearchStringEscapeSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a comma-separated list of this database's SQL keywords.
 *
 * @returns A promise that resolves to the comma-separated list of SQL keywords.
 */
async getSQLKeywords(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getSQLKeywordsSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves the type of SQLSTATE returned by SQLException.getSQLState.
 *
 * @returns A promise that resolves to the type of SQLSTATE.
 */
async getSQLStateType(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getSQLStateTypeSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a comma-separated list of string functions available in this database.
 *
 * @returns A promise that resolves to the comma-separated list of string functions.
 */
async getStringFunctions(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getStringFunctionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of table hierarchies in a particular schema.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param tableNamePattern - A table name pattern; must match the table name as it is stored in this database; "" retrieves those without a table; null means that the table name should not be used to narrow the search
 * @returns A promise that resolves to a ResultSet describing the table hierarchies.
 */
async getSuperTables(
  catalog: string | null,
  schemaPattern: string | null,
  tableNamePattern: string | null
): Promise<ResultSet> {
  const validParams =
    (catalog === null ||
      catalog === undefined ||
      typeof catalog === "string") &&
    (schemaPattern === null ||
      schemaPattern === undefined ||
      typeof schemaPattern === "string") &&
    (tableNamePattern === null ||
      tableNamePattern === undefined ||
      typeof tableNamePattern === "string");

  if (!validParams) {
    return Promise.reject(new Error("INVALID ARGUMENTS"));
  }

  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getSuperTablesSync(
        catalog,
        schemaPattern,
        tableNamePattern
      );
      resolve(new ResultSet(result));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of user-defined type (UDT) hierarchies in a schema.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param typeNamePattern - A type name pattern; must match the type name as it is stored in this database; "" retrieves those without a type; null means that the type name should not be used to narrow the search
 * @returns A promise that resolves to a ResultSet describing the UDT hierarchies.
 */
async getSuperTypes(
  catalog: string | null,
  schemaPattern: string | null,
  typeNamePattern: string | null
): Promise<ResultSet> {
  const validParams =
    (catalog === null ||
      catalog === undefined ||
      typeof catalog === "string") &&
    (schemaPattern === null ||
      schemaPattern === undefined ||
      typeof schemaPattern === "string") &&
    (typeNamePattern === null ||
      typeNamePattern === undefined ||
      typeof typeNamePattern === "string");

  if (!validParams) {
    return Promise.reject(new Error("INVALID ARGUMENTS"));
  }

  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getSuperTypesSync(
        catalog,
        schemaPattern,
        typeNamePattern
      );
      resolve(new ResultSet(result));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a comma-separated list of system functions available in this database.
 *
 * @returns A promise that resolves to the comma-separated list of system functions.
 */
async getSystemFunctions(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getSystemFunctionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of the privileges defined for a table.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schemaPattern - A schema pattern; must match the schema name as it is stored in this database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param tableNamePattern - A table name pattern; must match the table name as it is stored in this database; "" retrieves those without a table; null means that the table name should not be used to narrow the search
 * @returns A promise that resolves to a ResultSet describing the table privileges.
 */
async getTablePrivileges(
  catalog: string | null,
  schemaPattern: string | null,
  tableNamePattern: string
): Promise<ResultSet> {
  const validParams =
    (catalog === null ||
      catalog === undefined ||
      typeof catalog === "string") &&
    (schemaPattern === null ||
      schemaPattern === undefined ||
      typeof schemaPattern === "string") &&
    typeof tableNamePattern === "string";

  if (!validParams) {
    return Promise.reject(new Error("INVALID ARGUMENTS"));
  }

  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getTablePrivilegesSync(
        catalog,
        schemaPattern,
        tableNamePattern
      );
      resolve(new ResultSet(result));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of the table types available in this database.
 *
 * @returns A promise that resolves to a ResultSet describing the table types.
 */
async getTableTypes(): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getTableTypesSync();
      resolve(new ResultSet(result));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a comma-separated list of time and date functions available in this database.
 *
 * @returns A promise that resolves to a comma-separated list of time and date functions.
 */
async getTimeDateFunctions(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      resolve(this._dbm.getTimeDateFunctionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves type information for the database.
 *
 * @returns A promise that resolves to a ResultSet describing the type information.
 */
async getTypeInfo(): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getTypeInfoSync();
      resolve(new ResultSet(result));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a description of user-defined types (UDTs) in a schema.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param typeNamePattern - A type name pattern; must match the type name as it is stored in this database; "" retrieves those without a type; null means that the type name should not be used to narrow the search
 * @param types - An array of type codes; null retrieves all types
 * @returns A promise that resolves to a ResultSet describing the UDTs.
 */
async getUDTs(
  catalog: string | null,
  schemaPattern: string | null,
  typeNamePattern: string | null,
  types: number[] | null
): Promise<ResultSet> {
  const validParams =
    (catalog === null ||
      catalog === undefined ||
      typeof catalog === "string") &&
    (schemaPattern === null ||
      schemaPattern === undefined ||
      typeof schemaPattern === "string") &&
    (typeNamePattern === null ||
      typeNamePattern === undefined ||
      typeof typeNamePattern === "string") &&
    (types === null ||
      types === undefined ||
      Array.isArray(types));

  if (!validParams) {
    return Promise.reject(new Error("INVALID ARGUMENTS"));
  }

  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getUDTsSync(
        catalog,
        schemaPattern,
        typeNamePattern,
        types
      );
      resolve(new ResultSet(result));
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves the URL of the database.
 *
 * @returns A promise that resolves to the database URL.
 */
async getURL(): Promise<string> {
  try {
    const result = await this._dbm.getURLSync();
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves the username associated with the database connection.
 *
 * @returns A promise that resolves to the username.
 */
getUserName(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.getUserNameSync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Retrieves version columns for a given table.
 *
 * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param schema - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param table - A table name; must match the table name as it is stored in this database
 * @returns A promise that resolves to a ResultSet describing the version columns.
 */
getVersionColumns(
  catalog: string | null,
  schema: string | null,
  table: string
): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    const validParams =
      (catalog === null ||
        catalog === undefined ||
        typeof catalog === "string") &&
      (schema === null ||
        schema === undefined ||
        typeof schema === "string") &&
      typeof table === "string";

    if (!validParams) {
      reject(new Error("INVALID ARGUMENTS"));
      return;
    }

    try {
      const result = this._dbm.getVersionColumnsSync(catalog, schema, table);
      resolve(new ResultSet(result));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if the database detects inserts.
 *
 * @param type - The type of insert to check
 * @returns A promise that resolves to a boolean indicating if inserts are detected.
 */
insertsAreDetected(type: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(type)) {
      reject(new Error("INVALID ARGUMENTS"));
      return;
    }

    try {
      const result = this._dbm.insertsAreDetectedSync(type);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if the catalog is at the start of the URL.
 *
 * @returns A promise that resolves to a boolean indicating if the catalog is at the start.
 */
isCatalogAtStart(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.isCatalogAtStartSync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if the database is read-only.
 *
 * @returns A promise that resolves to a boolean indicating if the database is read-only.
 */
isReadOnly(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.isReadOnlySync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if locators are updated when the database copy is updated.
 *
 * @returns A promise that resolves to a boolean indicating if locators are updated.
 */
locatorsUpdateCopy(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.locatorsUpdateCopySync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if adding a NULL to a non-NULL value results in NULL.
 *
 * @returns A promise that resolves to a boolean indicating if NULL plus non-NULL is NULL.
 */
nullPlusNonNullIsNull(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.nullPlusNonNullIsNullSync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if NULLs are sorted at the end.
 *
 * @returns A promise that resolves to a boolean indicating if NULLs are sorted at the end.
 */
nullsAreSortedAtEnd(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.nullsAreSortedAtEndSync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if NULLs are sorted at the start.
 *
 * @returns A promise that resolves to a boolean indicating if NULLs are sorted at the start.
 */
nullsAreSortedAtStart(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.nullsAreSortedAtStartSync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if NULLs are sorted high.
 *
 * @returns A promise that resolves to a boolean indicating if NULLs are sorted high.
 */
nullsAreSortedHigh(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.nullsAreSortedHighSync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if NULLs are sorted low.
 *
 * @returns A promise that resolves to a boolean indicating if NULLs are sorted low.
 */
nullsAreSortedLow(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const result = this._dbm.nullsAreSortedLowSync();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if other deletes are visible for a specific type.
 *
 * @param type - The type of visibility to check.
 * @returns A promise that resolves to a boolean indicating if other deletes are visible.
 */
othersDeletesAreVisible(type: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(type)) {
      reject(new Error("INVALID ARGUMENTS"));
      return;
    }

    try {
      const result = this._dbm.othersDeletesAreVisibleSync(type);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if other inserts are visible for a specific type.
 *
 * @param type - The type of visibility to check.
 * @returns A promise that resolves to a boolean indicating if other inserts are visible.
 */
othersInsertsAreVisible(type: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(type)) {
      reject(new Error("INVALID ARGUMENTS"));
      return;
    }

    try {
      const result = this._dbm.othersInsertsAreVisibleSync(type);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if other updates are visible for a specific type.
 *
 * @param type - The type of visibility to check.
 * @returns A promise that resolves to a boolean indicating if other updates are visible.
 */
othersUpdatesAreVisible(type: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(type)) {
      reject(new Error("INVALID ARGUMENTS"));
      return;
    }

    try {
      const result = this._dbm.othersUpdatesAreVisibleSync(type);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Checks if own deletes are visible for a specific type.
 *
 * @param type - The type of visibility to check.
 * @returns A promise that resolves to a boolean indicating if own deletes are visible.
 */
ownDeletesAreVisible(type: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (typeof type !== 'number') {
      reject(new Error("INVALID ARGUMENTS"));
      return;
    }

    try {
      const result = this._dbm.ownDeletesAreVisibleSync(type);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}


  ownInsertsAreVisible(type: number): Promise<boolean> {
    if (typeof type !== 'number') {
        throw new Error("INVALID ARGUMENTS");
    }
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.ownInsertsAreVisibleSync(type));
        } catch (err) {
            reject(err);
        }
    });
}

ownUpdatesAreVisible(type: number): Promise<boolean> {
    if (typeof type !== 'number') {
        throw new Error("INVALID ARGUMENTS");
    }
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.ownUpdatesAreVisibleSync(type));
        } catch (err) {
            reject(err);
        }
    });
}

storesLowerCaseIdentifiers(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.storesLowerCaseIdentifiersSync());
        } catch (err) {
            reject(err);
        }
    });
}

storesLowerCaseQuotedIdentifiers(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.storesLowerCaseQuotedIdentifiersSync());
        } catch (err) {
            reject(err);
        }
    });
}

storesMixedCaseIdentifiers(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.storesMixedCaseIdentifiersSync());
        } catch (err) {
            reject(err);
        }
    });
}

storesMixedCaseQuotedIdentifiers(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.storesMixedCaseQuotedIdentifiersSync());
        } catch (err) {
            reject(err);
        }
    });
}

storesUpperCaseIdentifiers(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.storesUpperCaseIdentifiersSync());
        } catch (err) {
            reject(err);
        }
    });
}

storesUpperCaseQuotedIdentifiers(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.storesUpperCaseQuotedIdentifiersSync());
        } catch (err) {
            reject(err);
        }
    });
}

supportsAlterTableWithAddColumn(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            resolve(this._dbm.supportsAlterTableWithAddColumnSync());
        } catch (err) {
            reject(err);
        }
    });
}


supportsAlterTableWithDropColumn(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsAlterTableWithDropColumnSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsANSI92EntryLevelSQL(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsANSI92EntryLevelSQLSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsANSI92FullSQL(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsANSI92FullSQLSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsANSI92IntermediateSQL(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsANSI92IntermediateSQLSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsBatchUpdates(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsBatchUpdatesSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsCatalogsInDataManipulation(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsCatalogsInDataManipulationSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsCatalogsInIndexDefinitions(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsCatalogsInIndexDefinitionsSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsCatalogsInPrivilegeDefinitions(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsCatalogsInPrivilegeDefinitionsSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsCatalogsInProcedureCalls(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsCatalogsInProcedureCallsSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsCatalogsInTableDefinitions(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsCatalogsInTableDefinitionsSync());
      } catch (err) {
          reject(err);
      }
  });
}

supportsColumnAliasing(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      try {
          resolve(this._dbm.supportsColumnAliasingSync());
      } catch (err) {
          reject(err);
      }
  });
}


supportsConvert(fromType: number, toType: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      if (typeof fromType !== 'number' || typeof toType !== 'number') {
        throw new Error("INVALID ARGUMENTS");
      }
      resolve(this._dbm.supportsConvertSync(fromType, toType));
    } catch (error) {
      reject(error);
    }
  });
}

supportsCoreSQLGrammar(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsCoreSQLGrammarSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsCorrelatedSubqueries(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsCorrelatedSubqueriesSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsDataDefinitionAndDataManipulationTransactions(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsDataDefinitionAndDataManipulationTransactionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsDataManipulationTransactionsOnly(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsDataManipulationTransactionsOnlySync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsDifferentTableCorrelationNames(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsDifferentTableCorrelationNamesSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsExpressionsInOrderBy(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsExpressionsInOrderBySync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsExtendedSQLGrammar(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsExtendedSQLGrammarSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsFullOuterJoins(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsFullOuterJoinsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsGetGeneratedKeys(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsGetGeneratedKeysSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsGroupBy(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsGroupBySync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsGroupByBeyondSelect(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsGroupByBeyondSelectSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsGroupByUnrelated(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsGroupByUnrelatedSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsIntegrityEnhancementFacility(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsIntegrityEnhancementFacilitySync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsLikeEscapeClause(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsLikeEscapeClauseSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsLimitedOuterJoins(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsLimitedOuterJoinsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsMinimumSQLGrammar(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsMinimumSQLGrammarSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsMixedCaseIdentifiers(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsMixedCaseIdentifiersSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsMixedCaseQuotedIdentifiers(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsMixedCaseQuotedIdentifiersSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsMultipleOpenResults(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsMultipleOpenResultsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsMultipleResultSets(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsMultipleResultSetsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsMultipleTransactions(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsMultipleTransactionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsNamedParameters(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsNamedParametersSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsNonNullableColumns(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsNonNullableColumnsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsOpenCursorsAcrossCommit(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsOpenCursorsAcrossCommitSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsOpenCursorsAcrossRollback(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsOpenCursorsAcrossRollbackSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsOpenStatementsAcrossCommit(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsOpenStatementsAcrossCommitSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsOpenStatementsAcrossRollback(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsOpenStatementsAcrossRollbackSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsOrderByUnrelated(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsOrderByUnrelatedSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsOuterJoins(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsOuterJoinsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsPositionedDelete(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsPositionedDeleteSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsPositionedUpdate(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsPositionedUpdateSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsResultSetConcurrency(type: number, concurrency: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      if (!Number.isInteger(type) || !Number.isInteger(concurrency)) {
        throw new Error("INVALID ARGUMENTS");
      }
      resolve(this._dbm.supportsResultSetConcurrencySync(type, concurrency));
    } catch (error) {
      reject(error);
    }
  });
}

supportsResultSetHoldability(holdability: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      if (!Number.isInteger(holdability)) {
        throw new Error("INVALID ARGUMENTS");
      }
      resolve(this._dbm.supportsResultSetHoldabilitySync(holdability));
    } catch (error) {
      reject(error);
    }
  });
}

supportsResultSetType(type: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      if (!Number.isInteger(type)) {
        throw new Error("INVALID ARGUMENTS");
      }
      resolve(this._dbm.supportsResultSetTypeSync(type));
    } catch (error) {
      reject(error);
    }
  });
}

supportsStoredFunctions(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsStoredFunctionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsStoredProcedures(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsStoredProceduresSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsSubselects(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsSubselectsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsTransactionIsolationLevel(level: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      if (!Number.isInteger(level)) {
        throw new Error("INVALID ARGUMENTS");
      }
      resolve(this._dbm.supportsTransactionIsolationLevelSync(level));
    } catch (error) {
      reject(error);
    }
  });
}

supportsTransactions(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsTransactionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

supportsUnions(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      resolve(this._dbm.supportsUnionsSync());
    } catch (error) {
      reject(error);
    }
  });
}

  
  /**
   * Checks if SQL UNION ALL is supported.
   *
   * @returns A promise that resolves to a boolean indicating if SQL UNION ALL is supported.
   */
  supportsUnionAll(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this._dbm.supportsUnionAllSync());
    });
  }
  
  /**
   * Checks if updates are detected by calling the method ResultSet.rowUpdated.
   *
   * @param type - The ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
   * @returns A promise that resolves to a boolean indicating if updates are detected by the result set type.
   */
  updatesAreDetected(type: number): Promise<boolean> {
    if (!Number.isInteger(type)) {
      return Promise.reject(new Error("INVALID ARGUMENTS"));
    }
  
    return new Promise((resolve) => {
      resolve(this._dbm.updatesAreDetectedSync(type));
    });
  }
  
  /**
   * Checks if the database uses a file for each table.
   *
   * @returns A promise that resolves to a boolean indicating if the database uses a file for each table.
   */
  usesLocalFilePerTable(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this._dbm.usesLocalFilePerTableSync());
    });
  }
  
  /**
   * Checks if the database stores tables in local files.
   *
   * @returns A promise that resolves to a boolean indicating if the database stores tables in local files.
   */
  usesLocalFiles(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(this._dbm.usesLocalFilesSync())
    });
  }
}

// Initializing static attributes from `java.sql.DatabaseMetaData`
const staticAttrs: string[] = [
  "attributeNoNulls",
  "attributeNullable",
  "attributeNullableUnknown",
  "bestRowNotPseudo",
  "bestRowPseudo",
  "bestRowSession",
  "bestRowTemporary",
  "bestRowTransaction",
  "bestRowUnknown",
  "columnNoNulls",
  "columnNullable",
  "columnNullableUnknown",
  "functionColumnIn",
  "functionColumnInOut",
  "functionColumnOut",
  "functionColumnResult",
  "functionColumnUnknown",
  "functionNoNulls",
  "functionNoTable",
  "functionNullable",
  "functionNullableUnknown",
  "functionResultUnknown",
  "functionReturn",
  "functionReturnsTable",
  "importedKeyCascade",
  "importedKeyInitiallyDeferred",
  "importedKeyInitiallyImmediate",
  "importedKeyNoAction",
  "importedKeyNotDeferrable",
  "importedKeyRestrict",
  "importedKeySetDefault",
  "importedKeySetNull",
  "procedureColumnIn",
  "procedureColumnInOut",
  "procedureColumnOut",
  "procedureColumnResult",
  "procedureColumnReturn",
  "procedureColumnUnknown",
  "procedureNoNulls",
  "procedureNoResult",
  "procedureNullable",
  "procedureNullableUnknown",
  "procedureResultUnknown",
  "procedureReturnsResult",
  "sqlStateSQL",
  "sqlStateSQL99",
  "sqlStateXOpen",
  "tableIndexClustered",
  "tableIndexHashed",
  "tableIndexOther",
  "tableIndexStatistic",
  "typeNoNulls",
  "typeNullable",
  "typeNullableUnknown",
  "typePredBasic",
  "typePredChar",
  "typePredNone",
  "typeSearchable",
  "versionColumnNotPseudo",
  "versionColumnPseudo",
  "versionColumnUnknown",
];

Jinst.getInstance().events.once("initialized", () => {
  // Assuming 'java' is an external library object with a method to get static field values
  staticAttrs.forEach((attr) => {
    (DatabaseMetaData as any)[attr as keyof DatabaseMetaData] =
      (java as typeof java).getStaticFieldValue("java.sql.DatabaseMetaData", attr);
  });
});

export default DatabaseMetaData;
