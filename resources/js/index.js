// JavaScript

// Initial variables
var itemsData;
var championApiUrl = "https://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion.json";
var attackerAbilities = document.getElementsByClassName("abilitySelectA");
var defenderAbilities = document.getElementsByClassName("abilitySelectD");

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
    baseStats: {}, // base stats without levels, abilities, or items
    currentStats: {}, // stats with levels
    level: 0,
    abilityLevels: [0, 0, 0, 0],
    items: []
}

const defender = {
    nameElement: "championSelectD",
    statsElement: "statsD",
    imgElement: "champImgD",
    buttonElement: "getDStatsBtn",
    levelElement: "totalLevelD",
    role: ROLES.defender,
    baseStats: {},
    currentStats: {},
    level: 0,
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
    role.currentStats.attackdamage = role.baseStats.attackdamage + (role.baseStats.attackdamageperlevel) * role.level;
    role.currentStats.attackrange = role.baseStats.attackrange;
    // weird formula for attackspeed provided by leagueoflegeds fandom wiki
    role.currentStats.attackspeed = role.baseStats.attackspeed + (role.baseStats.attackspeedperlevel * role.level * (0.7025 + 0.0175 * (role.level))) * role.baseStats.attackspeed;
    console.log("attackspeed calculus: ", role.currentStats.attackspeed);
    role.currentStats.armor = role.baseStats.armor + (role.baseStats.armorperlevel) * role.level;
    role.currentStats.hp = role.baseStats.hp + (role.baseStats.hpperlevel) * role.level;
    role.currentStats.hpregen = role.baseStats.hpregen + (role.baseStats.hpregenperlevel) * role.level;
    role.currentStats.spellblock = role.baseStats.spellblock + (role.baseStats.spellblockperlevel) * role.level;
    console.log(role.currentStats);
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

// displays base stats of role
function displayStats(role){
    let html = "";
    html += "<li>Attack Damage: " + role.baseStats.attackdamage + "</li>";
    html += "<li>Attack Range: " + role.baseStats.attackrange + "</li>";
    html += "<li>Attack Speed: " + role.baseStats.attackspeed + "</li>";
    html += "<li>Armor: " + role.baseStats.armor + "</li>";
    html += "<li>Health: " + role.baseStats.hp + "</li>";
    html += "<li>Health Regen: " + role.baseStats.hpregen + "</li>";
    html += "<li>Magic Resist: " + role.baseStats.spellblock + "</li>";

    document.getElementById(role.statsElement).innerHTML = html;
}



function setItems(data){
    let itemOptions = "";
    console.log(data.items);
    data.items.forEach(item => {
        itemOptions += "<option value='" + item.name + "'>" + item.name + "</option>";
    });

    var itemSelectElements = document.getElementsByClassName("itemSelect");
    for (var i = 0; i < itemSelectElements.length; i++) {
        itemSelectElements[i].innerHTML = itemOptions;
    }
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
async function getChampionStats(role){
    let champName = document.getElementById(role.nameElement).value;
    let dataUrl = "https://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion/" + champName + ".json";
    let imgUrl = "https://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/" + champName + ".png";

    // Get api from created url
    getapi(dataUrl)
    .then(data => parseStatsJson(data, role.nameElement))// Then send api to parseStatsJson, return stats JSON
    .then(statsJSON => { // Then set stats for attacker or defender
        setStatsVariable(role, statsJSON); 
    })
    .then(() => displayStats(role))// Then display stats of attacker
    .then(() => setCurrentStats(role)) // Then set current stats of attacker
    .then(() => console.log(role.baseStats)) // Then log current stats of attacker
    .catch(error => console.log(error));

    // Set image of champion from created url
    setChampImg(role.imgElement, imgUrl);
}


function calculateDamage(){
    let damagePerAttack = attacker.currentStats.attackdamage / (1 + defender.currentStats.armor / 100);
    document.getElementById("dmgPerAutoValue").innerHTML = damagePerAttack;
    let hitsToKill = Math.ceil(defender.currentStats.hp / damagePerAttack);
    document.getElementById("htkValue").innerHTML = hitsToKill;
    let timeToKill = hitsToKill / (attacker.currentStats.attackspeed);
    console.log("Attacker atkspeed: ",attacker.currentStats.attackspeed);
    console.log("attacker attackspeed per level: ",attacker.baseStats.attackspeedperlevel);
    console.log("Attacker level: ",attacker.level);
    document.getElementById("ttkValue").innerHTML = timeToKill;
    console.log(attacker.currentStats.attackdamage);
    console.log(defender.currentStats.armor);
    console.log(damagePerAttack);
}


// returns stats part of JSON of champion from given champData
// champData is the data of the champion from the api
// elementId is the id of element where the champion name is taken from
function parseStatsJson(champData, nameElementId){
    return champData.data[document.getElementById(nameElementId).value].stats;
}

function onCalculateButton(role){
    setCurrentStats(role)
    .then (() => calculateDamage())
}



// Initial function calls
fetch('resources/js/items.json')
.then(response => response.json())
.then(data => setItems(data))
.catch(error => console.log(error));



getapi(championApiUrl) // Get api of initial url
.then(data => getChampionNames(data)) // Then get champion names from returned api and display them
.then(() => getChampionStats(attacker)) // Then get stats of attacker
.then(() => getChampionStats(defender)) // Then get stats of defender
.catch(error => console.log("cannot get champion names: ", error));


// Event listeners
document.getElementById(attacker.buttonElement).addEventListener("click", () => {
    calculateDamage();
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
        .then(() => setCurrentStats(attacker))
        .then(() => displayLevel(attacker));
    });
}
for (let i = 0; i < defenderAbilities.length; i++){
    defenderAbilities[i].addEventListener("change", () => {
        setAbilityLevel(i, parseInt(defenderAbilities[i].value), defender)
        .then(() => setCurrentStats(defender))
        .then(() => displayLevel(defender));
    });
}