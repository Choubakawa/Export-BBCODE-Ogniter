// ==UserScript==
// @name         Export BBCODE Ogniter
// @namespace    https://openuserjs.org/scripts/Choubakawa/Export_BBCODE_Ogniter
// @version      1
// @description  Generate an export in BBOCDE from the table of progression for forum.
// @author       Choubakawa (Ogame.fr uni Fornax)
// @include      http://*.ogniter.org/*/*/statistics/*
// @supportURL   https://github.com/Choubakawa/Export-BBCODE-Ogniter
// @updateURL    https://openuserjs.org/meta/Choubakawa/Export_BBCODE_Ogniter.meta.js
// @downloadURL  https://openuserjs.org/install/Choubakawa/Export_BBCODE_Ogniter.user.js
// ==/UserScript==

var table = document.getElementsByClassName('table');
var players = [];
var dateStart;
var dateEnd;
var type;
var exportBBCODE = "";
var language = {
    generatedFrom: "",
    withScript: "",
    createdBy: "",
    progression: "",
    position: "",
    inType: "",
    point: "",
    from: "",
    to: "",
    highscore: "",
    orderBy: "",
    type: [ " "," "," "," " ],
    labelButtonCopy: "",
    copy: "",
    doCopy: ""
};


switchLanguage();
initPlayers();
sortByDiffPointDESC(players);
exportBBCODE = generateBBcode(players);
initForm();
$( "#labelDiffPointDESC" ).addClass('btn-success');

//==========================
// LISTENERS ON BUTTON
//==========================
$( "#optionPointASC" ).click(function() {
   $( ".persoArrow").removeClass('btn-success');
   $( "#labelPointASC" ).addClass('btn-success');
   sortByPointASC(players);
   updateBBcode();
});

$( "#optionPointDESC" ).click(function() {
   $( ".persoArrow").removeClass('btn-success');
   $( "#labelPointDESC" ).addClass('btn-success');
   sortByPointDESC(players);
   updateBBcode();
});

$( "#optionPositionASC" ).click(function() {
   $( ".persoArrow").removeClass('btn-success');
   $( "#labelPositionASC" ).addClass('btn-success');
   sortByPositionASC(players);
   updateBBcode();
});

$( "#optionPositionDESC" ).click(function() {
   $( ".persoArrow").removeClass('btn-success');
   $( "#labelPositionDESC" ).addClass('btn-success');
   sortByPositionDESC(players);
   updateBBcode();
});

$( "#optionDiffPointASC" ).click(function() {
   $( ".persoArrow").removeClass('btn-success');
   $( "#labelDiffPointASC" ).addClass('btn-success');
   sortByDiffPointASC(players);
   updateBBcode();
});

$( "#optionDiffPointDESC" ).click(function() {
   $( ".persoArrow").removeClass('btn-success');
   $( "#labelDiffPointDESC" ).addClass('btn-success');
   sortByDiffPointDESC(players);
   updateBBcode();
});

$( "#optionDiffPositionASC" ).click(function() {
   $( ".persoArrow").removeClass('btn-success');
   $( "#labelDiffPositionASC" ).addClass('btn-success');
   sortByDiffPositionASC(players);
   updateBBcode();
});

$( "#optionDiffPositionDESC" ).click(function() {
   $( ".persoArrow").removeClass('btn-success');
   $( "#labelDiffPositionDESC" ).addClass('btn-success');
   sortByDiffPositionDESC(players);
   updateBBcode();
});

$( "#buttonCopy" ).click(function() {
    copyToClipboard();
    $( "<span id='tempSpan'>"+language.copy+"</span>" ).insertAfter( $( "#buttonCopy" ) );
    setTimeout(function(){
        $( "#tempSpan" ).remove();
    }, 3000);
});


