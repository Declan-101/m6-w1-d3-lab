# Week 5 Day 3 Lab — Book List with MongoDB

Converted the earlier Book List JSON-server app to React + Express + MongoDB/Mongoose using the Week 5 inventory homework structure.

## Run

Start MongoDB, then in one terminal:

```sh
cd node-mongo
npm ci
cp .env.example .env
node scripts/import-books.js
npm start
```

The import script reads the original `data/db.json` posts and adds title/author records to `book-list.books` only when the collection is empty. It never drops existing records. The original JSON is kept as a source copy; `data/books.json` is also provided as newline-delimited JSON.

In another terminal:

```sh
cd react-app
npm ci
PORT=3001 npm start
```

Open http://localhost:3001. The Book List appears immediately with no top navigation, as required. Add Book opens `/books/new`; Edit opens `/books/:id`. Save persists to MongoDB and returns to the list. Cancel does not save. Delete removes the item and updates the list. Both title and author are required.

The frontend proxies `/api` to http://127.0.0.1:8081. Separate ports and the `book-list` database preserve the inventory homework.

## API

- GET `/api/books`: list books
- GET `/api/book/:id`: read one
- POST `/api/book`: create title and author
- PUT `/api/book`: update fields using `_id`
- DELETE `/api/book/:id`: remove one

## Verification

- `cd node-mongo && npm test`: full CRUD, invalid IDs/fields, and missing records; separate `book-list-lab-test` database.
- `cd react-app && npm run build`: production build passed.
- Browser: initial list, create, edit, reload persistence, cancel, and delete passed; temporary test book removed.

Part 2 of the lab starts Project 3 in the separate `Project-3/drip-room` folder. The full project is due at the end of the bootcamp; its authentication, database integration, HTTPS deployment, and PWA remain future milestones.
