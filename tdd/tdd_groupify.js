const { selecter } = require('./../logic/db_handler.js')
const { verdict } = require("./../logic/library.js")
const { flattenKeys, getAllPeople, sortObjByNumericKeys, rollupEntries_byDay_byTotalLifetimeValue, getAffinityLetters_asHoH, getEntries_sortOnItsu_asLoH } = require('./../groupify.js')
const testCount = 6
async function getAffinityLetters_asHoH_test() {
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
    verdict(isOk, true, `1 of ${testCount}: getAffinityLetters_asHoH_test`)
}

async function getEntries_sortOnItsu_asLoH_test() {
    const number = 10
    const sql = "select * from entries limit " + number
    const LoH = await getEntries_sortOnItsu_asLoH(sql)
    const lastIndex = LoH.length - 1
    let isOk = true
    isOk &&= LoH.length === number
    isOk &&= LoH[0].itsu < LoH[lastIndex].itsu
    verdict(isOk, true, `2 of ${testCount}: getEntries_sortOnItsu_asLoH_test`)
}
async function sortObjByNumericKeys_test() {
    const given = ["34", "26", "102", "2"]
    const actual = sortObjByNumericKeys(given)
    const expected = [2, 26, 34, 102]
    const isOk = JSON.stringify(actual) === JSON.stringify(expected)
    verdict(isOk, true, `3 of ${testCount}: sortObjByNumericKeys_test`)
}

async function getAllPeople_test() {
    const people = await getAllPeople()
    const n = Object.keys(people).length
    const isOk = n > 0
    verdict(isOk, true, `4 of ${testCount}: getAllPeople_test has ` + n)
}

async function flattenKeys_test() {
    const payload = { "genderAffinity": { "women": 20 }, "collectionAffinity": { "Align": 20 }, "activityAffinity": { "Yoga": 20 }, "categoryAffinity": { "Bestsellers": 21, "Leggings": 20, "Gift Ideas": 20, "Matching Sets": 20, "What's New": 21, "Pants": 20, "Women's 0-14": 20 } }
    const flattened = await flattenKeys(payload)
    const expected = {
        'genderaffinity.women': 20,
        'collectionaffinity.align': 20,
        'activityaffinity.yoga': 20,
        'categoryaffinity.bestsellers': 21,
        'categoryaffinity.leggings': 20,
        'categoryaffinity.gift_ideas': 20,
        'categoryaffinity.matching_sets': 20,
        'categoryaffinity.what^s_new': 21,
        'categoryaffinity.pants': 20,
        'categoryaffinity.women^s_0-14': 20
    }
    const isOk = JSON.stringify( flattened) === JSON.stringify( expected )
    verdict(isOk, true, `5 of ${testCount}: flattenKeys_test`)
}

async function rollupEntries_byDay_byTotalLifetimeValue_test() {
    const people = await getAllPeople()
    const number = 10
    const sql = "select * from entries limit " + number
    const entries = await getEntries_sortOnItsu_asLoH(sql)
    const everything = await rollupEntries_byDay_byTotalLifetimeValue(entries)
    const keys = Object.keys(everything)
    const n = keys.length
    let isOk = true
    isOk &&= n > 0
    const firstKey = keys[0]
    isOk &&= everything[firstKey].getDay() > -1
    const groups = everything[firstKey].getGroups()
    isOk &&= groups != undefined
    //console.log( JSON.stringify(everything, null, 2 )  )
    verdict(isOk, true, `6 of ${testCount}: rollupEntries_byDay_byTotalLifetimeValue_test`)
}


async function main() {
    await getAffinityLetters_asHoH_test()
    await getEntries_sortOnItsu_asLoH_test()
    await sortObjByNumericKeys_test()
    await getAllPeople_test()
    await flattenKeys_test()
    await rollupEntries_byDay_byTotalLifetimeValue_test()

}
main()


