const sqlite3 = require('sqlite3').verbose()
const { red } = require("./logic/library.js")
const { getGroupName, flattenKeys,  getAllPeople, sortObjByNumericKeys, getAffinityLetters_asHoH, getEntries_sortOnItsu_asLoH, rollupEntries_byDay_byTotalLifetimeValue } = require("./groupify.js")

async function main() { 

    // // Get the people!
    // const people = await getAllPeople()
    // // console.log( people )

    const people = await getAllPeople()
    const number = 10
    const sql = "select * from entries limit " + number
    const entries_LoH = await getEntries_sortOnItsu_asLoH(sql)


 
    for ( let i = 0 ; i < entries_LoH.length; i++ ) {
        const payload = JSON.parse(entries_LoH[i].payload)
        const flatObj = await flattenKeys(payload)
        entries_LoH[i].payload = flatObj
        const totalLifetimeValue = people[entries_LoH[i].pk]
        const groupName = getGroupName(totalLifetimeValue)
        entries_LoH[i].totalLifetimeValue = totalLifetimeValue
        entries_LoH[i].groupName = groupName
    }
        
    console.log( entries_LoH ) 
}



if (require.main === module) {
    main() 
}