/*
* GENERATE FORM
*/
function initForm() {

    let style = $('<style>.radioItem { display: none !important; }</style>');
    $('html > head').append(style);

    let arrowUp = "<i class='icon-arrow-up'></i>";
    let arrowDown = "<i class='icon-arrow-down'></i>";

    let div = $('<div/>').attr({
        class: "btn-group", datatoggle: "buttons"
    });

    let labelPointASC = $('<label />').attr({
        id: "labelPointASC", class: "btn btn-primary persoArrow", for: "optionPointASC"
    }).append( arrowUp );
    let optionPointASC = $('<input />').attr({
        type: "radio", id: "optionPointASC", name: "sortedType", class: "radioItem"
    });
    labelPointASC.append( optionPointASC );
    let labelPointDESC = $('<label />').attr({
        id: "labelPointDESC", class: "btn btn-primary persoArrow", for: "optionPointDESC"
    }).append( arrowDown );
    let optionPointDESC = $('<input />').attr({
        type: "radio", id: "optionPointDESC", name: "sortedType", class: "radioItem"
    });
    labelPointDESC.append( optionPointDESC );
    let labelPositionASC = $('<label />').attr({
        id: "labelPositionASC", class: "btn btn-primary persoArrow", for: "optionPositionASC"
    }).append( arrowUp );
    let optionPositionASC = $('<input />').attr({
        type: "radio", id: "optionPositionASC", name: "sortedType", class: "radioItem"
    });
    labelPositionASC.append( optionPositionASC );
    let labelPositionDESC = $('<label />').attr({
        id: "labelPositionDESC", class: "btn btn-primary persoArrow", for: "optionPositionDESC"
    }).append( arrowDown );
    let optionPositionDESC = $('<input />').attr({
        type: "radio", id: "optionPositionDESC", name: "sortedType", class: "radioItem"
    });
    labelPositionDESC.append( optionPositionDESC );
    let labelDiffPointASC = $('<label />').attr({
        id: "labelDiffPointASC", class: "btn btn-primary persoArrow", for: "optionDiffPointASC"
    }).append( arrowUp );
    let optionDiffPointASC = $('<input />').attr({
        type: "radio", id: "optionDiffPointASC", name: "sortedType", class: "radioItem"
    });
    labelDiffPointASC.append( optionDiffPointASC );
    let labelDiffPointDESC = $('<label />').attr({
        id: "labelDiffPointDESC", class: "btn btn-primary persoArrow", for: "optionDiffPointDESC"
    }).append( arrowDown );
    let optionDiffPointDESC = $('<input />').attr({
        type: "radio", id: "optionDiffPointDESC", name: "sortedType", class: "radioItem"
    });
    labelDiffPointDESC.append( optionDiffPointDESC );
    let labelDiffPositionASC = $('<label />').attr({
        id: "labelDiffPositionASC", class: "btn btn-primary persoArrow", for: "optionDiffPositionASC"
    }).append( arrowUp );
    let optionDiffPositionASC = $('<input />').attr({
        type: "radio", id: "optionDiffPositionASC", name: "sortedType", class: "radioItem"
    });
    labelDiffPositionASC.append( optionDiffPositionASC );
    let labelDiffPositionDESC = $('<label />').attr({
        id: "labelDiffPositionDESC", class: "btn btn-primary persoArrow", for: "optionDiffPositionDESC"
    }).append( arrowDown );
    let optionDiffPositionDESC = $('<input />').attr({
        type: "radio", id: "optionDiffPositionDESC", name: "sortedType", class: "radioItem"
    });
    labelDiffPositionDESC.append( optionDiffPositionDESC );
    let buttonCopy = $('<button />').attr({
        type: "button", id: "buttonCopy", class: "btn btn-primary"
    }).append( language.labelButtonCopy );
    $('[data-toggle="tooltip"]').tooltip();
    let textarea = $('<textarea />').attr({
        rows: 2, cols: 80, id: "previewBBCODE"
    }).css( "width", "auto" ).css( "margin-top", "5px" ).text( exportBBCODE );

    let tab = $('<table>').attr({ id: "tableSortBBCODE" });
    let row1 = $('<tr>');
    let col1OfRow1 = $('<td>').attr({ rowspan: 2 }).text( language.point );
    let col2OfRow1 = $('<td>').append( labelPointASC );
    let col3OfRow1 = $('<td>').attr({ rowspan: 2 }).text( language.position );
    let col4OfRow1 = $('<td>').append( labelPositionASC );
    let col5OfRow1 = $('<td>').attr({ rowspan: 2 }).text( language.progression + " " + language.inType + " " + language.point );
    let col6OfRow1 = $('<td>').append( labelDiffPointASC );
    let col7OfRow1 = $('<td>').attr({ rowspan: 2 }).text( language.progression + " " + language.inType + " " + language.position  );
    let col8OfRow1 = $('<td>').append( labelDiffPositionASC );
    let col9OfRow1 = $('<td>').attr({ rowspan: 2 }).append( buttonCopy );
    row1.append(col1OfRow1).append(col2OfRow1).append(col3OfRow1).append(col4OfRow1).append(col4OfRow1)
        .append(col5OfRow1).append(col6OfRow1).append(col7OfRow1).append(col8OfRow1).append(col9OfRow1);
    let row2 = $('<tr>');
    let col2OfRow2 = $('<td>').append( labelPointDESC );
    let col4OfRow2 = $('<td>').append( labelPositionDESC );
    let col6OfRow2 = $('<td>').append( labelDiffPointDESC );
    let col8OfRow2 = $('<td>').append( labelDiffPositionDESC );
    row2.append(col2OfRow2).append(col4OfRow2).append(col6OfRow2).append(col8OfRow2);
    tab.append(row1).append(row2);

    $( ".btn-toolbar" ).last().addClass( "last-btn" );
    tab.appendTo( $( ".last-btn" ) );
    textarea.insertAfter( $( "#tableSortBBCODE" ) );

}

