import { PontusService } from './generated/api/resources/pontus/service/PontusService';
import {runQuery} from '../../src/db-utils'


export default new PontusService({

 executeQueryPost: async(req, res) =>{
  const {query, params} = req.body
   const response = await runQuery(query, params)
   
   res.send({results: response})
 },
});
