
const { vectorScalarMultiply, addVectors, yyyymmdd_hhmmss, getDayDelta, red, beautifyRawRecord, getLettersFromStrings, calculateNewPosition, getAngleBetweenVectors, getDotProduct, getVectorMagnitude, getDistanceBetweenVectors, getVector, colors, numberToExcelLetter, cleanObject, flattenObject, inflateObject, destringifyNumbers, COMMON_THINGS } = require("./library.js")
const { updater, deleter, selecter, getRowCount, inserter, setDB, closeDB } = require("./db_handler.js")

let everything_is_all_good = true
let count = 0
function verdict(a, b, msg) {
    count++
    const isSame = JSON.stringify(a) === JSON.stringify(b)
    // const judgment = isSame ? "PASS" : "FAIL"
    let judgment = colors.bold + colors.bg_red + "FAIL" + colors.reset
    if (isSame === true) {
        judgment = colors.bold + colors.bg_green + "PASS" + colors.reset
    } else {
        everything_is_all_good = false
    }
    const pretty = count < 10 ? " " + count : count
    console.log(pretty + " " + judgment + "  " + msg)
}
function isCloseEnough(float1, float2, tolerance) {
    // Calculate the absolute difference between the two floats
    const absoluteDifference = Math.abs(float1 - float2);
    // Check if the absolute difference is less than or equal to the tolerance
    return absoluteDifference <= tolerance;
}
function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
}
async function common_strings_test1() {
    const expected = [
        'DB_NAME',
        'TABLE_PEOPLE_NAME',
        'TABLE_AFFINITY_LETTER_VECTOR_NAME',
        'TABLE_CAMPAIGN_LETTER_VECTOR_NAME',
        'TABLE_ENTRIES_NAME',
        'TABLE_CAMPAIGNS_NAME',
        'TABLE_GROUP_AFFINITY_DAY_NAME',
        'TABLE_PEOPLE_GROUPS',
        'TABLE_TLV_AFFINITY_DAY',
        'FAIL',
        'PASS',
        'NEGATIVE',
        'POSITIVE',
        'UNIT_VECTOR',
        'TEST_FLAG',
        'NOT_APPLICABLE',
        'PEOPLE_FINISHED_FILE',
        'PEOPLE_TODO_FILE',
        'PAGINATION'
      ].sort()
    const actual = Object.keys(COMMON_THINGS).sort()
    let isOk = actual.length === expected.length
    if (isOk === false) {
        red("common_strings_test1 size mis-match " + actual.length + " vs " + expected.length)
    }
    for (let k in actual) {
        if (!expected.includes(actual[k])) {
            red("test is missing " + actual[k])
            isOk = false
        } else {
            // PASS! 
        }
    }

    verdict(isOk, true, "common_strings_test1 ")
}

const example_record = { "__typename": { "S": "LifetimeProfile" }, "hashedEmail": { "S": "d6f02ca7c55eec08124f7b43fbcaf90980590fdb14073d3ab084328869e99015" }, "genderAffinity": { "M": { "all": { "N": "0" }, "current": { "S": "women" }, "women": { "N": "63" }, "men": { "N": "0" }, "timestamp": { "S": "2023-08-23T16:08:43.626Z" } } }, "expires": { "N": "1740146925" }, "colorAffinity": { "M": { "Slate": { "N": "40" }, "current": { "S": "Grey" }, "timestamp": { "S": "2023-08-23T16:08:43.627Z" } } }, "SK": { "S": "LIFETIME#ABcdefghijk1234567890#1692806925" }, "PK": { "S": "LIFETIME#ABcdefghijk1234567890" }, "activityAffinity": { "M": { "On the Move": { "N": "62" }, "current": { "S": "On the Move" }, "timestamp": { "S": "2023-08-23T16:08:43.627Z" } } }, "oktaID": { "S": "ABcdefghijk1234567890" }, "categoryAffinity": { "M": { "What's New": { "N": "62" }, "Pants": { "N": "62" }, "Capris": { "N": "62" }, "current": { "S": "Capris" }, "timestamp": { "S": "2023-08-23T16:08:43.627Z" } } } }


