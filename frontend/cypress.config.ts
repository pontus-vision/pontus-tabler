import { defineConfig } from 'cypress';
import { runQuery, schema, schemaSql } from '../backend/src/db-utils';
import * as dotenv from 'dotenv';

dotenv.config();

const table = (name: string) => `${schemaSql}${name}`;

const createWebhookTable = async () => {
  try {
    await runQuery(`
      CREATE TABLE IF NOT EXISTS ${table('webhook_subscriptions')} (
        id STRING,
        user_id STRING NOT NULL,
        context STRING NOT NULL,
        table_filter STRING NOT NULL,
        operation STRING NOT NULL,
        endpoint STRING NOT NULL,
        secret_token_link STRING NOT NULL
      )
      USING DELTA
      LOCATION "/data/pv/webhook_subscriptions";
    `);
    await runQuery(`DELETE FROM ${table('auth_users')};`);
  } catch (error) {
    console.error('Error creating table/deleting rows', { error });
  }
};

export default defineConfig({
  e2e: {
    baseUrl: process.env.FRONTEND_URL || 'http://frontend-server:5173',
    env: {
      nodeAppUrl: process.env.FRONTEND_URL || 'http://frontend-server:5173',
    },
    defaultCommandTimeout: 30000,
    video: false,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },

        async selectTables(tableName) {
          try {
            const result = await runQuery(`SELECT * FROM ${table(tableName)}`);
            console.log({ result });
            return null;
          } catch (error) {
            console.error(`Error selecting table ${tableName}`, { error });
          }
        },

        async resetDatabaseTablesTest() {
          try {
            await createWebhookTable();

            const showTables1 = await runQuery('SHOW TABLES;');

            const groupsCheck = await runQuery(`SHOW TABLES ${schema ? `FROM ${schema}` : ''} LIKE "${table('auth_users')}"`);
            if (groupsCheck.length > 0) {
              await runQuery(`DELETE FROM ${table('auth_users')};`);
            } else {
              await runQuery(`CREATE TABLE IF NOT EXISTS ${table('auth_users')} (id STRING, username STRING, password STRING) USING DELTA LOCATION "/data/pv/auth_users";`);
            }

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('auth_groups')} (id STRING, name STRING, create_table BOOLEAN , read_table BOOLEAN , update_table BOOLEAN , delete_table BOOLEAN, create_dashboard BOOLEAN , read_dashboard BOOLEAN , update_dashboard BOOLEAN , delete_dashboard BOOLEAN ) USING DELTA LOCATION "/data/pv/auth_groups";`);
            await runQuery(`DELETE FROM ${table('auth_groups')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('tables')} (id STRING, name STRING, label STRING, cols ARRAY<STRUCT<id STRING, name STRING, field STRING, sortable BOOLEAN, header_name STRING, filter BOOLEAN, kind STRING, pivotIndex INTEGER, description STRING, regex STRING>>) USING DELTA LOCATION "/data/pv/tables";`);
            await runQuery(`DELETE FROM ${table('tables')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('groups_users')} (id STRING, table_from__id STRING, table_from__name STRING, table_to__id STRING, table_to__username STRING, edge_label STRING) USING DELTA LOCATION "/data/pv/groups_users";`);
            await runQuery(`DELETE FROM ${table('groups_users')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('menu')} (id STRING, tree_obj_str STRING) USING DELTA LOCATION "/data/pv/menu";`);
            await runQuery(`DELETE FROM ${table('menu')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('dashboards')} (id STRING, name STRING, owner STRING, state STRING, folder STRING) USING DELTA LOCATION "/data/pv/dashboards";`);
            await runQuery(`DELETE FROM ${table('dashboards')};`);

            const checkTable1 = await runQuery(`SHOW TABLES ${schema ? `FROM ${schema}` : ''} "${table('table_1')}"`);
            const checkTable2 = await runQuery(`SHOW TABLES ${schema ? `FROM ${schema}` : ''} "${table('table_2')}"`);

            if (checkTable1.length > 0) {
              await runQuery(`DROP TABLE ${table('table_1')}`);
            }
            if (checkTable2.length > 0) {
              await runQuery(`DROP TABLE ${table('table_2')}`);
            }

            const showTables2 = await runQuery('SHOW TABLES;');
            console.log({ showTables1, showTables2 });

            return { success: true };
          } catch (error) {
            console.error('Database reset failed:', error);
            throw new Error(error);
          }
        },

        async resetDatabaseUsers() {
          try {
            await createWebhookTable();

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('auth_users')} (id STRING, username STRING, password STRING) USING DELTA LOCATION "/data/pv/auth_users";`);
            await runQuery(`DELETE FROM ${table('auth_users')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('auth_groups')} (id STRING, name STRING, create_table BOOLEAN , read_table BOOLEAN , update_table BOOLEAN , delete_table BOOLEAN , create_dashboard BOOLEAN , read_dashboard BOOLEAN , update_dashboard BOOLEAN , delete_dashboard BOOLEAN) USING DELTA LOCATION "/data/pv/auth_groups";`);
            await runQuery(`DELETE FROM ${table('auth_groups')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('groups_users')} (id STRING, table_from__id STRING, table_from__name STRING, table_to__id STRING, table_to__username STRING, edge_label STRING) USING DELTA LOCATION "/data/pv/groups_users";`);
            await runQuery(`DELETE FROM ${table('groups_users')};`);

            return { success: true };
          } catch (error) {
            console.error('Database reset failed:', error);
            throw new Error(error);
          }
        },

        async resetDatabaseAuthGroups() {
          try {
            await createWebhookTable();

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('auth_users')} (id STRING, username STRING, password STRING) USING DELTA LOCATION "/data/pv/auth_users";`);
            await runQuery(`DELETE FROM ${table('auth_users')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('auth_groups')} (id STRING, name STRING, create_table BOOLEAN , read_table BOOLEAN , update_table BOOLEAN , delete_table BOOLEAN , create_dashboard BOOLEAN , read_dashboard BOOLEAN , update_dashboard BOOLEAN , delete_dashboard BOOLEAN) USING DELTA LOCATION "/data/pv/auth_groups";`);
            await runQuery(`DELETE FROM ${table('auth_groups')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('tables')} (id STRING, name STRING, label STRING, cols ARRAY<STRUCT<id STRING, name STRING, field STRING, sortable BOOLEAN, header_name STRING, filter BOOLEAN, kind STRING, pivotIndex INTEGER, description STRING, regex STRING>>) USING DELTA LOCATION "/data/pv/tables";`);
            await runQuery(`DELETE FROM ${table('tables')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('groups_users')} (id STRING, table_from__id STRING, table_from__name STRING, table_to__id STRING, table_to__username STRING, edge_label STRING) USING DELTA LOCATION "/data/pv/groups_users";`);
            await runQuery(`DELETE FROM ${table('groups_users')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('menu')} (id STRING, tree_obj_str STRING) USING DELTA LOCATION "/data/pv/menu";`);
            await runQuery(`DELETE FROM ${table('menu')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('dashboards')} (id STRING, name STRING, owner STRING, state STRING, folder STRING) USING DELTA LOCATION "/data/pv/dashboards";`);
            await runQuery(`DELETE FROM ${table('dashboards')};`);

            await runQuery(`CREATE TABLE IF NOT EXISTS ${table('groups_dashboards')} (id STRING, table_from__id STRING, table_from__name STRING, table_from__create STRING, table_from__delete STRING, table_from__read STRING, table_from__update STRING, table_to__id STRING, table_to__name STRING, table_to__create STRING, table_to__read STRING, table_to__update STRING, table_to__delete STRING, edge_label STRING) USING DELTA LOCATION "/data/pv/groups_dashboards"`);
            await runQuery(`DELETE FROM ${table('groups_dashboards')};`);

            await runQuery(`INSERT INTO ${table('tables')} (id, name, label, cols) VALUES (
              "0195a1fc391343e58793727991e8ca40",
              "table_1",
              "Table 1",
              array(
                struct("0195a1fc3a154a08a140a4c361b49c44", "column_1", "column_1", false, "column 1", false, "checkboxes", "1", null, null),
                struct("0195a1fc3a154a47a800e7fde129c5d3", "column_2", "column_2", false, "column 2", false, "checkboxes", "2", null, null)
              )
            );`);

            const dashState = `'{ "global": {}, "borders": [], "layout": {
              "type": "row",
              "id": "#c4054161-d40e-4c2f-bef9-f60475ee1425",
              "children": [
                {
                  "type": "tabset",
                  "id": "#4314298d-3151-4a53-8d5b-0203728343b4",
                  "weight": 50,
                  "children": [
                    {
                      "type": "tab",
                      "id": "#327dde1e-6484-432d-beb7-71031c21b663",
                      "name": "table_1",
                      "component": "PVGridWebiny2",
                      "config": {
                        "title": "table_1",
                        "tableId": "0195a1fc391343e58793727991e8ca40",
                        "lastState": [],
                        "height": 480
                      }
                    }
                  ]
                },
                {
                  "type": "tabset",
                  "id": "#de482326-ef63-40a7-93d1-a3cad1b10bdd",
                  "weight": 50,
                  "children": [
                    {
                      "type": "tab",
                      "id": "#ada05336-b3e4-45ec-b014-3d59f7a21152",
                      "name": "PVDoughnutChart2",
                      "component": "PVDoughnutChart2",
                      "config": {
                        "lastState": []
                      }
                    }
                  ],
                  "active": true
                }
              ]
            } }'`;

            await runQuery(`INSERT INTO ${table('dashboards')} (id, name, folder, state, owner)
              VALUES ('0195a4c3adc640b0a54020f8594ec153', 'Dash 1', '/', ${dashState}, 'Admin 1');`);

            await runQuery(`INSERT INTO ${table('dashboards')} (id, name, folder, state, owner)
              VALUES ('0195a560d6b241f6aea740447de06d9d', 'Dash 2', '/', ${dashState}, 'Admin 1');`);

            return { success: true };
          } catch (error) {
            console.error('Database reset failed:', error);
            throw new Error(error);
          }
        },
      });
    },
  },
});
