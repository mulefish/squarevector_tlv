const sqlite3 = require('sqlite3').verbose()
const { selecter } = require('./logic/db_handler.js')
const everything = {}

async function getAffinityLetters_asHoH() {
    let HoH = {}
    const sql = "select * from affinity_letter_vector;"
    const LoH = await selecter(sql)
    for (let i = 0; i < LoH.length; i++) {
        const key = LoH[i]["key"]
        HoH[key] = {
            seen: LoH[i]["seen"],
            letter: LoH[i]["letter"],
            isChild: LoH[i]["isChild"]
        }
    }
    return HoH
}

function getGroupName(tlv) { 
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
    return level 
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


let day_group_entries = {} 
function add_day_group_entry(complex_entry) {
    const pk = complex_entry 



} 

async function summerize_this_is_last_step_before_db_insert( LoH) {

    let day_group_entries_HoH = {} 
    for ( let i = 0 ; i < LoH.length; i++ ) { 
        const obj = LoH[i] 
        if ( ! day_group_entries_HoH.hasOwnProperty(obj.itsu)) {
            day_group_entries_HoH[obj.itsu] = {} 
        }
        if ( ! day_group_entries_HoH[obj.itsu].hasOwnProperty(obj.groupName) ) { 
            day_group_entries_HoH[obj.itsu][obj.groupName] = {} 
            day_group_entries_HoH[obj.itsu][obj.groupName]['count'] = 0 
            day_group_entries_HoH[obj.itsu][obj.groupName]['payload'] = {} 
            day_group_entries_HoH[obj.itsu][obj.groupName]['cid'] = 0  
        }

        for ( let affinity in obj.payload) {
            const seenCount = obj.payload[affinity]
            if (  day_group_entries_HoH[obj.itsu][obj.groupName]['payload'].hasOwnProperty(affinity)) {
                day_group_entries_HoH[obj.itsu][obj.groupName]['payload'][affinity] += seenCount
            } else {
                day_group_entries_HoH[obj.itsu][obj.groupName]['payload'][affinity] = seenCount
            }
            day_group_entries_HoH[obj.itsu][obj.groupName]['count']++
            day_group_entries_HoH[obj.itsu][obj.groupName]['cid'] += obj.cid
        }
    }
    return day_group_entries_HoH
}
module.exports = { summerize_this_is_last_step_before_db_insert, getGroupName, flattenKeys,  getAllPeople, sortObjByNumericKeys, getAffinityLetters_asHoH, getEntries_sortOnItsu_asLoH, rollupEntries_byDay_byTotalLifetimeValue }