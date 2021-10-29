// Global list of usable API calls for drop down selection - Anthony
let dropDownList = ['alignments', 'races', 'classes'];
let dropDownListAll = ['alignments', 'races', 'gender', 'classes', 'level', 'threat'];

// Initial JSON object creation. I still don't really know how these work. Like classes? idk - Anthony
let npc = {
    "name" : "Random",
    "align" : "",
    "race" : "",
    "gender" : "",
    "class" : "",
    "level" : "",
    "threat" : ""
}

/*
    Dynamically generates options for Alignment, Race, and Class from the DnD5e API - Anthony
 */
for (let i = 0; i < dropDownList.length; i++) {
    fetch('https://www.dnd5eapi.co/api/' + dropDownList[i])
        .then( response => response.json() )
        .then (data => {
            let select = document.getElementById(dropDownList[i]);

            for (const option of data.results) {
                let opt = document.createElement("option");
                opt.text = option.name;
                opt.value = option.name;
                select.appendChild(opt)
            }
        });
}

/*
    No real functionality. General set up to be able to read current drop down selections.
    Output is for testing purpose requires better formatting - Anthony
 */
function generateNPC() {
    // Overly complex attempt to use a loop and create a JSON object - Anthony
    for (let i = 0; i < dropDownListAll.length; i++) {
        let select = document.getElementById(dropDownListAll[i]);

        let option = select.options[select.selectedIndex].value;
        switch(dropDownListAll[i]) {
            case "alignments":
                npc.align = option;
                break;
            case "races":
                npc.race = option;
                break;
            case "gender":
                npc.gender = option;
                break;
            case "classes":
                npc.class = option;
            case "level":
                npc.level = option;
                break;
            case "threat":
                npc.threat = option;
                break;
        }
    }

    document.getElementById("output").innerHTML = printNPC() + "<br/>";
}

/*
    Test function to display drop down choices in a cleaned up manner - Anthony
 */
function printNPC() {
    return (
        "Name: " + npc.name +
        "<br/>Alignment: " + npc.align +
        "<br/>Race: " + npc.race +
        "<br/>Gender: " + npc.gender +
        "<br/>Class: " + npc.class +
        "<br/>Level: " + npc.level +
        "<br/>Threat: " + npc.threat
    )
}

/*
    To be used to read from csv files and convert to JSON objects for use.
    Not sure if this is the actual function I want I haven't tested it yet - Anthony
 */
function csvJSON(csv){
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}