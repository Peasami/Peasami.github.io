// JavaScript

var championApiUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion.json";
var selectedChampion = "Aatrox";
var getStatsBtn = document.getElementById("getStatsBtn");

async function getapi(url, _callback){
    let response = await fetch(url);
    let data = await response.json();
    _callback(data);
}

function displayStats(champData){
    let stats = champData.data[document.getElementById("championSelect").value].stats;
    console.log(stats);
    let html = "";
    html += "<li>Attack Damage: " + stats.attackdamage + "</li>";
    html += "<li>Attack Range: " + stats.attackrange + "</li>";
    html += "<li>Attack Speed: " + stats.attackspeed + "</li>";
    html += "<li>Armor: " + stats.armor + "</li>";
    html += "<li>Health: " + stats.hp + "</li>";
    html += "<li>Health Regen: " + stats.hpregen + "</li>";
    html += "<li>Magic Resist: " + stats.spellblock + "</li>";

    document.getElementById("stats").innerHTML = html;

}

function getChampionNames(data){
    let champOptions = "";
    for (let champion in data.data){
        champOptions += "<option value='" + champion + "'>" + champion + "</option>";
    }
    document.getElementById("championSelect").innerHTML = champOptions;
}

function setChampImg(imgUrl){
    document.getElementById("champImg").src = imgUrl;
}

function getChampionStats(){
    let dataUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion/" + document.getElementById("championSelect").value + ".json";
    console.log(dataUrl);
    getapi(dataUrl, displayStats);

    let imgUrl = "http://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/" + document.getElementById("championSelect").value + ".png";
    setChampImg(imgUrl);
    console.log(imgUrl);
}

getapi(championApiUrl, getChampionNames);

