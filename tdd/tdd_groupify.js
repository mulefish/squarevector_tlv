const { selecter} = require('./../logic/db_handler.js')
const { verdict } = require("./../logic/library.js")
const {sortObjByNumericKeys, getEntries_dealWithThem,  getAffinityLetters_asHoH, getEntries_sortOnItsu_asLoH } = require('./../groupify.js')

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

async function getEntries_sortOnItsu_asLoH_test() { 
    const number = 10
    const sql = "select * from entries limit " + number
    const LoH = await getEntries_sortOnItsu_asLoH(sql)
    const lastIndex = LoH.length - 1
    let isOk = true 
    isOk &&= LoH.length === number
    isOk &&= LoH[0].itsu < LoH[lastIndex].itsu
    verdict(isOk, true, "getEntries_sortOnItsu_asLoH_test")
}
async function sortObjByNumericKeys_test() { 
    const given = ["34", "26", "102", "2"] 
    const actual = sortObjByNumericKeys(given)
    const expected = [ 2, 26, 34, 102 ]
    const isOk = JSON.stringify(actual) === JSON.stringify(expected)
    verdict(isOk, true, "sortObjByNumericKeys_test")    
}

async function getEntries_dealWithThem_test() { 
    const number = 10
    const sql = "select * from entries limit " + number
    const entries = await getEntries_sortOnItsu_asLoH(sql)
    const x = await getEntries_dealWithThem(entries)

    console.log( Object.keys(x))

}




 getAffinityLetters_asHoH_test()
 getEntries_sortOnItsu_asLoH_test()
 sortObjByNumericKeys_test()  
//getEntries_dealWithThem_test() 