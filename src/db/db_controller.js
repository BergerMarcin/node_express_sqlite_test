const {dbValidation} = require('./db_connection')

const TABLES_NAMES = ['books', 'users']
const SQL_SELECT_ALL = (tableName) => (`SELECT * FROM '${tableName}';`)
const SQL_SELECT_ID = (tableName) => (`SELECT * FROM '${tableName}' WHERE id = ?;`)
const MAX_DB_RESPONSIVE = 2000 // ms

/**
 * Get all rows of the table (all data)
 * @param tableName
 * @returns {Promise<Array>|null}
 */
exports.getAllRows = async (tableName) => {
  console.log(`DB controller START --------------- getAllRows from table: ${tableName}`)
  if (!TABLES_NAMES.includes(tableName)) {
    console.error(`Wrong table name of ${tableName}`)
    return null
  }
  if (!dbValidation(global._db)) return null
  let payload
  return new Promise((res, rej) => {
    global._db.all(SQL_SELECT_ALL(tableName), [], (err, result) => {
      if (err) {
        console.error(err)
        return rej(err)
      }
      payload = result
    })
    const setTimeoutId = setTimeout(
      () => {
        let time = 0
        const setIntervalId = setInterval(() => {
            if (payload) {
              clearInterval(setIntervalId)
              clearTimeout(setTimeoutId)
              console.log(`payload: ${payload}`)
              console.log(`DB controller END ---------------`)
              res(payload)
            }
            time = +50
            if (time + 100 > MAX_DB_RESPONSIVE) {
              console.log('end.REJECTED');
              return rej(`Max time (${MAX_DB_RESPONSIVE}ms) exceeded`)
            }
          },
          50)
      },
      MAX_DB_RESPONSIVE
    )
  })
}

/**
 * Get raw of id of the tableName
 * @param id
 * @param tableName
 * @returns {Promise<Object>|null}
 */
exports.getRowById = (id, tableName) => {
  console.log(`DB controller START --------------- getRowById of id: ${id} from table: ${tableName}`)
  if (!id) {
    console.error('No id')
    return null
  }
  if (!TABLES_NAMES.includes(tableName)) {
    console.error(`Wrong table name of ${tableName}`)
    return null
  }
  if (!dbValidation(global._db)) return null
  let payload
  return new Promise((res, rej) => {
    global._db.all(SQL_SELECT_ID(tableName), [id], (err, result) => {
      if (err) {
        console.error(err)
        return rej(err)
      }
      payload = result
    })
    const setTimeoutId = setTimeout(
      () => {
        let time = 0
        const setIntervalId = setInterval(() => {
            if (payload) {
              clearInterval(setIntervalId)
              clearTimeout(setTimeoutId)
              console.log(`payload: ${payload}`)
              console.log(`DB controller END ---------------`)
              res(payload)
            }
            time = +50
            if (time + 100 > MAX_DB_RESPONSIVE) {
              console.log('end.REJECTED');
              return rej(`Max time (${MAX_DB_RESPONSIVE}ms) exceeded`)
            }
          },
          50)
      },
      MAX_DB_RESPONSIVE
    )
  })
}
