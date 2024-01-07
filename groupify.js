const sqlite3 = require('sqlite3').verbose()
const { red } = require("./logic/library.js")

const { selecter, getTheBeginningDay, peek } = require('./logic/db_handler.js')
const everything = {}


async function getAffinityLetters_asHoH() {
    let HoH = {}
    const sql = "select * from affinity_letter_vector;"
    const LoH = await selecter(sql)
    for (let i = 0; i < LoH.length; i++) {
        const key = LoH[i]["key"]
        HoH[key] = {
            seen: LoH[i]["seen"],
            //value: LoH[i]["value"],
            letter: LoH[i]["letter"],
            isChild: LoH[i]["isChild"]
        }
    }
    return HoH
}

class groups_by_day {
    constructor(day) {
        this.day = day
        this.groups = {
            "negative": [],
            "zero": [],
            "1000": [],
            "5000": [],
            "10000": [],
            "20000": [],
            "30000": [],
            "40000": [],
            "50000": [],
            "60000": [],
            "70000": [],
            "80000": [],
            "more": [],
        }
    }
}




function sortObjByNumericKeys(arrayOfKeys) {
    let keys = []
    arrayOfKeys.forEach((key) => {
        keys.push(parseInt(key))
    })
    keys = keys.sort((a, b) => a - b);
    return keys
}



async function getEntries_sortOnItsu_asLoH(selectSql) {
    //selectSql = "select * from entries limit 10;"
    const LoH = await selecter(selectSql)
    LoH.sort((a, b) => a.itsu - b.itsu);
    return LoH
}

async function getAllPeople() { 
    const sql = "select * from people"
    const LoH = await selecter(sql)
    let people = {} 
    LoH.forEach((person)=> {
        const pk = person.pk 
        const lifetimeValue = person.tlv 
        people[pk] = lifetimeValue
    }) 
    return people
}

async function getEntries_dealWithThem(entries_asLoH) {

    let results = {}
    for (let i = 0; i < entries_asLoH.length; i++) {
        const obj = entries_asLoH[i]

        if (!results.hasOwnProperty(obj.itsu)) {
            // Add a new day!
            results[obj.itsu] = new groups_by_day(obj.itsu)
            console.log( obj )
        }





    }
    return results
}



if (require.main === module) {

}

module.exports = { getAllPeople, sortObjByNumericKeys, getAffinityLetters_asHoH, getEntries_sortOnItsu_asLoH, getEntries_dealWithThem }