/*
* INIT PLAYERS
*/
function initPlayers() {
    for( var i = 0; i < table.length; i++ ) {
        let tab = table[i],
            rows = table[i].getElementsByTagName('tr'),
            m,
            bigcells,
            cells;
        for ( m = 0; m < rows.length; m++ ) {
            let player = {
                pseudo: "",
                pointBefore: 0,
                pointAfter: 0,
                diffPoint: "",
                positionBefore: 0,
                positionAfter: 0,
                diffPosition: "",
                pourcentage: 0
            };
            bigcells = rows[m].getElementsByTagName('th');
            if (!bigcells.length) {
                continue;
            }
            cells = rows[m].getElementsByTagName('td');
            if (!cells.length) {
                continue;
            }
            let pseudo = bigcells[0].getElementsByTagName('a');
            player.pseudo = pseudo[0].innerHTML;
            let dateStartTemp = cells[0].innerHTML;
            let dateEndTemp = cells[1].innerHTML;
            dateStart = dateStartTemp.substr(dateStartTemp.indexOf("(")+1).split(")").join("");
            dateEnd = dateEndTemp.substr(dateEndTemp.indexOf("(")+1).split(")").join("");
            let testIteration = i.toString();
            switch( testIteration ) {
                    //first table = points
                case "0":
                    let pointBefore = cells[0].innerHTML;
                    let pointAfter = cells[1].innerHTML;
                    let diffPoint = cells[2].getElementsByTagName('span');
                    player.pointBefore = pointBefore.substr(0, pointBefore.lastIndexOf("&")).split(",").join(".");
                    player.pointAfter = pointAfter.substr(0, pointAfter.lastIndexOf("&")).split(",").join(".");
                    player.diffPoint = diffPoint[0].innerHTML.split(",").join(".");
                    let before = player.pointBefore.split(".").join("");
                    let after = player.pointAfter.split(".").join("");
                    let prc;
                    if( player.diffPoint.indexOf("+") != -1 ) {
                        prc = ( ( after - before ) / before ) * 100;
                        player.pourcentage = "+" + Math.ceil( prc * 1000 ) / 1000 + "%";
                        player.pourcentage = player.pourcentage.split(".").join(",");
                    } else {
                        prc = ( ( before - after ) / after ) * 100;
                        player.pourcentage = "-" + Math.ceil( prc * 1000 ) / 1000 + "%";
                        player.pourcentage = player.pourcentage.split(".").join(",");
                    }
                    players.push( player );
                    break;
                    //second table = position
                case "1":
                    let positionBefore = cells[0].innerHTML;
                    let positionAfter = cells[1].innerHTML;
                    let diffPosition = cells[2].getElementsByTagName('span');
                    player.positionBefore = positionBefore.substr(0, positionBefore.lastIndexOf("&")).split(",").join(".");
                    player.positionAfter = positionAfter.substr(0, positionAfter.lastIndexOf("&")).split(",").join(".");
                    player.diffPosition = diffPosition[0].innerHTML.split(",").join(".");
                    addPlayer( player );
                    break;
            }
        }
    }
}
/*
* ADD PALYER TO PLAYERS
*/
function addPlayer( player ) {

    players.forEach(function(e) {
        if( e.pseudo === player.pseudo ) {
            e.positionBefore = player.positionBefore;
            e.positionAfter = player.positionAfter;
            e.diffPosition = player.diffPosition;
        }
    });
}

