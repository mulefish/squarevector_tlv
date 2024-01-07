const { selecter} = require('./../logic/db_handler.js')
const { cyan, yellow, verdict, COMMON_THINGS } = require("./../logic/library.js")
async function getSomeEntries() { 

    const sql = "select * from entries limit 10;"
    const entries = await selecter(sql)
    console.log( entries )


}

getSomeEntries() 