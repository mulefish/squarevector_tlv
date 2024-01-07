const { selecter} = require('./../logic/db_handler.js')
const { cyan, yellow, verdict, COMMON_THINGS } = require("./../logic/library.js")
const { getAffinityLetters_asHoH } = require('./../groupify.js')

async function  getAffinityLetters_asHoH_test() { 
    const HoH = await getAffinityLetters_asHoH()
    const keys = Object.keys(HoH)
    const n = keys.length 
    const key = keys[0]
    const obj = HoH[key]
    let isOk = true 
    isOk &&= n > 260 
    isOk &&= obj.hasOwnProperty("seen")
    isOk &&= obj.hasOwnProperty("letter")
    isOk &&= obj.hasOwnProperty("isChild")
    verdict(isOk, true, "getAffinityLetters_asHoH_test")
}


async function getSomeEntries() { 
    const sql = "select * from entries limit 10;"
    const entries = await selecter(sql)
    console.log( entries )
}
getAffinityLetters_asHoH_test()
// getSomeEntries() 