/*
*   SORT PLAYERS BY DIFF POINT DESC
*/
function sortByDiffPointDESC(players) {

    type = 0;

    players.sort(function(a, b) {
        return parseInt( b.diffPoint.split(".").join("") ) - parseInt( a.diffPoint.split(".").join("") );
    });
}

/*
*   SORT PLAYERS BY DIFF POINT ASC
*/
function sortByDiffPointASC(players) {

    type = 0;

    players.sort(function(a, b) {
        return parseInt( parseInt( a.diffPoint.split(".").join("") - b.diffPoint.split(".").join("") ) );
    });
}

/*
*   SORT PLAYERS BY POINT DESC
*/
function sortByPointDESC(players) {

    type = 2;

    players.sort(function(a, b) {
        return parseInt( b.pointAfter.split(".").join("") ) - parseInt( a.pointAfter.split(".").join("") );
    });
}

/*
*   SORT PLAYERS BY POINT ASC
*/
function sortByPointASC(players) {

    type = 2;

    players.sort(function(a, b) {
        return parseInt( a.pointAfter.split(".").join("") ) - parseInt( b.pointAfter.split(".").join("") );
    });
}

/*
*   SORT PLAYERS BY POSITION DESC
*/
function sortByPositionDESC(players) {

    type = 3;

    players.sort(function(a, b) {
        return parseInt( b.positionAfter.split(".").join("") ) - parseInt( a.positionAfter.split(".").join("") );
    });
}

/*
*   SORT PLAYERS BY DIFF POSITION ASC
*/
function sortByPositionASC(players) {

    type = 3;

    players.sort(function(a, b) {
        return parseInt( a.positionAfter.split(".").join("").replace("%","") ) - parseInt( b.positionAfter.split(".").join("").replace("%","")  );
    });
}

/*
*   SORT PLAYERS BY DIFF POSITION DESC
*/
function sortByDiffPositionDESC(players) {

    type = 1;

    players.sort(function(a, b) {
        return parseInt( b.diffPosition.split(".").join("").replace("%","")  ) - parseInt( a.diffPosition.split(".").join("").replace("%","")  );
    });
}

/*
*   SORT PLAYERS BY POSITION ASC
*/
function sortByDiffPositionASC(players) {

    type = 1;

    players.sort(function(a, b) {
        return parseInt( a.diffPosition.split(".").join("") ) - parseInt( b.diffPosition.split(".").join("") );
    });
}

/*
* PUT EXPORT BBCODE IN CLIPBOARD
*/
function copyToClipboard() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(exportBBCODE).select();
    document.execCommand("copy");
    $temp.remove();
}

/*
* UPDATE EXPORT BBCODE
*/
function updateBBcode() {
   exportBBCODE = generateBBcode(players);
   $( "#previewBBCODE" ).val(exportBBCODE);
}


