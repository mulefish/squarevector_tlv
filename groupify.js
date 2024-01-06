const sqlite3 = require('sqlite3').verbose()
const { getTheBeginningDay, peek } = require('./logic/db_handler.js')
const everything = {}
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

module.exports = { addEntry }