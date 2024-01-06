const noise = ["timestamp.S", "expires.N", "__typename.S", "current.S", "hashedEmail.S", "all.N"]

/**
 * This is here just for readibility's sake
 * @param {objFromDynamo}
 * @returns {flatmap}
 */
function cleanObject(objFromDynamo) {
    return flattenObject(objFromDynamo)
}

/**
 * 
 * @param {*} number 
 * @returns excel letter
 */
function numberToExcelLetter(number) {
    let result = '';
    while (number > 0) {
        const remainder = (number - 1) % 26; // 0 to 25
        result = String.fromCharCode(65 + remainder) + result;
        number = Math.floor((number - 1) / 26);
    }
    return result;
}

/**
 * Takes objects in DynamoDB json format and flattens it and removes noise and hand that back
 * 
 * @{objectToFlatten} - arbitrarily complex, well formed, json 
 * @returns {flatmap} 
 */
function flattenObject(objectToFlatten) {
    function flattener(obj) {
        const accumulator = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] == 'object' && obj[key] != null) {
                    const flatObject = flattener(obj[key]);
                    for (let x in flatObject) {
                        if (flatObject.hasOwnProperty(x)) {
                            accumulator[key + '.' + x] = flatObject[x];
                        }
                    }
                } else {
                    accumulator[key] = obj[key];
                }
            }
        }
        return accumulator;
    }
    const before = flattener(objectToFlatten);


    const middle = beautifyKeys(before)
    const middle2 = dealWithCID(middle)
    const after = destringifyNumbers(middle2)
    return after
}
/**
 * CID: Mostly the values are numbers or strings. CID is different
 * Deal with that by turning it into an array. This curlyque is a side-effect of the flattener. 
 * @param {before} - A flatmap that potentially has keys like: cid.L.0.S and a value of a string
 * @returns {after} - A pretty flatmap w/o those keys and given a new key 'cid' and a value of an array of strings
 */
function dealWithCID(flatMap) {
    //"cid.L.0.S": "Google_PMAX_US_NAT_EN_W_Hybrid_Leggings_GEN_Y22_ag=",
    let cid = []
    let toDelete = []
    for (let k in flatMap) {
        if (k.startsWith("cid.L")) {
            toDelete.push(k)
            cid.push(flatMap[k])
        }
    }
    flatMap["cid"] = cid
    for (let i = 0; i < toDelete.length; i++) {
        const thingToKill = toDelete[i]
        /// console.log("thingToKill " + thingToKill)
        delete flatMap[thingToKill]
    }
    return flatMap
}
/**
 * Remove DynamoDB noise from the data
 * @param {before} - A flatmap with ugly keys
 * @returns {after} - A pretty flatmap
 */



function beautifyKeys(before) {
    let after = {}

    before["PK"] = before["PK.S"]
    before["SK"] = before["SK.S"]
    before["oktaID"] = before["oktaID.S"]
    delete before["PK.S"]
    delete before["SK.S"]
    delete before["oktaID.S"]

    for (let k in before) {
        let keep = true
        for (let i = 0; i < noise.length; i++) {
            if (k.endsWith(noise[i])) {
                keep = false
            }
        }
        if (keep === true) {
            let clean = k
            clean = k.replace(/\.N/g, '')
            clean = clean.replace(/\.S\./g, '')
            clean = clean.replace(/\.M/g, '')
            clean = clean.replace(/\'s/g, '_s')
            clean = clean.replace(/ /g, '_')
            after[clean] = before[k]
        }
    }
    after = setWho_getWhen(after)
    return after
}

/**
 * Unflatten a flat map
 * 
 * @param {flat map}  
 * @returns {inflated map}
 */
const inflateObject = (flatObject) => {
    const result = {};

    for (const key in flatObject) {
        const parts = key.split('.');
        let currentObj = result;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (!currentObj[part]) {
                if (i === parts.length - 1) {
                    currentObj[part] = flatObject[key];
                } else {
                    // Check if the next part is a number to determine if it's an array or an object
                    currentObj[part] = isNaN(parts[i + 1]) ? {} : [];
                }
            }
            currentObj = currentObj[part];
        }
    }
    return result;
};
/**
 * Get the PK and the SK from an object and clean it up
 * 
 * @param{flatmap } - The SK key has value like 'LIFETIME#00ubewyn8GnxGuU3V4x6#1692806925'
 * @returns{flatmap} - Set the SK to 2nd value (when) and the PK to 1st value (who)
 */
