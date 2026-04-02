import { getDbPool, sql } from "@/lib/db/sql";

type RequestInputType = Parameters<sql.Request["input"]>[1];
type RequestInputValue = Parameters<sql.Request["input"]>[2];

type SqlParam = {
  name: string;
  type: RequestInputType;
  value: RequestInputValue;
};

export async function executeProcedure<T>(
  procedureName: string,
  params: SqlParam[] = []
): Promise<T[]> {
  const pool = await getDbPool();
  const request = pool.request();

  for (const param of params) {
    request.input(param.name, param.type, param.value);
  }

  const result = await request.execute(procedureName);
  return result.recordset as T[];
}

export async function executeProcedureNoResult(
  procedureName: string,
  params: SqlParam[] = []
): Promise<void> {
  const pool = await getDbPool();
  const request = pool.request();

  for (const param of params) {
    request.input(param.name, param.type, param.value);
  }

  await request.execute(procedureName);
}

export { sql };