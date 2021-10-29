// Global list of usable API calls for drop down selection - Anthony
let dropDownList = ['alignments', 'races', "classes"];
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
    addDropDownApiInfo(dropDownList[i]);
}

/*
    Seperated this  from above to be used later and not just at the loading of the page - Anthony
 */
function addDropDownApiInfo(selectName) {
    fetch('https://www.dnd5eapi.co/api/' + selectName)
        .then( response => response.json() )
        .then (data => {
            let select = document.getElementById(selectName);

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
    let lines=csv.split("\n");
    let result = [];
    let headers=lines[0].split(",");

    for(let i=1;i<lines.length;i++){
        let obj = {};
        let currentline=lines[i].split(",");
        let headers = lines[0].split(",");

        for(let j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

/*
        _____________________________________________________
        | LEAVE THIS COMMENTED OUT IF YOU AREN'T            |
        | WORKING ON A HTTP HOSTED WEPBAGE                  |
        | fetch ON A FILE IN OUR REPOSITORY WILL BREAK IT   |
        -----------------------------------------------------

    Proof of concept to read from JSON files
    fetch('./Data/first-names.json')
    .then(data => data.json())
    .then(data => {
        document.getElementById("output").innerHTML += data[5] + "<br/>";
    });
 */

/*
*********************
Work in progress to make Class and Level not show unless Threat is set to Yes - Anthony
*********************

function showExtras(selectedObject) {
    let threat = selectedObject.value;
    let parentDiv = document.getElementById("filters");
    if (threat === "Yes") {
        document.getElementById("gen")

        // Dynamically create class label if Threat set to Yes
        let label = document.createElement("label");
        label.setAttribute("for", "classes");
        label.innerHTML = "Class";
        let select = document.createElement("select");
        select.id = "classes";
        select.name = "classes";
        let opt = document.createElement("option");
        opt.text = "Random";
        opt.value = "Random";
        select.appendChild(opt);
        label.appendChild(select);
        parentDiv.appendChild(label);
    }
}
 */