async function cleanObject_test1() {
    const actual = cleanObject(example_record)
    const expected = {
        "genderAffinity.women": 63,
        "genderAffinity.men": 0,
        "colorAffinity.Slate": 40,
        "activityAffinity.On_the_Move": 62,
        "categoryAffinity.What_s_New": 62,
        "categoryAffinity.Pants": 62,
        "categoryAffinity.Capris": 62,
        "PK": "ABcdefghijk1234567890",
        "SK": 1692806925,
        "oktaID": "ABcdefghijk1234567890",
        "cid": []
    }
    verdict(actual, expected, "cleanObject_test1")
}
async function inflateObject_test1() {
    const x = { "__typename": { "S": "LifetimeProfile" }, "hashedEmail": { "S": "d6f02ca7c55eec08124f7b43fbcaf90980590fdb14073d3ab084328869e99015" }, "genderAffinity": { "M": { "all": { "N": "0" }, "current": { "S": "women" }, "women": { "N": "63" }, "men": { "N": "0" }, "timestamp": { "S": "2023-08-23T16:08:43.626Z" } } }, "expires": { "N": "1740146925" }, "colorAffinity": { "M": { "Slate": { "N": "40" }, "current": { "S": "Grey" }, "timestamp": { "S": "2023-08-23T16:08:43.627Z" } } }, "SK": { "S": "LIFETIME#ABcdefghijk1234567890#1692806925" }, "PK": { "S": "LIFETIME#ABcdefghijk1234567890" }, "activityAffinity": { "M": { "On the Move": { "N": "62" }, "current": { "S": "On the Move" }, "timestamp": { "S": "2023-08-23T16:08:43.627Z" } } }, "oktaID": { "S": "ABcdefghijk1234567890" }, "categoryAffinity": { "M": { "What's New": { "N": "62" }, "Pants": { "N": "62" }, "Capris": { "N": "62" }, "current": { "S": "Capris" }, "timestamp": { "S": "2023-08-23T16:08:43.627Z" } } } }
    const fo = flattenObject(x)
    const actual = inflateObject(fo)
    const expected = {
        "genderAffinity": {
            "women": 63,
            "men": 0
        },
        "colorAffinity": {
            "Slate": 40
        },
        "activityAffinity": {
            "On_the_Move": 62
        },
        "categoryAffinity": {
            "What_s_New": 62,
            "Pants": 62,
            "Capris": 62
        },
        "PK": "ABcdefghijk1234567890",
        "SK": 1692806925,
        "oktaID": "ABcdefghijk1234567890",
        "cid": []
    }
    verdict(actual, expected, "inflateObject_test1")
}
async function destringifyNumbers_happyPath() {
    const given = {
        "a": 1,
        "b": "2",
        "c": "1692806925"
    }
    const thisIsATest = true
    const actual = destringifyNumbers(given, thisIsATest)
    const expected = { a: 1, b: 2, c: 1692806925 }
    verdict(actual, expected, "destringifyNumbers_happyPath")
}

async function destringifyNumbers_poisonPath() {
    let isOk = false
    try {
        const given = {
            "a": 1,
            "b": "2",
            "c": "1692806925",
            "d": "poison"
        }
        const thisIsATest = true

        destringifyNumbers(given, thisIsATest)
    } catch (poison_got_found) {
        isOk = true
    }
    verdict(isOk, true, "destringifyNumbers_poisonPath")

}

async function cid_test1() {
    const given = {
        "SK.S": "LIFETIME#ThisIsMyKeyItIsThisLong#1688694194",
        "PK.S": "LIFETIME#ThisIsMyKeyItIsThisLong",
        // "cid.L.0.S": "Google_PMAX_US_NAT_EN_W_Hybrid_Leggings_GEN_Y22_ag=",
        "cid.L.0.S.": "one=",
        "cid.L.1.S.": "two=",
        "cid.L.2.S.": "three=",
        "cid.L.3.S.": "four=",
    }
    const actual = cleanObject(given)
    const expected = {
        PK: 'ThisIsMyKeyItIsThisLong',
        SK: 1688694194,
        oktaID: undefined,
        cid: ['one=', 'two=', 'three=', 'four=']
    }
    verdict(actual, expected, "cid_test1")
}

