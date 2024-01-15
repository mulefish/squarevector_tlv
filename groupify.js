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

class GroupsByDay {
    constructor(day) {
        this.day = day
        this.groups = {} 
    }
    getGroups() {
        return this.groups
    }
    getDay() { 
        return this.day
    }
    addPayload(tlv, payload) {
        let level = undefined
        if (tlv < 0) {
            level = "GROUP_NEGATIVE"
        } else if (tlv === 0) {
            level = "GROUP_ZERO"
        } else if (tlv <= 1000) {
            level = "GROUP_1K"
        } else if (tlv <= 5000) {
            level = "GROUP_5K"
        } else if (tlv <= 10000) {
            level = "GROUP_10K"
        } else if (tlv <= 20000) {
            level = "GROUP_20K"
        } else if (tlv <= 30000) {
            level = "GROUP_30K"
        } else if (tlv <= 40000) {
            level = "GROUP_40K"
        } else if ( tlv <= 50000) {
            level = "GROUP_50K"
        } else if ( tlv <= 60000 ) {
            level = "GROUP_60K"
        } else if ( tlv <= 70000) {
            level = "GROUP_70K"
        } else if ( tlv <= 80000) {
            level = "GROUP_80K"
        } else {
            level = "GROUP_MORE"
        }
        if ( ! this.groups.hasOwnProperty(level)) {
            this.groups[level] = {}
        }
        for ( let k in payload ) {
            if ( this.groups[level].hasOwnProperty(k)) {
                this.groups[level][k]++
            } else {
                this.groups[level][k] = 1
            }
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
    LoH.forEach((person) => {
        const pk = person.pk
        const lifetimeValue = person.tlv
        people[pk] = lifetimeValue
    })
    return people
}

async function flattenKeys(payload) {
    let objWithFlattenedKeys = {} 

    for (let parent in payload) {
        let prettyParent = parent.toLowerCase()
        // child affinities for a parent affinity
        for (let child in payload[parent]) {
            const value = payload[parent][child]
            const cleanChild = child.replace(/\s+/g, '_').replace(/'/g, '^').toLowerCase().trim();
            const compoundKey = `${prettyParent}.${cleanChild}`
            objWithFlattenedKeys[compoundKey] = value 
        }
    }
    return objWithFlattenedKeys
}




async function rollupEntries_byDay_byTotalLifetimeValue(entries_asLoH) {
    /* This is the core of this file - everything else is here to support this function */ 
    const people = await getAllPeople()
    let everything = {}
    for (let i = 0; i < entries_asLoH.length; i++) {
        const obj = entries_asLoH[i]
        const day = obj.itsu
        if (!everything.hasOwnProperty(obj.itsu)) {
            // Add a new day!
            everything[day] = new GroupsByDay(day)
        }
        const tvl = people[obj.pk]
        const payload = JSON.parse(obj.payload)
        everything[day].addPayload(tvl, payload)
        //console.log( payload)
    }
    return everything
}



if (require.main === module) {

}

module.exports = {flattenKeys,  getAllPeople, sortObjByNumericKeys, getAffinityLetters_asHoH, getEntries_sortOnItsu_asLoH, rollupEntries_byDay_byTotalLifetimeValue }