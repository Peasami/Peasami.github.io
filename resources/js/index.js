// JavaScript

var championApiUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion.json";
var selectedChampion = "Aatrox";
var getStatsBtn = document.getElementById("getStatsBtn");
var statsA;
var statsD;


async function getapi(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

function displayStats(){
    let html = "";
    html += "<li>Attack Damage: " + statsA.attackdamage + "</li>";
    html += "<li>Attack Range: " + statsA.attackrange + "</li>";
    html += "<li>Attack Speed: " + statsA.attackspeed + "</li>";
    html += "<li>Armor: " + statsA.armor + "</li>";
    html += "<li>Health: " + statsA.hp + "</li>";
    html += "<li>Health Regen: " + statsA.hpregen + "</li>";
    html += "<li>Magic Resist: " + statsA.spellblock + "</li>";

    document.getElementById("statsA").innerHTML = html;
}



function getChampionNames(data){
    let champOptions = "";
    for (let champion in data.data){
        champOptions += "<option value='" + champion + "'>" + champion + "</option>";
    }
    document.getElementById("championSelectA").innerHTML = champOptions;
}

function setChampImg(imgUrl){
    document.getElementById("champImgA").src = imgUrl;
}

function getChampionStats(){
    let dataUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion/" + document.getElementById("championSelectA").value + ".json";
    console.log(dataUrl);
    getapi(dataUrl)
    .then(data => parseStatsJson(data))
    .then(() => displayStats())
    .catch(error => console.log(error));

    let imgUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/" + document.getElementById("championSelectA").value + ".png";
    setChampImg(imgUrl);
    console.log(imgUrl);
}

function parseStatsJson(champData){
    statsA = champData.data[document.getElementById("championSelectA").value].stats;
    statsD = champData.data[document.getElementById("championSelectD").value].stats;
}


getapi(championApiUrl)
.then(data => getChampionNames(data))
.catch(error => console.log(error));