async function numberToExcelLetter_test1() {

    const given = [1, 26, 27, 100, 1000, 4000, 4001, 4002, 4003, 4004, 4005]
    const expected = ['A', 'Z', 'AA', 'CV', 'ALL', 'EWV', 'EWW', 'EWX', 'EWY', 'EWZ', 'EXA']
    let isOk = true
    given.forEach((number, i) => {
        const letter = numberToExcelLetter(number)
        const x = expected[i]
        if (letter !== x) {
            isOk = false
        }
    })
    verdict(isOk, true, "numberToExcelLetter_test1")
}

async function vector_test1_create() {
    const v = getVector()
    const sum = v.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const neg = -COMMON_THINGS.UNIT_VECTOR
    const pos = COMMON_THINGS.UNIT_VECTOR
    const isOk = sum > neg && sum < pos
    verdict(isOk, true, "vector_test1_create")
}

async function vector_test2_happypath_distance() {
    // 1
    const a1 = [1, 1, 1]
    const b1 = [1, 1, 0]
    const d1 = getDistanceBetweenVectors(a1, b1)
    // 
    const a2 = [-1, -1, -1, -1, -1, -1]
    const b2 = [1, 1, 1, 1, 1, 1]
    const d2 = getDistanceBetweenVectors(a2, b2)

    // d2 = 4.898979485566356
    let isOk = false
    if (d1 === 1 && d2 > 4.8 && d2 < 4.9) {
        isOk = true
    }
    verdict(isOk, true, "vector_test2_distance d=" + d2)
}

async function vector_test3_getVectorMagnitude() {
    const v1 = [1, -1, 1]
    const m1 = getVectorMagnitude(v1)

    const v2 = [1, -10, 1]
    const m2 = getVectorMagnitude(v2)

    //1.7320508075688772
    //10.099504938362077
    let isOk = false
    if (m1 > 1.7 && m1 < 1.8) {
        if (m2 > 10.0 && m2 < 10.1) {
            isOk = true
        }
    }
    verdict(isOk, true, "vector_test3_getVectorMagnitude m2=" + m2)
}

async function vector_test4_sadpath_distance() {
    let isOk = false
    try {
        const a1 = [1, 1, 1]
        const b1 = [1, 1, 0, 1] // OH NO! Length mismatch!
        const d1 = getDistanceBetweenVectors(a1, b1)
    } catch (failure) {
        isOk = true
    }
    verdict(isOk, true, "vector_test4_sadpath_distance")
}

async function vector_test5_getDotProduct() {
    const v1 = [1, 2, 3]
    const v2 = [2, 3, 4]
    const dp = getDotProduct(v1, v2)
    let isOk = dp === 20
    verdict(isOk, true, "vector_test5_getDotProduct dp=" + dp)
}

async function vector_test6_angle() {
    const tests = [
        {
            a: [1, 1, 1],
            b: [1, 1, 1],
            degrees: 0.01
        },
        {
            a: [1, 1, 0],
            b: [1, 1, 1],
            degrees: 35.2
        },
        {
            a: [1, 1, 0],
            b: [1, 1, 2],
            degrees: 54.7
        },
        {
            a: [-1, -1, -1],
            b: [1, 1, 1],
            degrees: 0.0
        },
        {
            a: [-10, -1000, -100],
            b: [-1, -1, -1],
            degrees: 50.3
        },
        {
            a: [-10, 100, 30],
            b: [-1, 10, 3],
            degrees: 0.0
        }

    ]
    let isOk = true
    for (let i = 0; i < tests.length; i++) {
        const a = tests[i].a
        const b = tests[i].b
        const degrees = tests[i].degrees

        const x = getAngleBetweenVectors(a, b)

        const isFine = isCloseEnough(x, degrees, 0.1)
        if (isFine === false) {
            console.log(x, a, b)
            isOk = false
        }
    }
    verdict(isOk, true, "vector_test6_angle")
}

