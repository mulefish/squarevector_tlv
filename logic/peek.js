
const { setDB, getRowCount } = require("./db_handler.js")
const { COMMON_THINGS } = require("./library.js")

async function peek() {
        setDB("../" + COMMON_THINGS.DB_NAME)
        for ( let k in COMMON_THINGS ) { 
                if ( k.startsWith("TABLE")) {
                        const table = COMMON_THINGS[k]
                        try { 
                        const n = await getRowCount(table)
                        console.log("row count " + n + " in " + table)
                        } catch ( boom ) {
                                console.log("FAILBOT on " + table + "! Likely, this is a missing table.")
                        }
                }
        }

        
}
peek()