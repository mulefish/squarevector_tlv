const { verdict } = require("./../logic/library.js")
const { summerize_this_is_last_step_before_db_insert, flattenKeys, getAllPeople, sortObjByNumericKeys, getAffinityLetters_asHoH, getEntries_sortOnItsu_asLoH } = require('./../groupify.js')
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


async function summerize_this_is_last_step_before_db_insert_test() { 

    const ready_to_be_summerized = [
        {
          pk: '00ua4per7xBPdICIj4x7',
          sk: 1699833344,
          cid: 1,
          itsu: 2,
          payload: {
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
          },
          totalLifetimeValue: 0,
          groupName: 'GROUP_ZERO'
        },
        {
          pk: '00ua4per7xBPdICIj4x7',
          sk: 1699833395,
          cid: 1,
          itsu: 2,
          payload: {
            'coloraffinity.printed': 5,
            'coloraffinity.black': 5,
            'coloraffinity.grey': 5,
            'coloraffinity.camo': 5,
            'collectionaffinity.align': 15,
            'categoryaffinity.bestsellers': 16,
            'categoryaffinity.leggings': 15,
            'categoryaffinity.gift_ideas': 15,
            'categoryaffinity.matching_sets': 15,
            'categoryaffinity.what^s_new': 16,
            'categoryaffinity.pants': 15,
            'categoryaffinity.women^s_0-14': 15,
            'genderaffinity.women': 15,
            'activityaffinity.yoga': 15
          },
          totalLifetimeValue: 0,
          groupName: 'GROUP_ZERO'
        },
        {
          pk: '00ua7c3x5sRz1uWIt4x7',
          sk: 1698199465,
          cid: 1,
          itsu: 21,
          payload: {
            'genderaffinity.all': 7,
            'genderaffinity.men': 20,
            'coloraffinity.red': 3,
            'coloraffinity.white': 3,
            'activityaffinity.on_the_move': 25,
            'categoryaffinity.we_made_too_much': 25,
            'categoryaffinity.accessories': 25,
            'categoryaffinity.bags': 28
          },
          totalLifetimeValue: 72,
          groupName: 'GROUP_1K'
        },
        {
          pk: '00ua7c3x5sRz1uWIt4x7',
          sk: 1698199585,
          cid: 1,
          itsu: 21,
          payload: {
            'genderaffinity.all': 27,
            'genderaffinity.men': 19,
            'coloraffinity.red': 3,
            'coloraffinity.white': 3,
            'activityaffinity.on_the_move': 25,
            'categoryaffinity.we_made_too_much': 24,
            'categoryaffinity.accessories': 24,
            'categoryaffinity.bags': 48
          },
          totalLifetimeValue: 72,
          groupName: 'GROUP_1K'
        },
        {
          pk: '00ua7c3x5sRz1uWIt4x7',
          sk: 1698199645,
          cid: 1,
          itsu: 21,
          payload: {
            'genderaffinity.all': 47,
            'genderaffinity.men': 18,
            'coloraffinity.red': 3,
            'coloraffinity.white': 3,
            'activityaffinity.on_the_move': 45,
            'categoryaffinity.we_made_too_much': 44,
            'categoryaffinity.accessories': 44,
            'categoryaffinity.bags': 68
          },
          totalLifetimeValue: 72,
          groupName: 'GROUP_1K'
        },
        {
          pk: '00ua7c3x5sRz1uWIt4x7',
          sk: 1698199765,
          cid: 1,
          itsu: 21,
          payload: {
            'genderaffinity.all': 67,
            'genderaffinity.men': 17,
            'coloraffinity.red': 3,
            'coloraffinity.white': 3,
            'activityaffinity.on_the_move': 45,
            'categoryaffinity.we_made_too_much': 43,
            'categoryaffinity.accessories': 43,
            'categoryaffinity.bags': 88
          },
          totalLifetimeValue: 72,
          groupName: 'GROUP_1K'
        },
        {
          pk: '00ua4per7xBPdICIj4x7',
          sk: 1696297663,
          cid: 1,
          itsu: 43,
          payload: {
            'genderaffinity.all': 1,
            'activityaffinity.on_the_move': 1,
            'categoryaffinity.bestsellers': 1,
            'categoryaffinity.accessories': 1,
            'categoryaffinity.shop_outfits': 1,
            'categoryaffinity.bags': 1,
            'categoryaffinity.what^s_new': 1
          },
          totalLifetimeValue: 0,
          groupName: 'GROUP_ZERO'
        },
        {
          pk: '00ua4per7xBPdICIj4x7',
          sk: 1696270529,
          cid: 1,
          itsu: 43,
          payload: {
            'genderaffinity.all': 1,
            'activityaffinity.on_the_move': 1,
            'categoryaffinity.bestsellers': 1,
            'categoryaffinity.accessories': 1,
            'categoryaffinity.shop_outfits': 1,
            'categoryaffinity.bags': 1,
            'categoryaffinity.what^s_new': 1
          },
          totalLifetimeValue: 0,
          groupName: 'GROUP_ZERO'
        },
        {
          pk: '00ua4per7xBPdICIj4x7',
          sk: 1696217783,
          cid: 1,
          itsu: 43,
          payload: {
            'genderaffinity.all': 1,
            'activityaffinity.on_the_move': 1,
            'categoryaffinity.bestsellers': 1,
            'categoryaffinity.accessories': 1,
            'categoryaffinity.shop_outfits': 1,
            'categoryaffinity.bags': 1,
            'categoryaffinity.what^s_new': 1
          },
          totalLifetimeValue: 0,
          groupName: 'GROUP_ZERO'
        },
        {
          pk: '00ua4per7xBPdICIj4x7',
          sk: 1696205234,
          cid: 1,
          itsu: 44,
          payload: {
            'genderaffinity.all': 10,
            'activityaffinity.on_the_move': 10,
            'categoryaffinity.bestsellers': 10,
            'categoryaffinity.accessories': 10,
            'categoryaffinity.shop_outfits': 10,
            'categoryaffinity.bags': 10,
            'categoryaffinity.what^s_new': 10
          },
          totalLifetimeValue: 0,
          groupName: 'GROUP_ZERO'
        }
      ]
      
      const day_group_entries_actual = await summerize_this_is_last_step_before_db_insert(ready_to_be_summerized)

      const expected = {
          "2": {
            "GROUP_ZERO": {
              "count": 24,
              "payload": {
                "genderaffinity.women": 35,
                "collectionaffinity.align": 35,
                "activityaffinity.yoga": 35,
                "categoryaffinity.bestsellers": 37,
                "categoryaffinity.leggings": 35,
                "categoryaffinity.gift_ideas": 35,
                "categoryaffinity.matching_sets": 35,
                "categoryaffinity.what^s_new": 37,
                "categoryaffinity.pants": 35,
                "categoryaffinity.women^s_0-14": 35,
                "coloraffinity.printed": 5,
                "coloraffinity.black": 5,
                "coloraffinity.grey": 5,
                "coloraffinity.camo": 5
              },
              "cid": 24
            }
          },
          "21": {
            "GROUP_1K": {
              "count": 32,
              "payload": {
                "genderaffinity.all": 148,
                "genderaffinity.men": 74,
                "coloraffinity.red": 12,
                "coloraffinity.white": 12,
                "activityaffinity.on_the_move": 140,
                "categoryaffinity.we_made_too_much": 136,
                "categoryaffinity.accessories": 136,
                "categoryaffinity.bags": 232
              },
              "cid": 32
            }
          },
          "43": {
            "GROUP_ZERO": {
              "count": 21,
              "payload": {
                "genderaffinity.all": 3,
                "activityaffinity.on_the_move": 3,
                "categoryaffinity.bestsellers": 3,
                "categoryaffinity.accessories": 3,
                "categoryaffinity.shop_outfits": 3,
                "categoryaffinity.bags": 3,
                "categoryaffinity.what^s_new": 3
              },
              "cid": 21
            }
          },
          "44": {
            "GROUP_ZERO": {
              "count": 7,
              "payload": {
                "genderaffinity.all": 10,
                "activityaffinity.on_the_move": 10,
                "categoryaffinity.bestsellers": 10,
                "categoryaffinity.accessories": 10,
                "categoryaffinity.shop_outfits": 10,
                "categoryaffinity.bags": 10,
                "categoryaffinity.what^s_new": 10
              },
              "cid": 7
            }
          }
        }
        
        const isOk = JSON.stringify( day_group_entries_actual) === JSON.stringify(expected)
        verdict(isOk, true, "6 of ${testCount}: summerize_this_is_last_step_before_db_insert_test")


}

async function main() {
    await getAffinityLetters_asHoH_test()
    await getEntries_sortOnItsu_asLoH_test()
    await sortObjByNumericKeys_test()
    await getAllPeople_test()
    await flattenKeys_test()
//    await rollupEntries_byDay_byTotalLifetimeValue_test()
    await summerize_this_is_last_step_before_db_insert_test() 

}
main()