async function vector_test7_sadpath_angle() {
    let isOk = false
    try {
        const too_many = [1, 1, 1, 1]
        const not_enough = [1, 2, 3]
        getAngleBetweenVectors(too_many, not_enough)
    } catch (failbot) {
        isOk = true
    }
    verdict(isOk, true, "vector_test7_sadpath_angle")
}

async function angle_test1_position() {

    // vx, y, angleDegrees, distance
    const tests = [
        {
            x: 0,
            y: 0,
            degrees: 0,
            distance: 100,
            expected: { x: 100, y: 0 }
        },
        {
            x: 0,
            y: 0,
            degrees: 90,
            distance: 100,
            expected: { x: 0, y: 100 }
        },
        {
            x: 0,
            y: 0,
            degrees: 180,
            distance: 100,
            expected: { x: -100, y: 0 }
        },
        {
            x: -10,
            y: -10,
            degrees: 180,
            distance: 100,
            expected: { x: -110, y: -10 }
        },
        {
            x: 0,
            y: 0,
            degrees: 361,
            distance: 100,
            expected: { x: 100, y: 2 }
        },
        {
            x: 0,
            y: 0,
            degrees: 360,
            distance: 100,
            expected: { x: 100, y: -0 }
        },

    ]
    let isOk = true
    for (let i = 0; i < tests.length; i++) {
        const x = tests[i].x
        const y = tests[i].y
        const angle = tests[i].degrees
        const dist = tests[i].distance
        const expected = tests[i].expected
        const result = calculateNewPosition(x, y, angle, dist)
        const rx = result.x.toFixed(0)
        const ry = result.y.toFixed(0)



        if (rx == expected.x && expected.y == ry) {
            // yay 
        } else {
            isOk = false
            console.log(rx, ry, expected.x, expected.y)
        }


    }

    verdict(isOk, true, "angle_test1_position")

}

function getLettersFromStrings_test() {
    let counter = 1;
    const candidate1 = "finCh.prettyWren"
    const [obj, n] = getLettersFromStrings(candidate1, counter)
    counter = n
    // console.log( counter )
    // console.log( obj )
    let isOk = true
    const expected1 = { finch: 'A', prettywren: 'B' }
    if (isEqual(expected1, obj)) {
        // yay
    } else {
        isOk = false
    }
    // // { finch: 'A', prettywren: 'B' }
    const candidate2 = "kittycat"
    const [obj2, n2] = getLettersFromStrings(candidate2, counter)
    counter = n2
    // console.log( "B :" + counter )
    if (counter != 4) {
        isOk = false
    }

    const candidate3 = ""
    const thisBetterBeUndefined = getLettersFromStrings(candidate3, counter)
    if (thisBetterBeUndefined !== undefined) {
        isOk = false
    }
    verdict(isOk, true, "getLettersFromStrings_test")
}

async function db_handler_updater_test() {
    const table = COMMON_THINGS.TABLE_ENTRIES_NAME
    let isOk = true
    // Put a test row in!
    const wildCards = ['?', '?', '?', '?', '?']
    const json = JSON.stringify({ "hello": "finch" })
    const PK_TARGET = "test_create_update_doubleCheck_kill"
    const values1 = [PK_TARGET, 0, 123, -456, json]
    await inserter(table, wildCards, values1) // Insert something to update


    // // Update that row!
    const updatedValue = 1001
    const updateSql = `update ${table} set itsu = ${updatedValue} where pk='${PK_TARGET}'`
    await updater(updateSql)

    // See if it worked!
    const rows = await selecter(`select * from ${table} where pk='${PK_TARGET}'`)
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].itsu !== updatedValue) {
            isOk = false
        }
    }

    // // Clean up!
    const killed = await deleter(`delete from ${table} where sk=0`)
    if (killed > 0) {
        // 
    } else {
        // nothing happeneded!
        isOk = false
    }

    verdict(isOk, true, "db_handler_updater_test: " + killed)
}

