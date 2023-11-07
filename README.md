# Description
Gets data of playable characters from the game "league of legends" from Riot's "datadragon" api. Can calculate damage per attack, hits to kill and time to kill, based on levels of attacker and defender.

Item selection is not implemented.

Websivun linkki: https://peasami.github.io/index.html

# Arviontikriteerit

## HTML
Basic structure is present\
Content differentiation is present.\
Use of forms, links, and media.\
Tables are effectively used. There is a table showing results of calculations.\
Semantic html used. Header, aside, main and footer are present.

## CSS
Basic CSS Styling\
Use of classes and IDs\
Use of layouts. The ".row" class is a flexbox.

## JavaScript Basics
Simple interactions(multiple buttons and Event listeners)\
Multiple event listeners and basic DOM.\
Use of arrays, objects, and functions. The "attacker" and "defender" variables are stored as objects.\
Advanced logic, looping through data, and dynamic DOM updates.

## Asynchronous operations
Implementation of Fetch. fetching data from https://ddragon.leagueoflegends.com/ domain\
Data from async call is displayed. Whenever a champion name is selected from dropdown menu, the "Champion stats" slot displays received data.\
Error handling is handled by displaying error codes in console.