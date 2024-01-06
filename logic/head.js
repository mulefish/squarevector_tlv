
const { selecter, setDB, getRowCount } = require("./db_handler.js")
const { colors, COMMON_THINGS } = require("./library.js")

async function peek() {
        setDB("../" + COMMON_THINGS.DB_NAME)
        for (let k in COMMON_THINGS) {
                if (k.startsWith("TABLE")) {
                        const table = COMMON_THINGS[k]
                        sql = `select * from ${table} limit 10`

                        console.log(colors.bold + colors.bg_red + sql + colors.reset)
                        const rows = await selecter(sql)
                        console.log(JSON.stringify(rows, null, 2))
                }
        }
}
peek()