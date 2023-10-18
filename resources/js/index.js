// JavaScript

var championApiUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion.json";
var selectedChampion = "Aatrox";
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



function getChampionNames(data){
    let champOptions = "";
    for (let champion in data.data){
        champOptions += "<option value='" + champion + "'>" + champion + "</option>";
    }
    document.getElementById("championSelectA").innerHTML = champOptions;
    document.getElementById("championSelectD").innerHTML = champOptions;
}

function setChampImg(imgUrl, elementId){
    document.getElementById(elementId).src = imgUrl;
}

function getChampionStatsA(){
    let dataUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion/" + document.getElementById("championSelectA").value + ".json";
    getapi(dataUrl)
    .then(data => parseStatsJson(data))
    .then(() => displayStats("statsA", statsA))
    .catch(error => console.log(error));

    let imgUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/" + document.getElementById("championSelectA").value + ".png";
    setChampImg(imgUrl, "champImgA");
    console.log(imgUrl);
}

function getChampionStatsD(){
    let dataUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion/" + document.getElementById("championSelectD").value + ".json";
    getapi(dataUrl)
    .then(data => parseStatsJson(data))
    .then(() => displayStats("statsD", statsD))
    .catch(error => console.log(error));

    let imgUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/" + document.getElementById("championSelectD").value + ".png";
    setChampImg(imgUrl, "champImgD");
    console.log(imgUrl);
}

function parseStatsJson(champData){
    statsA = champData.data[document.getElementById("championSelectA").value].stats;
    statsD = champData.data[document.getElementById("championSelectD").value].stats;
}


getapi(championApiUrl)
.then(data => getChampionNames(data))
.catch(error => console.log("cannot get champion names: ", error));

//console.log("myBtn: ", document.getElementById("myBtn"));
document.getElementById("getAStatsBtn").addEventListener("click", getChampionStatsA);
document.getElementById("getDStatsBtn").addEventListener("click", getChampionStatsD);

