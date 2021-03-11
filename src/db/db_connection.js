const sqlite3 = require('sqlite3').verbose();
const {getJsonFromFile} = require('./get_json_from_file')
const faker = require('faker')

const SQL_CREATE_TABLES_IF_NOT_EXISTS = [
  'CREATE TABLE IF NOT EXISTS "books" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, "title" TEXT NOT NULL, "author" TEXT, "year" INTEGER);',
  'CREATE TABLE IF NOT EXISTS "users" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, "first_name" TEXT NOT NULL, "last_name" TEXT NOT NULL, "email" TEXT NOT NULL);'
]
const SQL_ROW_COUNT_TABLE = {
  'books': "SELECT COUNT(*) AS rowCount FROM 'books';",
  'users': "SELECT COUNT(*) AS rowCount FROM 'users';"
}
const SQL_INSERT_FIXTURES = {
  'books': "INSERT INTO 'books' (title, author, year) VALUES",
  'users': "INSERT INTO 'users' (first_name, last_name, email) VALUES"
}


/**
 * open the database
 * @returns {IDBDatabase|null}
 */
const openDB = () => {
  let db = new sqlite3.Database('./db_sqlite/db_test.sqlite', (err) => {
    if (err) {
      console.error(err)
      return null
    }
    console.log('Connected to the database.');
  });
  db.serialize(() => {
    db = createTablesIfNotExists(db)
    db = insertDataIfEmptyTable(db, 'books')
    db = insertDataIfEmptyTable(db, 'users')
  })
  return db
}


const dbValidation = (db) => {
  if (!db || !(db instanceof sqlite3.Database)) {
    console.error(`DB not exists`)
    return false
  }
  return true
}


/**
 * Create tables if not exists
 * @param db
 * @returns {IDBDatabase|null}
 */
const createTablesIfNotExists = (db) => {
  if (!dbValidation(db)) return null
  SQL_CREATE_TABLES_IF_NOT_EXISTS.forEach(sqlCreateTableIfNotExists =>
    db.run(sqlCreateTableIfNotExists, err => {
      if (err) {
        closeDB(db)
        console.error(err.message)
        return null
      }
    })
  )
  return db
}


/**
 * Fixtures of tables:
 *  - 'books': data from books_flowers.json requires parsing
 *  - 'users': 5 fake users
 * @param tableName
 * @returns {[[*, *, *], ..., []]|null}
 */
const tableFixtures = (tableName) => {
  switch (tableName) {
    case 'books':
      let data
      try {
        data = getJsonFromFile('books_flowers.json')
      } catch (e) {
        console.error(e);
        return null
      }
      // data from json with parsing data
      return data.items.map(item => ([
          item.volumeInfo.title,   // title
          (item.volumeInfo.authors && item.volumeInfo.authors.join(', ')) || 'NULL',    // author
          (item.volumeInfo.publishedDate && parseInt(item.volumeInfo.publishedDate)) || 'NULL'    // year
        ]
      ));
    case 'users':
      faker.locale = 'pl'
      return [...Array(5).keys()].map(elem => ([
          faker.name.firstName(),    // first_name
          faker.name.lastName(),     // last_name
          faker.internet.email()     // email
        ])
      )
    default:
      return null
  }
}


/**
 * If table (of tableName) is empty, function inserts fixtures
 * (fake data are taken from faker package)
 * @param db
 * @returns {IDBDatabase|null}
 */
const insertDataIfEmptyTable = (db, tableName) => {
  if (!dbValidation(db) || !tableName) return null
  console.log(tableName);
  db.get(SQL_ROW_COUNT_TABLE[tableName], (err, result) => {
    if (err) {
      console.error(err.message)
      return null
    }
    console.log('result.rowCount: ', result.rowCount);
    // insert data to empty table
    if (!result.rowCount) {
      // fake data/payload
      const payload = tableFixtures(tableName)
      if (!payload) return db
      let payloadFlattened = []
      payload.forEach(row => row.forEach(col => payloadFlattened.push(col)))
      // preparing placeholders for SQL query
      const placeholders = ' (' + payload.map(row => row.map(col => '?').join(', ')).join('), (') + ');'
      // insert prepared data
      db.run(SQL_INSERT_FIXTURES[tableName] + placeholders, payloadFlattened, err => {
        if (err) {
          console.error(err.message)
          return db
        }
      })
    }
  })
  return (db)
}


/**
 * close DB
 * @param db
 * @returns {boolean}
 */
const closeDB = (db) => {
  if (!dbValidation(db)) return false
  db.close((err) => {
    if (err) {
      console.error(err.message);
      return false
    }
    console.log('Close the database connection.')
  })
  return true
}

exports.openDB = openDB
exports.dbValidation = dbValidation
exports.closeDB = closeDB
