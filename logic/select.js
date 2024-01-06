const { COMMON_THINGS } = require("./library.js")
const { setDB, selectByPk } = require("./db_handler.js")


async function test1() { 
    setDB("../" + COMMON_THINGS.DB_NAME)

    const x = await selectByPk("LIFETIME#00u32mf7wdqejFjmv4x7")
    console.log(x.length)
}
test1()
