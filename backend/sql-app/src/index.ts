import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from './generated/api';
import { PontusService } from './generated/api/resources/pontus/service/PontusService';
import { runQuery } from '../../src/db-utils';

export default new PontusService({
  executeQueryPost: async(req, res)=> {
    console.log({body: req.body, path: req.path})
    if(process.env.ENVIRONMENT_MODE !== 'test') {
      throw new ForbiddenError('You cannot execute this action since this is not a testing environment')
    }

    const response = await runQuery(req.body.query) as Record<string,any>[]
    console.log({response: JSON.stringify(response)})
  

    res.send({results: response})
  },
});
