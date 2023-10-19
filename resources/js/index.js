// JavaScript

// Initial variables
var championApiUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion.json";

// enums for attacker and defender roles
const ROLES = {
    attacker: 0,
    defender: 1
}

const attacker = {
    nameElement: "championSelectA",
    statsElement: "statsA",
    imgElement: "champImgA",
    buttonElement: "getAStatsBtn",
    role: ROLES.attacker
}

const defender = {
    nameElement: "championSelectD",
    statsElement: "statsD",
    imgElement: "champImgD",
    buttonElement: "getDStatsBtn",
    role: ROLES.defender
}

// Stats of attacker and defender are stored in these global variables
var statsA;
var statsD;

// sets stats of given role to given stats
function setStatsVariable(roleEnum, stats){
    switch(roleEnum){
        case ROLES.attacker:
            statsA = stats;
            break;
        case ROLES.defender:
            statsD = stats;
            break;
        default:
            console.log("invalid role");
    }
}


// Returns the api data from the url
async function getapi(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// Displays stats of given chosenStat object in element with given elementId
// chosenStat is either statsA or statsD
function displayStats(elementId, chosenStat){
    let html = "";
    html += "<li>Attack Damage: " + chosenStat.attackdamage + "</li>";
    html += "<li>Attack Range: " + chosenStat.attackrange + "</li>";
    html += "<li>Attack Speed: " + chosenStat.attackspeed + "</li>";
    html += "<li>Armor: " + chosenStat.armor + "</li>";
    html += "<li>Health: " + chosenStat.hp + "</li>";
    html += "<li>Health Regen: " + chosenStat.hpregen + "</li>";
    html += "<li>Magic Resist: " + chosenStat.spellblock + "</li>";

    document.getElementById(elementId).innerHTML = html;
}



// Gets champion names from api and displays them in the select elements
function getChampionNames(data){
    let champOptions = "";
    for (let champion in data.data){
        champOptions += "<option value='" + champion + "'>" + champion + "</option>";
    }
    document.getElementById("championSelectA").innerHTML = champOptions;
    document.getElementById("championSelectD").innerHTML = champOptions;
}

// Sets image from imgUrl to elementId element
function setChampImg(imgElementId, imgUrl){
    document.getElementById(imgElementId).src = imgUrl;
}

// Gets a single champion's stats and image from api and displays them
// champNameElementId is the id of the select element where the champion name is taken from
// statsElementId is the id of the element where the stats are displayed
// champImgElementId is the id of the img element where the champion image is displayed
function getChampionStats(role){
    let champName = document.getElementById(role.nameElement).value;
    let dataUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion/" + champName + ".json";
    let imgUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/" + champName + ".png";

    console.log(role.statsElement)
    // Get api from created url
    getapi(dataUrl)
    .then(data => parseStatsJson(data, role.statsElement))// Then send api to parseStatsJson
    .then(selectStats => setStatsVariable(role.role, selectStats))// Then set stats of attacker or defender
    .then(selectStats => displayStats(role.statsElement, selectStats))// Then display stats of attacker
    .catch(error => console.log(error));
    // Set image of champion from created url
    setChampImg(role.imgElement, imgUrl);
}

// returns stats of champion from given champData
// champData is the data of the champion from the api
// elementId is the id of element where the champion name is taken from
function parseStatsJson(champData, nameElementId){
    return champData.data[document.getElementById(nameElementId).value].stats;
}

// Initial function calls
getapi(championApiUrl) // Get api of initial url
.then(data => getChampionNames(data)) // Then get champion names from returned api and display them
.catch(error => console.log("cannot get champion names: ", error));

// Event listeners
document.getElementById(attacker.buttonElement).addEventListener("click", () => {
    getChampionStats(attacker);
});
document.getElementById(defender.buttonElement).addEventListener("click", () => {
    getChampionStats(defender);
});

