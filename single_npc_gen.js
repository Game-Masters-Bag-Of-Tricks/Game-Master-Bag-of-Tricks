

//---------------------------------- Active Scripting on Page Load ---------------------------------------------
/*
    Functions and script commented with contributor name so others can ask that person directly
    with questions about sections of code that might need further explanation
 */


// Global list of usable API calls for drop down selection - Anthony
let dropDownList = ['alignments', 'races', "classes"];
let dropDownListAll = ['alignments', 'races', 'gender', 'threat', 'classes', 'level'];
let isThreat = false; // Used later to decide what to generate or not

// Initial JSON object creation - Anthony
let npc = {
    "name" : "",
    "align" : "",
    "race" : "",
    "gender" : "",
    "class" : "",
    "level" : "",
    "threat" : "",
    "occupation" : [
        {
            "super_name" : "",
            "sub_name" : "",
            "value" : 0
        }
    ],
    "appearance" : "",
    "abilities" : "",
    "talents" : "",
    "mannerisms" : "",
    "trait" : "",
    "ideals" : "",
    "bonds" : "",
    "flaws" : ""
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
    Without this the initial "Generate" option doesn't populate the name. This fixes that.
    I don't really know why it won't just generate the name the first time when the button
    is pushed - Anthony
 */
getName();


//------------------------------------------- Functions List ---------------------------------------------


/*
    Shows / Hides Class and Level selection depending on drop down selection of Threat - Anthony
 */
function showHidden(select) {
    let option = select.options[select.selectedIndex].value;
    if (option === "Yes") {
        document.getElementById("isThreat").hidden = false;
        isThreat = true;
    } else {
        document.getElementById("isThreat").hidden = true;
        isThreat = false;
    }
}

/*
    No real functionality. General set up to be able to read current drop down selections.
    Output is for testing purpose requires better formatting - Anthony
 */
function generateNPC() {
    console.log("Entering generation"); // Debug check point

    getName();

    for (let i = 0; i < dropDownListAll.length; i++) {
        console.log(dropDownListAll[i]);
        let select = document.getElementById(dropDownListAll[i]);

        let option = select.options[select.selectedIndex].value;

        switch(dropDownListAll[i]) {
            case "alignments":
                if (option === "Random") {
                    npc.align = getRandom('alignments');
                } else {
                    npc.align = option;
                }
                break;
            case "races":
                if (option === "Random") {
                    npc.race = getRandom('races');
                } else {
                    npc.race = option;
                }
                break;
            case "gender":
                if (option === "Random") {
                    npc.gender = getRandom('gender');
                } else {
                    npc.gender = option;
                }
                break;
            case "threat":
                if (option === "Random") {
                    npc.threat = getRandom('threat');
                } else {
                    npc.threat = option;
                }
                break;
            case "classes":
                if (option === "Random") {
                    npc.class = getRandom('classes');
                } else {
                    npc.class = option;
                }
            case "level":
                if (option === "Random") {
                    npc.level = getRandom('level');
                } else {
                    npc.level = option;
                }
                break;
        }
    }
    document.getElementById("output").innerHTML = printNPC() + "<br/>";
    getOccupation();
}

/*
    Randomly generates a first and last name using first-names.json and last-names.json
    Use of fetch requires website to be hosted through actual http in order to function.
    Upload to webpages.uncc or use Apache (or equivalent) for local hosting - Anthony
 */
function getName() {
    let name;
    // Get random first name
    fetch ('./Data/first-names.json')
        .then(data => data.json())
        .then(data => {
            let randNum = Math.floor(Math.random() * data.length);

            npc.name = data[randNum] + " ";
        })

    fetch ('./Data/last-names.json')
        .then(data => data.json())
        .then(data => {
            let randNum = Math.floor(Math.random() * data.length);

            npc.name += data[randNum];
        })
}

/*
    If dropdowns are set to random this function gets a random value and chooses
    one of the options for you. Different function since these values are fairly static
    and don't have a lot of data to pull from. - Anthony / Trent
 */
function getRandom(selectName) {
    console.log("Entering dropdown randomizer"); // Debug checkpoint

    let select = document.getElementById(selectName);
    let randNum = Math.floor(Math.random() * (select.options.length - 1)) + 1;
    console.log(selectName + " | " + select.options.length + " | " + randNum);
    let result = select.options[randNum].value

    return select.options[randNum].value;
}

/*
    Read from occupation.JSON and randomly select an occupation category and randomly select
    the occupation itself. Adds pertinent information to NPC JSON object. - Anthony
 */
function getOccupation() {
    // Read data from occupation.JSON
    fetch ('./Data/occupation.json')
        .then(data => data.json())
        .then(data => {
            // Get Random numbers for Occupation and Subtitle (not sure what this is called in DnD)
            let randSuper = Math.floor(Math.random() * data.length);
            let randSub = Math.floor(Math.random() * data[randSuper].sub.length);

            // Assign values to current NPC JSON object
            npc.occupation.super_name = data[randSuper].super;
            npc.occupation.sub_name = data[randSuper].sub[randSub].name
            npc.occupation.value = data[randSuper].sub[randSub].value;

            // Display (Mostly Testing purposes. REQUIRES FORMATTING)
            document.getElementById("occupation").innerHTML = "Occupation: " + npc.occupation.super_name +
            "</br>Subtitle: " + npc.occupation.sub_name;
        })
}

/*
    Test function to display current available features - Anthony
 */
function printNPC() {
    let output = "Name: " + npc.name +
        "<br/>Alignment: " + npc.align +
        "<br/>Race: " + npc.race +
        "<br/>Gender: " + npc.gender +
        "<br/>Threat: " + npc.threat;

    if (npc.threat === "Yes") {
        output +=
            "<br/>Class: " + npc.class +
            "<br/>Level: " + npc.level
    }

    return output;
}


//-------------------------------------- Potential Use / Potential Deletion -----------------------------------------
//----------------------------------------------- Currently Unused --------------------------------------------------


// Determines if the user has selected Random in NPC gen form
// option: selects value to compare if random
// selectName: gets passed to generateRandom()
function getRandomAPIOption(selectName) {
    console.log("Entering API randomizer"); // Debug checkpoint

    let results = "";
    return fetch('https://www.dnd5eapi.co/api/' + selectName)
        .then(response => response.json() )
        .then (data => {
            let randNum = Math.floor(Math.random() * data.results.length);
            results = data.results[randNum];
            results = results.name;
            return results;
        });

    /*
        How to output. FOR FUTURE USE
        getRandomAPIOption('races').then(results => npc.race = results)
     */
}