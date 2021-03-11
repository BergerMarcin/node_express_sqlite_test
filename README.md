#Intro
This is just test project to learn Express.js :)

The best part of that project is wrapped sqlite3 functions with Promises (giving modern way of programming with DB responses)

##Express.js
No Promises!!!
Giving only routing with server-side rendering + middleware
Modern frameworks routing has those parts as a standard + built-in professional html templates engine for rendering + much more

##PUG
Disaster html templates engine. Never, ever again!!!

Anyway it was fun to compare it with modern frameworks 

##SQLITE
Node package: `sqlite3`
Disaster package, no promises

DB localisation
`/db_sqlite/books.sqlite`

DB tables:
```
"books":
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
    "title" TEXT NOT NULL, 
    "author" TEXT, 
    "year" INTEGER
"users":
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
    "first_name" TEXT NOT NULL, 
    "last_name" TEXT NOT NULL, 
    "email" TEXT NOT NULL
```

Empty 'books' table is inserted with data from `books_flowers.json` (sample taken from Google Books API)

Empty 'users' table is inserted with fake data from `faker` package

Get all table list except of internal of sqlite<br/>
`SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'`
