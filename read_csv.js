const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose()
const { importantMsg, COMMON_THINGS } = require("./logic/library.js")
const { updater, setDB } = require('./logic/db_handler.js')
const results = [];
importantMsg("OK", `Use dataBase named '${COMMON_THINGS.DB_NAME}'`)
setDB("./" + COMMON_THINGS.DB_NAME)

fs.createReadStream('2023-12-13 12_42pm.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results.forEach(async (obj, i) => {
            const id = obj['OKTA_ID']
            const dollars = parseInt(obj['TOTALREVENUE'])
            const query = `UPDATE people SET tlv = ${dollars} WHERE pk = "${id}"`;
            await updater(query)
            console.log(i, query)
        })
    });
