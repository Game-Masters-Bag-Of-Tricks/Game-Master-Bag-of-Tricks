

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

/*
    Without this the initial "Generate" option doesn't populate properly the first button press. This fixes that.
    I don't really know why it won't just generate the first time when the button is pushed
 */
genName();
genOccupation();
genCharacteristics();


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
    It works but its not pretty. Calls all the different generation functions
 */
function generateNPC() {

    let content = document.getElementById("npc_content");
    if (!document.body.contains(document.getElementById("hr"))) {
        let line = document.createElement("hr");
        line.id ="hr";
        line.style.width = "75%";
        line.style.border = "2px solid black";
        content.prepend(line);
    }
    if (!document.body.contains(document.getElementById("content_box"))) {
        let content_box = document.createElement("div");
        content_box.id = "content_box";
        content_box.align = "center";
        content_box.style.width = "550px";
        content_box.style.border = "thick solid black";
        content.append(content_box);
    }


    genName();
    genBasics();
    genOccupation();
    genCharacteristics();

    printNPC();
}

/*
    Randomly generates a first and last name using first-names.json and last-names.json
    Use of fetch requires website to be hosted through actual http in order to function.
    Upload to webpages.uncc or use Apache (or equivalent) for local hosting
 */
function genName() {
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
        })
}

/*
    Randomly generate the information not customizable from the drop down lists
 */
function genCharacteristics() {
    let detailList = ['appearance', 'talent', 'mannerism', 'interaction', 'ideal', 'bond', 'flaw'];

    for(const detail of detailList) {
        // Read data from selectedDetail JSON
        fetch ('./Data/' + detail + '.json')
            .then(data => data.json())
            .then(data => {
                // Get random number for detail selection
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
                        genIdeal().then(data => npc.ideal = data);
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
    // Returns value from ideal.json
    return fetch ('./Data/ideal.json')
        .then(data => data.json())
        .then(data => {
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
                            return data[idealSection].encompass_ideal[encompass];
                        }
                    }
                } else {
                    // If not strict then random section and ideal is chosen
                    return data[idealSection].encompass_ideal[encompass];
                }
            }
        })
}

/*
    Print the NPC to the screen
 */
function printNPC() {
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
    if(!document.body.contains(document.getElementById("npc_name"))) {
        let p = document.createElement("p");
        p.id = "npc_name";
        p.style.fontSize = "36px";
        document.getElementById("content_box").append(p);
    }
    document.getElementById("npc_name").innerHTML = npc.name;

    // Dynamically creates elements and css for generated NPC content
    let contentInfo = ["basics", "details", "secrets"];
    for (let i = 0; i < 3; i++) {
        // If element doesn't exist is creates it
        if(!document.body.contains(document.getElementById(contentInfo[i]))) {
            let hr = document.createElement("hr");
            hr.style.border = "2px solid black";
            hr.style.marginBottom = "-18px";
            document.getElementById("content_box").append(hr);

            let header = document.createElement("p");
            header.style.fontSize = "24px";
            header.style.textAlign = "left";
            header.padding = "2px";
            header.innerHTML = uppercase(contentInfo[i]);
            document.getElementById("content_box").append(header);

            let hr2 = document.createElement("hr");
            hr2.style.border = "1px solid black";
            hr2.style.width = "20%";
            hr2.align = "left";
            hr2.style.marginTop = "-20px";
            document.getElementById("content_box").append(hr2);

            let p = document.createElement("p");
            p.id = contentInfo[i];
            p.style.fontSize = "18px";
            p.style.textAlign = "left";
            document.getElementById("content_box").append(p);
        }
        // Adds to / overwrites elements
        document.getElementById(contentInfo[i]).innerHTML = output[i];
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