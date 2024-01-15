const sqlite3 = require('sqlite3').verbose()
const { red } = require("./logic/library.js")
const { flattenKeys,  getAllPeople, sortObjByNumericKeys, getAffinityLetters_asHoH, getEntries_sortOnItsu_asLoH, rollupEntries_byDay_byTotalLifetimeValue } = require("./groupify.js")

async function main() { 

    // // Get the people!
    // const people = await getAllPeople()
    // // console.log( people )

    // // Get the entries!
    // const sql = "select * from entries limit 10000"
    // const entries_LoH = await getEntries_sortOnItsu_asLoH(sql)
 
    // for ( let i = 0 ; i < entries_LoH.length; i++ ) {
    //     const payload = JSON.parse(entries_LoH[i].payload)
    //     const flatObj = await flattenKeys(payload)
    //     entries_LoH[i].payload = flatObj
    //     console.log( entries_LoH[i] )
    // }

    const people = await getAllPeople()
    const number = 10000
    const sql = "select * from entries limit " + number
    const entries = await getEntries_sortOnItsu_asLoH(sql)
    const everything = await rollupEntries_byDay_byTotalLifetimeValue(entries)
    const keys = Object.keys(everything)
    console.log( JSON.stringify(everything, null, 2 )  )


}



if (require.main === module) {
    main() 
}
