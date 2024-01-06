
function _getDayGroupCategorySums(_THE_MATRIX, _THE_JUMP_TABLE) {
  let accumulator = {}
  // Get the groups 
  _THE_MATRIX.forEach((row, rowIndex) => {
    if (rowIndex > 0) {
      const day = row[2]
      // console.log( day + "    " + rowIndex)
      const group = row[1]
      if (!accumulator.hasOwnProperty(day)) {
        accumulator[day] = {}
      }
      if (!accumulator[day].hasOwnProperty(group)) {
        accumulator[day][group] = {}
      }

      row.forEach((value, cellIndex) => {
        const key = _THE_MATRIX[0][cellIndex]

        if (_THE_JUMP_TABLE.hasOwnProperty(key)) {
          const category = key.split(".")[0]
          if (!accumulator[day][group].hasOwnProperty(category)) {
            accumulator[day][group][category] = 0
          }
          accumulator[day][group][category] += value
        }
      })
    }
  })
  return accumulator
}

function getDayGroupCategorySums() {
  DAY_GROUP_CATEGORY_SUMS = _getDayGroupCategorySums(THE_MATRIX, THE_JUMP_TABLE)
}


function _calculateStandardDeviation(numbers) {
  const n = numbers.length;
  const mean = numbers.reduce((acc, val) => acc + val, 0) / n;
  const variance = numbers.reduce((acc, val) => acc + ((val - mean) ** 2), 0) / n;
  return Math.sqrt(variance);
}

function getMean(numbers) {
  const n = numbers.length;
  const mean = numbers.reduce((acc, val) => acc + val, 0) / n;
  return mean
}


// Function to normalize and rescale a number
function rescaleNumber(number, min, max, newMin, newMax) {
  const normalized = (number - min) / (max - min);
  return normalized * (newMax - newMin) + newMin;
}

function getAbsoluteNumbers(HoHoH) {
  // console.log("%c" + JSON.stringify(HoHoH), "background:lightgreen")
  let accumulator_HoHoL = {}
  for (let day in HoHoH) {
    for (let group in HoHoH[day]) {
      if (!accumulator_HoHoL.hasOwnProperty(group)) {
        accumulator_HoHoL[group] = {}
      }
      for (let subgroup in HoHoH[day][group]) {

        if (!accumulator_HoHoL[group].hasOwnProperty(subgroup)) {
          accumulator_HoHoL[group][subgroup] = []
        }
        accumulator_HoHoL[group][subgroup].push(HoHoH[day][group][subgroup])
      }
    }
  }

  let step2 = {}
  for (let group in accumulator_HoHoL) {
    step2[group] = {}
    for (let subgroup in accumulator_HoHoL[group]) {
      const mean = getMean(accumulator_HoHoL[group][subgroup])
      step2[group][subgroup] = []
      accumulator_HoHoL[group][subgroup].forEach((n) => {
        step2[group][subgroup].push(n)
      })
    }
  }

  let theHighestNumber = 0 
  for (let group in step2) {
    for (let subgroup in step2[group]) {
      for ( let i = 0; i < step2[group][subgroup].length; i++) { 
        theHighestNumber = Math.max(theHighestNumber, step2[group][subgroup][i])
      }
    }
  }
  let step3 = {} 
  for (let group in step2) {
    step3[group] = {}
    for (let subgroup in step2[group]) {
      step3[group][subgroup] = []

      for ( let i = 0; i < step2[group][subgroup].length; i++) { 
        let x = step2[group][subgroup][i]
        // ratio!
        x = 100 * x / theHighestNumber
        step3[group][subgroup].push(x)
      }
    }
  }
  const ratioNumbers = step3 // Good for dataviz!
  const absoluteNumbers = step2 // Good for knowledge!
  console.log( JSON.stringify( absoluteNumbers, null, 2 ))
  return ratioNumbers
}



function getScaledValues(HoHoH) {
  // console.log("%c" + JSON.stringify(HoHoH), "background:lightgreen")
  let accumulator_HoHoL = {}
  for (let day in HoHoH) {
    for (let group in HoHoH[day]) {
      if (!accumulator_HoHoL.hasOwnProperty(group)) {
        accumulator_HoHoL[group] = {}
      }
      for (let subgroup in HoHoH[day][group]) {

        if (!accumulator_HoHoL[group].hasOwnProperty(subgroup)) {
          accumulator_HoHoL[group][subgroup] = []
        }
        accumulator_HoHoL[group][subgroup].push(HoHoH[day][group][subgroup])
      }
    }
  }

  let step2 = {}
  for (let group in accumulator_HoHoL) {
    step2[group] = {}
    for (let subgroup in accumulator_HoHoL[group]) {
      const mean = getMean(accumulator_HoHoL[group][subgroup])
      step2[group][subgroup] = []
      accumulator_HoHoL[group][subgroup].forEach((n) => {
        step2[group][subgroup].push(n - mean)
      })
    }
  }

  let step3 = {}
  for (let group in step2) {
    step3[group] = {}
    for (let subgroup in step2[group]) {
      step3[group][subgroup] = []
      const lowestValue = Math.min(...step2[group][subgroup]);
      // const highestValue = Math.max(...step2[group][subgroup]);
      const updatedNumbers = step2[group][subgroup].map(number => number + Math.abs(lowestValue));
      const highestValue = Math.max(...updatedNumbers);


      // updatedNumbers.forEach((n)=> { 
      //   step3[group][subgroup].push(step2[group][subgroup]  )
      // })


      updatedNumbers.forEach((n) => {
        step3[group][subgroup].push((500 * n / highestValue))
      })



    }
  }
  // console.log("%c" + JSON.stringify(HoHoH), "background:lightblue")
  //console.log("%c" + Object.keys(step3), "background:lightblue")


  return step3

}


try {
  module.exports = { _getDayGroupCategorySums, getScaledValues }
} catch (this_is_a_web_page) {
  if (this_is_a_web_page.message === "module is not defined") {
    // Ignore it. This is an artifact of TDD vs Webpage.
  } else {
    console.log(this_is_a_web_page.message)
  }
}