async function db_handler_test() {
    const table = COMMON_THINGS.TABLE_ENTRIES_NAME
    const itsu = COMMON_THINGS.TEST_FLAG
    const actual = {}
    actual["before"] = await getRowCount(table)
    // pk, sk, itsu, entry
    const o1 = JSON.stringify({ "hello": "world" })
    const wildCards = ['?', '?', '?', '?', '?']
    const values1 = ["abc", 0, 123, itsu, o1]
    const o2 = JSON.stringify({ "eeboo": "shabone" })
    const values2 = ["xyz", 0, 789, itsu, o2]
    await inserter(table, wildCards, values1)
    await inserter(table, wildCards, values2)
    actual["after"] = await getRowCount(table)
    const rows = await selecter("select * from " + table + " where itsu=" + itsu)
    actual['pk'] = rows[0]["pk"]
    actual['killCount'] = await deleter("delete from " + table + " where itsu=" + itsu)
    actual["afterAfter"] = await getRowCount(table)

    const expected = {
        "before": actual["before"],
        "after": 2 + actual["before"],
        "pk": "abc",
        "killCount": 2,
        "afterAfter": actual["before"]
    }
    let isOk = true
    for (let k in actual) {
        if (actual[k] !== expected[k]) {
            red(`db_handler_test: ${k} mis-match! ${actual[k]} visualViewport ${expected[k]} }`)
            isOk = false
        }
    }
    verdict(isOk, true, "db_handler_test: " + JSON.stringify(actual))
}

async function beautifyRawRecord_test() {
    const given = { "__typename": { "S": "LifetimeProfile" }, "expires": { "N": "1744399583" }, "colorAffinity": { "M": { "Brown": { "N": "0" }, "Neutral": { "N": "0" }, "current": { "S": "Blue" }, "White": { "N": "0" }, "Purple": { "N": "1" }, "Blue": { "N": "20" }, "Green": { "N": "0" }, "timestamp": { "S": "2023-10-11T21:25:51.558Z" } } }, "collectionAffinity": { "M": { "current": { "S": "Align" }, "Align": { "N": "1" }, "timestamp": { "S": "2023-10-11T21:25:59.610Z" } } }, "oktaID": { "S": "00u4uykittycatpAp4x7" }, "categoryAffinity": { "M": { "Shirts": { "N": "17" }, "current": { "S": "We Made Too Much" }, "Joggers": { "N": "39" }, "Coats & Jackets": { "N": "20" }, "Sweatpants": { "N": "39" }, "Skirts": { "N": "0" }, "We Made Too Much": { "N": "141" }, "Shorts": { "N": "0" }, "Pants": { "N": "118" }, "Long Sleeve Shirts": { "N": "17" }, "Trousers": { "N": "15" }, "timestamp": { "S": "2023-10-11T21:25:59.610Z" } } }, "hashedEmail": { "S": "8ac2a4711fe2something goes here0db8ad7239d61653b246c54cd99ae5aa5" }, "genderAffinity": { "M": { "all": { "N": "0" }, "current": { "S": "women" }, "women": { "N": "165" }, "men": { "N": "0" }, "timestamp": { "S": "2023-10-11T21:25:59.609Z" } } }, "SK": { "S": "LIFETIME#00u4uy7lafLsg1pAp4x7#1697059583" }, "PK": { "S": "LIFETIME#00u4uy7lafLsg1pAp4x7" }, "cid": { "L": [{ "S": "fb-pro_cgnn-EVRGN_REENG_DM_adsn-US_NAT_X_HV_adn-SN-FALL2023-RUN_DPA_V3" }] }, "activityAffinity": { "M": { "On the Move": { "N": "164" }, "Tennis": { "N": "0" }, "current": { "S": "On the Move" }, "Running": { "N": "0" }, "Yoga": { "N": "0" }, "Hiking": { "N": "0" }, "Swim": { "N": "0" }, "timestamp": { "S": "2023-10-11T21:25:59.609Z" } } } }
    const actual = beautifyRawRecord(given)
    const expected = {
        colorAffinity: { Purple: 1, Blue: 20 },
        collectionAffinity: { Align: 1 },
        categoryAffinity: {
            Shirts: 17,
            Joggers: 39,
            'Coats & Jackets': 20,
            Sweatpants: 39,
            'We Made Too Much': 141,
            Pants: 118,
            'Long Sleeve Shirts': 17,
            Trousers: 15
        },
        genderAffinity: { women: 165 },
        cid: [{}],
        activityAffinity: { 'On the Move': 164 }
    }
    const isOk = JSON.stringify(actual) === JSON.stringify(expected)
    verdict(isOk, true, "beautifyRawRecord_test")
}

