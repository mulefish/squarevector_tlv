const sqlite3 = require('sqlite3').verbose()
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

function addEntry(entry) {

}

module.exports = { getAffinityLetters_asHoH, addEntry }