// JavaScript

// Initial variables
var itemsData;
var championApiUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion.json";

// enums for attacker and defender roles
const ROLES = {
    attacker: 0,
    defender: 1
}

const ABILITIES = {
    Q: 0,
    W: 1,
    E: 2,
    R: 3
}


// store all relevant variables for attacker and defender in objects
const attacker = {
    nameElement: "championSelectA",
    statsElement: "statsA",
    imgElement: "champImgA",
    buttonElement: "getAStatsBtn",
    levelElement: "totalLevelA",
    role: ROLES.attacker,
    baseStats: {},
    currentStats: {},
    level: 1,
    abilityLevels: [0, 0, 0, 0],
    items: []
}

const defender = {
    nameElement: "championSelectD",
    statsElement: "statsD",
    imgElement: "champImgD",
    buttonElement: "getDStatsBtn",
    role: ROLES.defender,
    baseStats: {},
    currentStats: {},
    level: 1,
    abilityLevels: [0, 0, 0, 0],
    items: []
}

// sets ability level
// sets total level
async function setAbilityLevel(ability, num, role){
    role.abilityLevels[ability] = num;
    role.level = role.abilityLevels.reduce((a, b) => a + b, 0); // sums all elements in array
    console.log(role.level);
}

async function displayLevel(role){
    document.getElementById(role.levelElement).innerHTML = role.level;
}

// updates currentStats to match their level
async function setCurrentStats(role){
    role.currentStats.attackdamage = role.baseStats.attackdamage + (role.baseStats.attackdamageperlevel * (role.level - 1));
    role.currentStats.attackrange = role.baseStats.attackrange;
    role.currentStats.attackspeed = role.baseStats.attackspeed + (role.baseStats.attackspeedperlevel * (role.level - 1));
    role.currentStats.armor = role.baseStats.armor + (role.baseStats.armorperlevel * (role.level - 1));
    role.currentStats.hp = role.baseStats.hp + (role.baseStats.hpperlevel * (role.level - 1));
    role.currentStats.hpregen = role.baseStats.hpregen + (role.baseStats.hpregenperlevel * (role.level - 1));
    role.currentStats.spellblock = role.baseStats.spellblock + (role.baseStats.spellblockperlevel * (role.level - 1));
}

// sets baseStats of attacker or defender
function setStatsVariable(role, stats){
    role.baseStats.attackdamage = stats.attackdamage;
    role.baseStats.attackdamageperlevel = stats.attackdamageperlevel;
    role.baseStats.attackrange = stats.attackrange;
    role.baseStats.attackspeed = stats.attackspeed;
    role.baseStats.attackspeedperlevel = stats.attackspeedperlevel;
    role.baseStats.armor = stats.armor;
    role.baseStats.armorperlevel = stats.armorperlevel;
    role.baseStats.hp = stats.hp;
    role.baseStats.hpperlevel = stats.hpperlevel;
    role.baseStats.hpregen = stats.hpregen;
    role.baseStats.hpregenperlevel = stats.hpregenperlevel;
    role.baseStats.spellblock = stats.spellblock;
    role.baseStats.spellblockperlevel = stats.spellblockperlevel;
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

    // Get api from created url
    getapi(dataUrl)
    .then(data => parseStatsJson(data, role.nameElement))// Then send api to parseStatsJson, return stats JSON
    .then(statsJSON => { // Then set stats for attacker or defender
        setStatsVariable(role, statsJSON); 
        return statsJSON;
    })
    .then(statsJSON => displayStats(role.statsElement, statsJSON))// Then display stats of attacker
    .catch(error => console.log(error));

    // Set image of champion from created url
    setChampImg(role.imgElement, imgUrl);
}

// returns stats part of JSON of champion from given champData
// champData is the data of the champion from the api
// elementId is the id of element where the champion name is taken from
function parseStatsJson(champData, nameElementId){
    return champData.data[document.getElementById(nameElementId).value].stats;
}

function onCalculateButton(role){
    setCurrentStats(role)
    .then (() => console.log(role.currentStats))
}

var attackerAbilities = document.getElementsByClassName("abilitySelectA");
var defenderAbilities = document.getElementsByClassName("abilitySelectD");

// Initial function calls
fetch('resources/js/items.json')
.then(response => itemsData = response.json())
.catch(error => console.log(error));

getapi(championApiUrl) // Get api of initial url
.then(data => getChampionNames(data)) // Then get champion names from returned api and display them
.catch(error => console.log("cannot get champion names: ", error));


// Event listeners
document.getElementById(attacker.buttonElement).addEventListener("click", () => {
    onCalculateButton(attacker);
});
document.getElementById(defender.buttonElement).addEventListener("click", () => {
    onCalculateButton(defender);
});

document.getElementById("championSelectA").addEventListener("change", () => {
    getChampionStats(attacker);
});
document.getElementById("championSelectD").addEventListener("change", () => {
    getChampionStats(defender);
});

for (let i = 0; i < attackerAbilities.length; i++){
    attackerAbilities[i].addEventListener("change", () => {
        setAbilityLevel(i, parseInt(attackerAbilities[i].value), attacker)
        .then(() => displayLevel(attacker));
    });
}
for (let i = 0; i < defenderAbilities.length; i++){
    defenderAbilities[i].addEventListener("change", () => {
        setAbilityLevel(i, parseInt(defenderAbilities[i].value), defender)
        .then(() => displayLevel(defender));
    });
}