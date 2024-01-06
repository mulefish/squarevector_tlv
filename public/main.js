function peek() {
    const rightNow = new Date().getTime()

    fetch('/peek')
        .then(response => {
            if (!response.ok) {
                throw new Error('Something is wrong!');
            }
            return response.json();
        })
        .then(LoH => {
            let table = "<table border='1'><tr><th>Count</th><th>Table</th></tr>"
            LoH.forEach((obj) => {
                const c = obj["count"]
                const t = obj["table"]
                table += `<tr><td align='right'>${c}</td><td>${t}</td></tr>`
            })
            table += "</table>"
            document.getElementById("data-container").innerHTML = table
        })
        .catch(error => {
            alert("Very sad\n" + error)
        });
}


function getTheBeginningDay() {
    const rightNow = new Date().getTime()
  
    fetch('/getTheBeginningDay')
      .then(response => {
        if (!response.ok) {
          throw new Error('Something is wrong!');
        }
        return response.json();
      })
      .then(x => {
        console.log(x)
      })
      .catch(error => {
        alert("Very sad\n" + error)
      });
  }