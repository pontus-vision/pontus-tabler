import {
    DashboardCreateReq,
    DashboardCreateRes,
    DashboardReadRes,
    DashboardRef,
    DashboardUpdateRes,
    DashboardUpdateReq,
    DashboardReadReq,
    DashboardGroupAuthReadRes,
    DashboardGroupAuthReadReq,
    DashboardGroupAuthCreateRes,
    DashboardGroupAuthUpdateReq,
    DashboardGroupAuthUpdateRes,
    DashboardGroupAuthDeleteReq,
    DashboardGroupAuthDeleteRes,
    AuthGroupCreateReq,
  } from '../typescript/api';
  // import { sendHttpRequest } from '../http';
  // import { method } from 'lodash';
  // import axios from 'axios';
  import { srv } from '../server';
  
  import { post, stateObj } from './test-utils';
  import { DashboardGroupAuthCreateReq } from '../generated/api';
  import { AxiosRequestConfig, AxiosResponse } from 'axios';
  import { deleteContainer, deleteDatabase } from '../cosmos-utils';
  
  // // Mock the utils.writeJson function
  // jest.mock('../utils/writer', () => ({
  //   writeJson: jest.fn(),
  // }));
  
  // // Mock the Default service functions
  // jest.mock('../service/DefaultService', () => ({
  //   dashboardUpdatePOST: jest.fn(),
  //   dashboardsReadPOST: jest.fn(),
  // }));
  jest.setTimeout(1000000);
  
  describe('dashboardCreatePOST', () => {
    const OLD_ENV = process.env;
  
    beforeEach(async () => {
      jest.resetModules(); // Most important - it clears the cache
      process.env = { ...OLD_ENV }; // Make a copy
      await deleteContainer('dashboards');
    });
  
    afterAll(() => {
      process.env = OLD_ENV; // Restore old environment
      srv.close();
    });
  
    it('should create a group',async()=>{
        const createBody:AuthGroupCreateReq = {
            name: 'group1',
            parents: [''],
            symlinks: [''],

        }

        const res = await post('/auth/group/create', createBody)
    })
  });
  