import { prepareOperations } from "@azure/cosmos/dist/commonjs/utils/batch";
import { JOBS, schemaSql } from "../../consts";
import { generateUUIDv6, runQuery } from "../../db-utils";
import { BadRequestError, NotFoundError } from "../../generated/api";
import { JobCreateRes, JobCreateReq, JobReadReq, JobReadRes, InternalServerError, JobUpdateReq, JobUpdateRes, JobDeleteReq, JobDeleteRes, JobCreateRef } from "../../typescript/api";

export const createJob = async (data: JobCreateReq): Promise<JobCreateRes> => {
  const freq = data.freq
  const name = data.name
  const query = data.query
  const type = data?.type
  const queryOutputTable = data?.queryOutputTable

  checkProperties(data)

  if (!validateCronStr(freq)) throw new BadRequestError('Cron synthax is wrong on field freq.')

  const uuid = generateUUIDv6()

  try {
    const insertReq = await runQuery(`INSERT INTO ${schemaSql}${JOBS} (id, name, frequency, type, query, query_output_table) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        name,
        freq,
        type,
        query,
        queryOutputTable
      ]
    )
  } catch (error) {
    throw new InternalServerError(`Could not insert job.`)
  }


  try {
    const selectReq = await runQuery(`SELECT * FROM ${schemaSql}${JOBS} WHERE id = ?`, [uuid])

    return returnSqlToJobProperties(selectReq[0])
  } catch (error) {
    throw new InternalServerError(`Could not fetch data from job (id: ${uuid})`)
  }
}

export const readJob = async (data: JobReadReq): Promise<JobReadRes> => {
  const id = data.id

  if (!id) throw new BadRequestError(`Cannot read without id.`)

  try {
    const selectReq = await runQuery(`SELECT * FROM ${schemaSql}${JOBS} WHERE id = ?`, [id])

    if (selectReq.length === 0) throw { code: 404, message: `Could not find job at id "${id}"` }

    return returnSqlToJobProperties(selectReq[0])
  } catch (error) {
    if (error?.code === 404) throw new NotFoundError(error?.message)
    throw new InternalServerError(`Could not fetch data from job (id: ${id})`)
  }
}

export const updateJob = async (data: JobUpdateReq): Promise<JobUpdateRes> => {
  const id = data.id
  const query = data.query
  const freq = data.freq
  const name = data.name
  const type = data.type
  const queryOutputTable = data?.queryOutputTable

  if (!id) throw new BadRequestError(`Cannot update without id.`)

  if (freq && !validateCronStr(freq)) throw new BadRequestError('Cron synthax is wrong on field freq.')

  const fields = [
    query ? `query = ?` : '',
    freq ? `frequency = ?` : '',
    name ? `name = ?` : '',
    type ? `type = ?` : '',
    queryOutputTable ? `query_output_table = ?` : ''
  ].filter(el => !!el).join(", ")

  try {
    const updateReq = await runQuery(`UPDATE ${schemaSql}${JOBS} SET 
      ${fields}
      WHERE id = ?
    `, [query, freq, name, type, queryOutputTable, id].filter(el => !!el)
    )


  } catch (error) {
    throw new InternalServerError(`Could not update job (id: ${id}).`)
  }

  try {
    const selectReq = await runQuery(`SELECT * FROM ${schemaSql}${JOBS} WHERE id = ?`, [id])

    if (selectReq.length === 0) throw { code: 404, message: `Could not find job at id "${id}"` }


    return returnSqlToJobProperties(selectReq[0])
  } catch (error) {
    if (error?.code === 404) throw new NotFoundError(error?.message)

    throw new InternalServerError(`Could not fetch data from job (id: ${id})`)
  }
}

export const deleteJob = async (data: JobDeleteReq): Promise<JobDeleteRes> => {
  const id = data.id

  if (!id) throw new BadRequestError(`Cannot delete without id.`)

  try {
    await runQuery(`DELETE FROM ${schemaSql}${JOBS} WHERE id = ?`, [id])

    return `Job at id "${id} deleted"`
  } catch (error) {
    throw new InternalServerError(`Could not delete job at id "${id}"`)
  }

}

const checkProperties = (data: { id?: string, type?: string, freq?: string, name?: string, query?: string }) => {
  const wrongDataTypes = []

  for (const prop in data) {
    if (typeof data[prop] !== 'string') {
      wrongDataTypes.push(`${prop} has to be string. Got ${typeof data[prop]}.`)
    }
  }

  if (wrongDataTypes.length > 0) throw new BadRequestError(`${wrongDataTypes.join(`\n, `)}`)
}

const returnSqlToJobProperties = (result: Record<string, any>): JobReadRes => {

  return {
    id: result['id'],
    query: result['query'],
    type: result['type'],
    name: result['name'],
    freq: result['frequency'],
    queryOutputTable: result['query_output_table']
  } as JobCreateRes
}

const validateCronStr = (cronStr: string): boolean => {
  const regex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/

  return regex.test(cronStr)
}
