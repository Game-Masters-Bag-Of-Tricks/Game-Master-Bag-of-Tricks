

//---------------------------------- Active Scripting on Page Load ---------------------------------------------
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
    "interaction" : "",
    "ideal" : "",
    "bond" : "",
    "flaw" : ""
}

/*
    Dynamically generates options for Alignment, Race, and Class from the DnD5e API
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


//------------------------------------------- Functions List ---------------------------------------------


/*
    Shows / Hides Class and Level selection depending on drop down selection of Threat
    Resets selectedIndex of Class / Level back to random when changed
 */
function showHidden(select) {
    let option = select.options[select.selectedIndex].value;
    if (option === "Yes") {
        document.getElementById("isThreat").hidden = false;
        isThreat = true;
    } else {
        document.getElementById("isThreat").hidden = true;
        isThreat = false;
        document.getElementById("classes").selectedIndex = 0;
        document.getElementById("level").selectedIndex = 0;
    }
}

/*
    New method to load JSON information since using fetch was giving us such a hard time
 */
function loadJSON(file, callback) {

    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, false); // Replace 'appDataServices' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


/*
    It works but its not pretty. Calls all the different generation functions
 */
function generateMultiNPC() {

    let content = document.getElementById("npc_content");
    let num = document.getElementById("num").value;

    if (!document.body.contains(document.getElementById("hr"))) {
        let line = document.createElement("hr");
        line.id ="hr";
        line.style.width = "75%";
        line.style.border = "2px solid black";
        content.prepend(line);
    }

    if (document.body.contains(document.getElementById("npc_table"))) {
        let table = document.getElementById("npc_table");
        table.remove();
    }

    let table = document.createElement("table");
    table.id = "npc_table";

    let count = 0;
    let outerLoop = num / 3;

    for (let i = 0; i < outerLoop; i++) {
        let row = document.createElement("tr");
        row.id = count.toString();

        for (let i = 0; i < 3 && i < num; i++) {
            let cell = document.createElement("td");
            cell.id = i.toString();

            let content_box = document.createElement("div");
            content_box.id = "content_box" + count.toString();
            content_box.align = "center";
            content_box.style.width = "550px";
            content_box.style.border = "thick solid black";
            content_box.style.backgroundColor = "#c55372";
            cell.append(content_box);

            genName();
            genBasics();
            genOccupation();
            genCharacteristics();

            printNPC(content_box);


            row.append(cell);
            count++;
        }

        table.append(row);
    }

    content.append(table);
}

/*
    Randomly generates a first and last name using first-names.json and last-names.json
 */

function genName() {
    loadJSON('./Data/first-names.json',function(response) {
        let first_names = JSON.parse(response);
        let randNum = Math.floor(Math.random() * first_names.length);
        npc.name = first_names[randNum] + " ";
    })

    loadJSON('./Data/last-names.json',function(response) {
        let last_names = JSON.parse(response);
        let randNum = Math.floor(Math.random() * last_names.length);
        npc.name += last_names[randNum];
    })
}

/*
    Generates the NPC basics using the drop down information. Allows for fully randomized NPCs or
    customized NPC based on user selection
 */
function genBasics() {
    for (let i = 0; i < dropDownListAll.length; i++) {
        let select = document.getElementById(dropDownListAll[i]);

        let option = select.options[select.selectedIndex].value;

        switch(dropDownListAll[i]) {
            case "alignments":
                if (option === "Random") {
                    npc.align = genRandomBase('alignments');
                } else {
                    npc.align = option;
                }
                break;
            case "races":
                if (option === "Random") {
                    npc.race = genRandomBase('races');
                } else {
                    npc.race = option;
                }
                break;
            case "gender":
                if (option === "Random") {
                    npc.gender = genRandomBase('gender');
                } else {
                    npc.gender = option;
                }
                break;
            case "threat":
                if (option === "Random") {
                    npc.threat = genRandomBase('threat');
                } else {
                    npc.threat = option;
                }
                break;
            case "classes":
                if (option === "Random") {
                    npc.class = genRandomBase('classes');
                } else {
                    npc.class = option;
                }
            case "level":
                if (option === "Random") {
                    npc.level = genRandomBase('level');
                } else {
                    npc.level = option;
                }
                break;
        }
    }
}

/*
    If dropdowns are set to random this function gets a random value and chooses
    one of the options for you. Different function since these values are fairly static
    and don't have a lot of data to pull from
 */
function genRandomBase(selectName) {
    let select = document.getElementById(selectName);
    let randNum = Math.floor(Math.random() * (select.options.length - 1)) + 1;
    let result = select.options[randNum].value

    return select.options[randNum].value;
}

/*
    Read from occupation.JSON and randomly select an occupation category and randomly select
    the occupation itself. Adds pertinent information to NPC JSON object
 */
function genOccupation() {
    loadJSON('./Data/occupation.json',function(response) {
        let occupations = JSON.parse(response);
        let randSuper = Math.floor(Math.random() * occupations.length);
        let randSub = Math.floor(Math.random() * occupations[randSuper].sub.length);
        npc.occupation.super_name = occupations[randSuper].super;
        npc.occupation.sub_name = occupations[randSuper].sub[randSub].name
        npc.occupation.value = occupations[randSuper].sub[randSub].value;
    })
}

