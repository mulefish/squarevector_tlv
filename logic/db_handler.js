const { yellow, importantMsg } = require("./library.js")

const sqlite3 = require('sqlite3').verbose()
let db = undefined

function setDB(path) {
    db = new sqlite3.Database(path)
}

async function inserter(table, wildCards, values) {
    // wildCards will be like: ['?','?',0,0,'?']
    // values will be like: [1, 'A', '{"x": 100, "y": 200}', 'High']
    const query = `INSERT INTO ${table} VALUES (${wildCards})`
    // console.log(query)
    // console.log(values)
    return new Promise((resolve, reject) => {
        db.run(query, values, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}

// Update data in a table
async function updater(sql) {
    // const sql = `UPDATE ${table} SET ${column} = ? WHERE id = ?`;

    db.run(sql, [], function(err) {
        if (err) {
            return console.error(err.message);
        }
        // console.log(`Row(s) updated: ${this.changes}`);
    });

}

async function selecter(sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('Error running sql: ' + sql, err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
async function deleter(sql) {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) {
                console.error('Error executing delete statement', err.message);
                reject(err);
            } else {
                // console.log(`Rows deleted: ${this.changes}`);
                resolve(this.changes);
            }
        });
    });
}
async function deleteTable (table) {
    db.run(`DROP TABLE IF EXISTS ${table}`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        yellow(`Table ${table} dropped.`);
    });
}
async function serialize (sql, table) {
    db.serialize(() => {
        db.run(sql, (failbot) => {
            let status = "OK"
            let msg = `Table '${table}' was created.`
            if (failbot) {
                status = "FAIL"
                msg = failbot.message
            }
            importantMsg(status, msg)
        })
    })
}

async function getRowCount(table) {
    //console.log("getRowCount table=" + table )
    return new Promise((resolve, reject) => {
        const query = `SELECT COUNT(*) AS count FROM ${table}`
        db.get(query, (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row.count)
            }
        })
    })
}

async function closeDB(whoCalledMe, isTest = false) {
    if (db.open) {
        db.close((err) => {
            if (err) {
                console.log("Error closing database")
                return false
            } else {
                if (isTest === false) {
                    console.log("DB conn closed by |" + whoCalledMe + "|")
                }
                return true
            }
        })
    } else {
        if (isTest === false) {
            console.log("DB conn was not open. This func called by |" + whoCalledMe + "|")
        }
        return true
    }
}

module.exports = { serialize, deleteTable, updater, deleter, selecter, getRowCount, inserter, setDB, closeDB }