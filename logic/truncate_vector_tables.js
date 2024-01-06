const { COMMON_THINGS, importantMsg } = require("./library.js")
const { setDB, deleter } = require("./db_handler.js")

async function truncate() { 
    setDB("../" + COMMON_THINGS.DB_NAME)
    const table1 = COMMON_THINGS.TABLE_AFFINITY_LETTER_VECTOR_NAME
    const table2 = COMMON_THINGS.TABLE_CAMPAIGN_LETTER_VECTOR_NAME
    const table3 = COMMON_THINGS.TABLE_GROUP_AFFINITY_DAY_NAME
 
    await deleter(`delete from ${table1}`)
    await deleter(`delete from ${table2}`)
    await deleter(`delete from ${table3}`)

    importantMsg("Truncated", `${table1} ${table2} ${table3}`)
}
truncate()