function setWho_getWhen(flatmap) {
    try {
        const pieces = flatmap["SK"].split("#")
        flatmap["PK"] = pieces[1]
        flatmap["SK"] = pieces[2]
        return flatmap
    } catch (boom) {
        console.log("library.setWho_getWhen() failure! " + boom.message)
        console.log(flatmap)
    }
}

/**
 * Convert 'number' strings to numbers
 * @param{flatmap}
 * @returns{flatmap}
 */
function destringifyNumbers(flatmap, isTest = false) {
    for (let k in flatmap) {
        if (k !== "PK" && k !== "oktaID" && k !== "cid") {
            const x = parseInt(flatmap[k], 10)
            if (isNaN(x)) {
                if (isTest === false) {
                    console.log(".............")
                    console.log(JSON.stringify(flatmap, null, 2))
                    console.log("<<<<<<<<<<<<<<")
                }
                throw new Error("FAILBOT! " + k)
            }
            flatmap[k] = x
        }
    }
    return flatmap

}

function yyyymmdd_hhmmss(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 
 * @param {seconds} early 
 * @param {seconds} timestamp 
 * @returns {ms:milliseconds, days:days}
 */
async function getDayDelta(beginTime, timestamp) {
    const deltaMS = Math.abs(new Date(timestamp) - beginTime);
    const deltaDay = Math.ceil(deltaMS / (1000 * 60 * 60 * 24));

    return { "ms": deltaMS, "days": deltaDay }
}


const COMMON_THINGS = {
    DB_NAME: "THE_DATABASE.db",
    TABLE_PEOPLE_NAME: "people",
    TABLE_AFFINITY_LETTER_VECTOR_NAME: "affinity_letter_vector",
    TABLE_CAMPAIGN_LETTER_VECTOR_NAME: "campaign_letter_vector",
    TABLE_ENTRIES_NAME: "entries",
    TABLE_CAMPAIGNS_NAME: "campaigns",
    TABLE_GROUP_AFFINITY_DAY_NAME:"group_affinity_day",
    TABLE_PEOPLE_GROUPS:"people_groups",
    TABLE_TLV_AFFINITY_DAY:"tlv_affinity_day",
    FAIL: "FAIL",
    PASS: "PASS",
    NEGATIVE:0,
    POSITIVE:1,
    UNIT_VECTOR: 20,
    // If a table row has this - it was a test: Feel free to delete it!
    TEST_FLAG: -9999999,
    NOT_APPLICABLE:-2,
    PEOPLE_FINISHED_FILE: "PEOPLE_FINISHED.json",
    PEOPLE_TODO_FILE: "PEOPLE_TODO.json",
    // FINDME! TODO! CHANGE THIS TO DO THE REAL THING!
    PAGINATION: 100
}



const colors = {
    bg_red: "\x1b[41m",
    bg_cyan: "\x1b[46m",
    bg_yellow: "\x1b[43m",
    bg_green: "\x1b[92m",
    bold: "\x1b[1m",
    reset: "\x1b[0m"
}
function red(msg) {
    console.log(colors.bg_red + msg + colors.reset)
}
function yellow(msg) {
    console.log(colors.bg_yellow + msg + colors.reset)
}
function green(msg) {
    console.log(colors.bg_green + msg + colors.reset)
}

function addVectors(v1, v2) {
    let v = [] 
    for ( let i = 0; i < v1.length; i++ ) {
        v[i] = v1[i] + v2[i]
    } 
    return v
}
function vectorScalarMultiply(v1, scalar) {
    let v = []
    for ( let i = 0; i < v1.length; i++ ) {
        v[i] = v1[i] * scalar
    } 
    return v
}

/**
 * return a Random Index Vector
 */
function getVector() {
    let v = []
    for (let i = 0; i < COMMON_THINGS.UNIT_VECTOR; i++) {
        if (Math.random() > 0.5) {
            v[i] = 1
        } else {
            v[i] = -1
        }
    }
    return v
}
function importantMsg(meta, actual) {
    if (meta === COMMON_THINGS.FAIL) {
        const x = colors.bold + colors.bg_red + meta + colors.reset
        console.log(x + " " + actual)
    } else {
        const x = colors.bold + colors.bg_cyan + meta + colors.reset
        console.log(x + " " + actual)
    }
}





function convertAndCleanDynamoDBJSON(dynamoDbJson) {
    let normalJson = {};

    Object.keys(dynamoDbJson).forEach(key => {
        // Clean the key
        const cleanKey = key.replace(/\s+/g, '_').replace(/'/g, '^');

        // Skip 'timestamp' keys
        if (cleanKey === 'timestamp') return;

        const value = dynamoDbJson[key];

        if (value.hasOwnProperty('S')) {
            normalJson[cleanKey] = value['S'];
        } else if (value.hasOwnProperty('N')) {
            const numberValue = parseFloat(value['N']);
            if (numberValue !== 0) {
                normalJson[cleanKey] = numberValue;
            }
        } else if (value.hasOwnProperty('M')) {
            const convertedMap = convertAndCleanDynamoDBJSON(value['M']);
            if (Object.keys(convertedMap).length > 0) {
                normalJson[cleanKey] = convertedMap;
            }
        } else if (value.hasOwnProperty('L')) {
            normalJson[cleanKey] = value['L'].map(item => convertAndCleanDynamoDBJSON(item.M)).filter(item => Object.keys(item).length > 0);
        } else if (value.hasOwnProperty('BOOL')) {
            normalJson[cleanKey] = value['BOOL'];
        } else if (value.hasOwnProperty('NULL')) {
            normalJson[cleanKey] = null;
        } else if (value.hasOwnProperty('B')) {
            normalJson[cleanKey] = value['B'];
        } else if (value.hasOwnProperty('SS')) {
            normalJson[cleanKey] = value['SS'];
        } else if (value.hasOwnProperty('NS')) {
            normalJson[cleanKey] = value['NS'].map(n => parseFloat(n)).filter(n => n !== 0);
        } else if (value.hasOwnProperty('BS')) {
            normalJson[cleanKey] = value['BS'];
        }
    });

    return normalJson;
}

function beautifyRawRecord(dynamoDbJson) {
    // convert the DynamoDBJSON to proper JSON: 
    // A: Toss the 'S', 'N' etc metainfo
    // B: Toss redundent info, such as timestamp
    // C: Toss the now pointless info, expires, current, SK, PK and __typename
    // D: Toss PII hashEmail and Okta

    let normalJson = {};
    const ignore = ["timestamp", "expires", "__typename", "current", "hashedEmail", "oktaID", "PK", "SK"]
    for (const key in dynamoDbJson) {

        if (ignore.includes(key)) { continue; }



        const value = dynamoDbJson[key];

        // Process different data types
        if (value.hasOwnProperty('S')) {
            normalJson[key] = value['S'];
        } else if (value.hasOwnProperty('N')) {
            normalJson[key] = parseFloat(value['N']);
            // Remove the key if the value is 0
            if (normalJson[key] === 0) {
                delete normalJson[key];
            }
        } else if (value.hasOwnProperty('M')) {
            normalJson[key] = beautifyRawRecord(value['M']);
        } else if (value.hasOwnProperty('L')) {
            normalJson[key] = value['L'].map(item => beautifyRawRecord(item));
        } else if (value.hasOwnProperty('BOOL')) {
            normalJson[key] = value['BOOL'];
        } else if (value.hasOwnProperty('NULL')) {
            normalJson[key] = null;
        } else if (value.hasOwnProperty('B')) {
            // 'B' is for Binary - convert to a base64-encoded string
            normalJson[key] = value['B'];
        } else if (value.hasOwnProperty('SS')) {
            normalJson[key] = value['SS'];
        } else if (value.hasOwnProperty('NS')) {
            normalJson[key] = value['NS'].map(n => parseFloat(n));
        } else if (value.hasOwnProperty('BS')) {
            normalJson[key] = value['BS']; // array of base64-encoded strings
        }

        // Empty key-value pair? Delete!
        if (typeof normalJson[key] === 'object' && !Array.isArray(normalJson[key]) && Object.keys(normalJson[key]).length === 0) {
            delete normalJson[key];
        }
    }

    return normalJson;


}

function date_grouper() {
    // Your list of objects with timestamps
    const objects = [
        { timestamp: new Date("2023-10-01").getTime() }, // Example timestamp for day1
        { timestamp: new Date("2023-10-02").getTime() }, // Example timestamp for day2
        // Add more objects with timestamps here
    ];

    // Create an array to represent the days
    const days = [];

    // Iterate through the objects and group them by day
    objects.forEach((object) => {
        // Calculate the day (1-indexed) based on the timestamp
        const timestamp = object.timestamp;
        const currentDate = new Date(timestamp);
        const day = Math.ceil((currentDate - startDate) / (24 * 60 * 60 * 1000)); // Assuming startDate is the start of day1

        // Ensure there is an array for this day
        if (!days[day]) {
            days[day] = [];
        }

        // Add the object to the corresponding day
        days[day].push(object);
    });

    // Optionally, sort the arrays within each day (if needed)
    days.forEach((dayArray) => {
        dayArray.sort((a, b) => a.timestamp - b.timestamp);
    });
    console.log(days)
    // Now, 'days' contains objects grouped by day
    // You can access 'day1', 'day2', and so on using days[1], days[2], etc.
}
function getDotProduct(vector1, vector2) {
    let result = 0;
    for (let i = 0; i < vector1.length; i++) {
        result += vector1[i] * vector2[i];
    }
    return result;
}
function getAngleBetweenVectors(vector1, vector2) {
    if (vector1.length !== vector2.length) {
        throw new Error("Vectors must have the same dimensionality.");
    }

    // Check if vectors are zero vectors
    const isZeroVector1 = vector1.every(component => component === 0);
    const isZeroVector2 = vector2.every(component => component === 0);

    if (isZeroVector1 || isZeroVector2) {
        return 0; // Angle between zero vectors is 0 degrees
    }

    let sumOfProducts = 0;
    let mag1Squared = 0;
    let mag2Squared = 0;

    for (let i = 0; i < vector1.length; i++) {
        sumOfProducts += vector1[i] * vector2[i];
        mag1Squared += vector1[i] * vector1[i];
        mag2Squared += vector2[i] * vector2[i];
    }

    const cosTheta = sumOfProducts / (Math.sqrt(mag1Squared) * Math.sqrt(mag2Squared));

    // Use Math.acos to calculate the arccosine (angle in radians)
    let angleInRadians_theta = Math.acos(cosTheta);
    if (isNaN(angleInRadians_theta)) {
        angleInRadians_theta = 0
    }
    // radians are alien; degrees are intuitive!
    const angleInDegrees = (angleInRadians_theta * 180) / Math.PI;
    return angleInDegrees
}
function getDistanceBetweenVectors(vector1, vector2) {
    if (vector1.length !== vector2.length) {
        throw new Error("Vectors must have the same dimensionality.");
    }
    let sumOfSquares = 0;
    for (let i = 0; i < vector1.length; i++) {
        const difference = vector1[i] - vector2[i];
        sumOfSquares += difference * difference;
    }
    const distance = Math.sqrt(sumOfSquares);
    return distance
}


function getVectorMagnitude(vector) {
    let sumOfSquares = 0;
    for (let i = 0; i < vector.length; i++) {
        sumOfSquares += vector[i] * vector[i];
    }
    return Math.sqrt(sumOfSquares);
}



if (require.main === module) {
    date_grouper()
}



function calculateNewPosition(x, y, angleDegrees, distance) {
    // Convert the angle from degrees to radians
    const angleRadians = (angleDegrees * Math.PI) / 180;

    // Calculate the new X and Y coordinates
    const x_new = x + distance * Math.cos(angleRadians);
    const y_new = y + distance * Math.sin(angleRadians);

    return { x: x_new, y: y_new };
}

function getLettersFromStrings(candidate, count) {
    if (candidate != undefined && candidate.length > 0) {
        const x = candidate.toLowerCase()
        const a = x.split(".")
        const obj = {}
        for (let i = 0; i < a.length; i++) {
            const value = a[i]
            const letter = numberToExcelLetter(count)
            count++
            obj[value] = letter
        }
        return [obj, count]
    } else {
        return undefined
    }

}




module.exports = { vectorScalarMultiply, addVectors, yyyymmdd_hhmmss, getDayDelta, red, green, yellow, beautifyRawRecord, getLettersFromStrings, calculateNewPosition, getAngleBetweenVectors, getDotProduct, getVectorMagnitude, getDistanceBetweenVectors, getVector, importantMsg, colors, numberToExcelLetter, cleanObject, flattenObject, inflateObject, destringifyNumbers, COMMON_THINGS }