async function getDayDelta_test() {
    const newYearsDay2023 = new Date('2023-01-01T00:00:00');
    const startMS = newYearsDay2023.getTime();
    const oneDay = 1000 * 60 * 60 * 24
    const halfYearLater = new Date(startMS);
    halfYearLater.setMonth(halfYearLater.getMonth() + 6)
    const twoDaysLater = new Date(startMS + (oneDay * 2));
    // 
    const sameDay = await getDayDelta(startMS, newYearsDay2023.getTime())
    const halfYear = await getDayDelta(startMS, halfYearLater.getTime())
    const nextNextDay = await getDayDelta(startMS, twoDaysLater.getTime())
    const actual = {
        sameDay: sameDay["days"],
        halfYear: halfYear["days"],
        nextNextDay: nextNextDay["days"]
    }
    const expected = {
        sameDay: 0,
        halfYear: 181,
        nextNextDay: 2
    }


    const isOk = JSON.stringify(actual) === JSON.stringify(expected)
    verdict(isOk, true, "getDayDelta: " + JSON.stringify(actual))
}


async function yyyymmdd_hhmmss_test() {
    const almostMidnight2023 = new Date('2023-01-01T01:02:03');
    const pretty = yyyymmdd_hhmmss(almostMidnight2023)
    const isOk = pretty === "2023:01:01 01:02:03"
    verdict(isOk, true, "yyyymmdd_hhmmss_test: |" + pretty + "|")
}

async function vectorScalarMultiply_test() { 
    const given = [
        1,  1, -1, -1, -1, -1,  1,
       -1, -1,  1, -1,  1,  1, -1,
       -1,  1, -1,  1, -1, -1
     ]
     const scalar = 3 
     const t1 = new Date().getTime() 
     const actual = vectorScalarMultiply( given, scalar) 
     const delta = new Date().getTime() - t1 
     const expected = [
        3,  3, -3, -3, -3, -3,  3,
       -3, -3,  3, -3,  3,  3, -3,
       -3,  3, -3,  3, -3, -3
     ] 
     const isOk = JSON.stringify(actual) === JSON.stringify(expected) && delta < 1
     verdict(isOk, true, "vectorScalarMultiply_test in ms " + delta  )
}

async function addVectors_test() {
    const v1 = getVector()
    const v2 = getVector()
    const v = addVectors(v1, v2)

    // Currently, each value of 'v' ought now to be:
    // -2 ( if both v1 and v2 had a value of -1 )
    // 0 ( if one had a +1 and the other had a -1)
    // +2 ( if both v1 and v2 had a value of 2)
    // Therefore, just sum it and see if the value is even
    sum = v.reduce((_, x) => _ + x, 0);
    const isOk = Math.abs(sum) % 2 === 0;

    verdict(isOk, true, "addVectors_test: |" + sum + "|")



}
async function main() {

    setDB("./../" + COMMON_THINGS.DB_NAME)

    await common_strings_test1()
    await cleanObject_test1()
    await inflateObject_test1()
    await destringifyNumbers_happyPath()
    await destringifyNumbers_poisonPath()
    await cid_test1()
    await numberToExcelLetter_test1()
    await vector_test1_create()
    await vector_test2_happypath_distance()
    await vector_test3_getVectorMagnitude()
    await vector_test4_sadpath_distance()
    await vector_test5_getDotProduct()
    await vector_test6_angle()
    await angle_test1_position()
    await getLettersFromStrings_test()
    await db_handler_test()
    await db_handler_updater_test()
    await beautifyRawRecord_test()
    await getDayDelta_test()
    await yyyymmdd_hhmmss_test()
    await addVectors_test()
    await vectorScalarMultiply_test() 

    await verdict(everything_is_all_good, true, "*** All the tests passed ***")

    try {
        const thisIsJustATest = true // Prevent noisy consolelogs while in test mode
        closeDB("test", thisIsJustATest)
    } catch (failure) {
        console.log(failure)
        isOk = false
    }
}

main()