/*
* GENERATE BBCODE FROM PLAYERS
*/
function generateBBcode(players) {

    var nameHighscore = document.getElementsByClassName('btn btn-info')[0].innerText;

    let BBCODE = "[table]\n[tr][b]" + language.orderBy + " " + language.type[type] + " " + language.highscore  + " " + nameHighscore + " " + language.from + " " + dateStart + " " + language.to + " " + dateEnd + "[/b][/tr]\n";

    players.forEach( function(e, index) {
        let colorPosition = e.diffPosition.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
        let colorPoint = e.diffPoint.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
        console.log(colorPosition);
        console.log(colorPoint);
        index++;
        BBCODE += "[tr]\n" +
            "[td]" + index + "[/td]" +
            "[td][color=#17B4FF]" + e.pseudo + "[/color][/td]" +
            "[td]" + e.positionAfter + "[/td]" + 
            "[td]" + colorPosition + e.diffPosition + "[/color][/td]" +
            "[td]" + e.pointAfter + "[/td]" +
            "[td]" + colorPoint + e.diffPoint + "[/color][/td]" +
            "[td][size=10](" + e.pourcentage + ")[/size][/td]" +
            "[/tr]\n";
    });
    BBCODE += "[/table]\n" + generateBBcodeSignature();
    return BBCODE;
}

/*
* GENERATE BBCODE SIGNATURE
*/
function generateBBcodeSignature() {

    let ogniterURL = document.URL;
    let ogniterName = document.domain;
    let scriptURL = "https://dddadade.fr";
    let scriptName = "Export BBCODE Ogniter";
    let devProfilURL = "https://twitter.com/Choubakawa";
    let devName = "Choubakawa";

    let signature = "[size=10][table]\n" +
        "[tr][td][center]" + language.generatedFrom + " " + "[url=" + ogniterURL + "]" + ogniterName + "[/url][/center][/td][/tr]\n" +
        "[tr][td][center]" + language.withScript + " " + "[url=" + scriptURL + "]" + scriptName + "[/url]" + " " + language.createdBy + " " + "[url=" + devProfilURL + "]" + devName + "[/url][/center][/td][/tr]\n" +
        "[/table][/size]";



    return signature;
}

/*
* SWITCH LANGUAGE
*/
function switchLanguage() {

    let localization = document.domain.substr( 0, document.domain.indexOf(".") );
    switch(localization) {
        case "fr":
            language = {
                orderBy: "Trier par",
                generatedFrom: "Export généré depuis",
                withScript: "Avec le script",
                createdBy: "créé par",
                progression: "Progression",
                position: "Position",
                inType: "en",
                point: "Point",
                from: "à partir du",
                to: "au",
                highscore: "du classement",
                type: [ "progression en Point", "progression en Position", "Point", "Position" ],
                labelButtonCopy: "Copier BBCODE",
                copy: "Copié !",
                doCopy: "Copie moi !"
            };
            break;

        case "en":
            language = {
                orderBy: "Order by",
                generatedFrom: "Export generated from",
                withScript: "With the script",
                createdBy: "created by",
                progression: "Progression",
                position: "Position",
                inType: "in",
                point: "Point",
                from: "from",
                to: "to",
                highscore: "of the highscore",
                type: [ "progression in Point", "progression in Position", "Point", "Position" ],
                labelButtonCopy: "Copy BBCODE",
                copy: "Copied !",
                doCopy: "Copy me !"
            };
            break;

        default:
            language = {
                orderBy: "Order by",
                generatedFrom: "Export generated from",
                withScript: "With the script",
                createdBy: "created by",
                progression: "Progression",
                position: "Position",
                inType: "in",
                point: "Point",
                from: "from",
                to: "to",
                highscore: "of the highscore",
                type: [ "progression in Point", "progression in Position", "Point", "Position" ],
                labelButtonCopy: "Copy BBCODE",
                copy: "Copied !",
                doCopy: "Copy me !"
            };
    }
}