/*
    Randomly generate the information not customizable from the drop down lists
 */
function genCharacteristics() {
    let detailList = ['appearance', 'talent', 'mannerism', 'interaction', 'ideal', 'bond', 'flaw'];

    for(const detail of detailList) {
        loadJSON('./Data/' + detail + '.json',function(response) {
            let data = JSON.parse(response);
            let randNum = Math.floor(Math.random() * data.length);

            switch (detail) {
                case 'appearance':
                    npc.appearance = data[randNum];
                    break;
                case 'talent':
                    npc.talent = data[randNum];
                    break;
                case 'mannerism':
                    npc.mannerism = data[randNum];
                    break;
                case 'interaction':
                    npc.interaction = data[randNum];
                    break;
                case 'ideal':
                    // Has special requirements for generation
                    genIdeal();
                    break;
                case 'bond':
                    npc.bond = data[randNum];
                    break;
                case 'flaw':
                    npc.flaw = data[randNum];
                    break;
            }
        })
    }
}

/*
    Through a complicated game of chance with arbitrary values I created. This generates an ideal based on NPCs
    current Alignment. Strictness decides how closely the ideal will be to the current alignment.
    More strict = high chance to match current alignment
 */
function genIdeal() {
    loadJSON('./Data/ideal.json',function(response) {
        let data = JSON.parse(response);
        while (true) {
            let alignStrictness = Math.floor(Math.random() * 100);      // How strict to follow alignment
            let alignChoice = Math.floor(Math.random() * 100);          // Determines if choices meets strictness requirements
            let alignGoodChaos = Math.floor(Math.random() * 2);         // Chooses between (Good vs Evil) or (Lawful vs Chaotic) side of alignment
            let idealSection = Math.floor(Math.random() * data.length); // Which "section" (good, evil, lawful etc)
            // Which ideal from selected section
            let encompass = Math.floor(Math.random() * data[idealSection].encompass_ideal.length)

            // Checks if choice has to be strict or not
            if (alignChoice >= alignStrictness) {
                // Checks choice against both words of current alignment (Loop is to catch singular Neutral)
                for (let i = 0; i < npc.align.split(' ').length; i++) {
                    if (npc.align.split(' ')[i].toLowerCase() === data[idealSection].ideal) {
                        npc.ideal = data[idealSection].encompass_ideal[encompass];
                        return;
                    }
                }
            } else {
                // If not strict then random section and ideal is chosen
                npc.ideal = data[idealSection].encompass_ideal[encompass];
                return;
            }
        }
    })
}

/*
    Print the NPC to the screen
 */
function printNPC(content_box) {
    // Set basics output string
    let output = [
        "Alignment: " + npc.align +
        "<br/>Race: " + npc.race +
        "<br/>Gender: " + npc.gender +
        "<br/>Threat: " + npc.threat];

    if (npc.threat === "Yes") {
        output[0] +=
            "<br/>Class: " + npc.class +
            "<br/>Level: " + npc.level
    }

    // Set details output string
    let pronoun;

    // Uses gender to give proper pronoun in ad-lib
    if (npc.gender === 'Male') {
        pronoun = 'he';
    } else {
        pronoun = 'she';
    }

    output.push( npc.name + ' is a ' + lowercase(npc.gender) + ' ' + npc.race +
        ' who ' + npc.interaction + ' and ' + npc.mannerism + '. ' + uppercase(pronoun) + ' ' + npc.appearance +
        ' and works as a ' + npc.occupation.sub_name + '. ' + npc.name.split(' ')[0] + ' ' + npc.talent);

    // Set secrets output string
    output.push(
        "Ideal: "+ npc.ideal +
        "</br>Bond: " + uppercase(npc.bond) +
        "</br>Flaw: " + uppercase(npc.flaw));

    // Dynamically creates name content / formatting
    let p = document.createElement("p");
    p.id = "npc_name";
    p.style.fontSize = "36px";
    content_box.append(p);
    p.innerHTML = npc.name;

    // Dynamically creates elements and css for generated NPC content
    let contentInfo = ["basics", "details", "secrets"];
    for (let i = 0; i < 3; i++) {
        // If element doesn't exist is creates it
        let hr = document.createElement("hr");
        hr.style.border = "2px solid black";
        hr.style.marginBottom = "-18px";
        content_box.append(hr);

        let header = document.createElement("p");
        header.style.fontSize = "24px";
        header.style.textAlign = "left";
        header.padding = "2px";
        header.innerHTML = uppercase(contentInfo[i]);
        content_box.append(header);

        let hr2 = document.createElement("hr");
        hr2.style.border = "1px solid black";
        hr2.style.width = "20%";
        hr2.align = "left";
        hr2.style.marginTop = "-20px";
        content_box.append(hr2);

        let p = document.createElement("p");
        p.id = contentInfo[i];
        p.style.fontSize = "18px";
        p.style.textAlign = "left";
        content_box.append(p);
        // Adds to / overwrites elements
        p.innerHTML = output[i];
    }
}

/*
    Capitalizes first letter of a word to make it fit into ad-lib print outs
 */
function uppercase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

/*
    Lowercases first letter of a word to make it fit into ad-lib print outs
 */
function lowercase(input) {
    return input.charAt(0).toLowerCase() + input.slice(1);
}