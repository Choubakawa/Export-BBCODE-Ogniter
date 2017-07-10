// ==UserScript==
// @name         Export BBCODE Ogniter
// @namespace    https://openuserjs.org/scripts/Choubakawa/Export_BBCODE_Ogniter
// @version      1.0.1
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
var alignCenter = "center";
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
    type: [" ", " ", " ", " "],
    labelButtonCopy: "",
    copy: "",
    doCopy: ""
};

/*
 * GENERATE FORM
 */
function initForm() {

    let style = $('<style>.radioItem { display: none !important; } #colEven {  padding-right:4px;}</style>');
    $('html > head').append(style);

    let group = $(`
        <div class="btn-toolbar">
            <table id="tableSortBBCODE">
                <tr>
                    <td>
                        <span>` + language.point + ":" + `</span>
                    </td>
                    <td id="colEven">
                        <div class="btn-group">
                            <label id="labelPointASC" class="btn btn-primary persoArrow" for="optionPointASC">
                                <i class="icon-arrow-up"></i>
                                <input type="radio" id="optionPointASC" name="sortedType" class="radioItem">
                            </label>
                            <label id="labelPointDESC" class="btn btn-primary persoArrow" for="optionPointDESC">
                                <i class="icon-arrow-down"></i>
                                <input type="radio" id="optionPointDESC" name="sortedType" class="radioItem">
                            </label>
                        </div>
                    </td>
                    <td>
                        <span>` + language.position + ":" + `</span>
                    </td>
                    <td id="colEven">
                        <div class="btn-group">
                            <label id="labelPositionASC" class="btn btn-primary persoArrow" for="optionPositionASC">
                                <i class="icon-arrow-up"></i>
                                <input type="radio" id="optionPositionASC" name="sortedType" class="radioItem">
                            </label>
                            <label id="labelPositionDESC" class="btn btn-primary persoArrow" for="optionPositionDESC">
                                <i class="icon-arrow-down"></i>
                                <input type="radio" id="optionPositionDESC" name="sortedType" class="radioItem">
                            </label>
                        </div>
                    </td>
                    <td>
                        <span>` + language.progression + " " + language.inType + " " + language.point + ":" + `</span>
                    </td>
                    <td id="colEven">
                        <div class="btn-group">
                            <label id="labelDiffPointASC" class="btn btn-primary persoArrow" for="optionDiffPointASC">
                                <i class="icon-arrow-up"></i>
                                <input type="radio" id="optionDiffPointASC" name="sortedType" class="radioItem">
                            </label>
                            <label id="labelDiffPointDESC" class="btn btn-primary persoArrow" for="optionDiffPointDESC">
                                <i class="icon-arrow-down"></i>
                                <input type="radio" id="optionDiffPointDESC" name="sortedType" class="radioItem">
                            </label>
                        </div>
                    </td>
                    <td>
                        <span>` + language.progression + " " + language.inType + " " + language.position + ":" + `</span>
                    </td>
                    <td id="colEven">
                        <div class="btn-group">
                            <label id="labelDiffPositionASC" class="btn btn-primary persoArrow" for="optionDiffPositionASC">
                                <i class="icon-arrow-up"></i>
                                <input type="radio" id="optionDiffPositionASC" name="sortedType" class="radioItem">
                            </label>
                            <label id="labelDiffPositionDESC" class="btn btn-primary persoArrow" for="optionDiffPositionDESC">
                                <i class="icon-arrow-down"></i>
                                <input type="radio" id="optionDiffPositionDESC" name="sortedType" class="radioItem">
                            </label>
                        </div>
                    </td>
                    <td id="buttonCopy">
                        <div id="group-label-btn" class="btn-group">
                            <button type="button" class="btn btn-primary">` + language.labelButtonCopy + `</button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" id="colEven">
                        <div class="btn-group">
                            <label id="labelCenterOption" class="btn btn-primary optionCenter" for="centerOption">
                                ` + "[center]" + `
                                <input type="radio" id="centerOption" name="center" class="radioItem" value="center">
                            </label>
                            <label id="labelAlignCenterOption" class="btn btn-primary optionCenter" for="alignCenterOption">
                                ` + "[align=center]" + `
                                <input type="radio" id="alignCenterOption" name="center" class="radioItem" value="align=center">
                            </label>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        `);

    let textarea = $('<textarea />').attr({
        rows: 2,
        cols: 80,
        id: "previewBBCODE"
    }).css("width", "auto").css("margin-top", "5px").text(exportBBCODE);

    group.insertAfter($(".btn-toolbar").last());
    textarea.insertAfter(group);
}

/*
 * INIT PLAYERS
 */
function initPlayers() {
    for (var i = 0; i < table.length; i++) {

        let tab = table[i],
            rows = table[i].getElementsByTagName('tr'),
            m,
            bigcells,
            cells;

        for (m = 0; m < rows.length; m++) {
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
            dateStart = dateStartTemp.substr(dateStartTemp.indexOf("(") + 1).split(")").join("");
            dateEnd = dateEndTemp.substr(dateEndTemp.indexOf("(") + 1).split(")").join("");
            let testIteration = i.toString();

            switch (testIteration) {
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
                    if (player.diffPoint.indexOf("+") != -1) {
                        prc = ((after - before) / before) * 100;
                        player.pourcentage = "+" + Math.ceil(prc * 1000) / 1000 + "%";
                        player.pourcentage = player.pourcentage.split(".").join(",");
                    } else {
                        prc = ((before - after) / after) * 100;
                        player.pourcentage = "-" + Math.ceil(prc * 1000) / 1000 + "%";
                        player.pourcentage = player.pourcentage.split(".").join(",");
                    }
                    players.push(player);
                    break;
                    //second table = position
                case "1":
                    let positionBefore = cells[0].innerHTML;
                    let positionAfter = cells[1].innerHTML;
                    let diffPosition = cells[2].getElementsByTagName('span');
                    player.positionBefore = positionBefore.substr(0, positionBefore.lastIndexOf("&")).split(",").join(".");
                    player.positionAfter = positionAfter.substr(0, positionAfter.lastIndexOf("&")).split(",").join(".");
                    player.diffPosition = diffPosition[0].innerHTML.split(",").join(".");
                    addPlayer(player);
                    break;
            }
        }
    }
}

/*
 * ADD PALYER TO PLAYERS
 */
function addPlayer(player) {

    players.forEach(function (e) {
        if (e.pseudo === player.pseudo) {
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

    players.sort(function (a, b) {
        return parseInt(b.diffPoint.split(".").join("")) - parseInt(a.diffPoint.split(".").join(""));
    });
}

/*
 *   SORT PLAYERS BY DIFF POINT ASC
 */
function sortByDiffPointASC(players) {

    type = 0;

    players.sort(function (a, b) {
        return parseInt(parseInt(a.diffPoint.split(".").join("") - b.diffPoint.split(".").join("")));
    });
}

/*
 *   SORT PLAYERS BY DIFF POSITION DESC
 */
function sortByDiffPositionDESC(players) {

    type = 1;

    players.sort(function (a, b) {
        return parseInt(b.diffPosition.split(".").join("").replace("%", "")) - parseInt(a.diffPosition.split(".").join("").replace("%", ""));
    });
}

/*
 *   SORT PLAYERS BY POSITION ASC
 */
function sortByDiffPositionASC(players) {

    type = 1;

    players.sort(function (a, b) {
        return parseInt(a.diffPosition.split(".").join("")) - parseInt(b.diffPosition.split(".").join(""));
    });
}

/*
 *   SORT PLAYERS BY POINT DESC
 */
function sortByPointDESC(players) {

    type = 2;

    players.sort(function (a, b) {
        return parseInt(b.pointAfter.split(".").join("")) - parseInt(a.pointAfter.split(".").join(""));
    });
}

/*
 *   SORT PLAYERS BY POINT ASC
 */
function sortByPointASC(players) {

    type = 2;

    players.sort(function (a, b) {
        return parseInt(a.pointAfter.split(".").join("")) - parseInt(b.pointAfter.split(".").join(""));
    });
}

/*
 *   SORT PLAYERS BY POSITION DESC
 */
function sortByPositionDESC(players) {

    type = 3;

    players.sort(function (a, b) {
        return parseInt(b.positionAfter.split(".").join("")) - parseInt(a.positionAfter.split(".").join(""));
    });
}

/*
 *   SORT PLAYERS BY DIFF POSITION ASC
 */
function sortByPositionASC(players) {

    type = 3;

    players.sort(function (a, b) {
        return parseInt(a.positionAfter.split(".").join("").replace("%", "")) - parseInt(b.positionAfter.split(".").join("").replace("%", ""));
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
    $("#previewBBCODE").val(exportBBCODE);
}

/*
 * GENERATE BBCODE FROM PLAYERS
 */
function generateBBcode(players) {

    var nameHighscore = document.getElementsByClassName('btn btn-info')[0].innerText;

    let BBCODE = "[table]\n[tr][b]" + language.orderBy + " " + language.type[type] + " " + language.highscore + " " + nameHighscore + " " + language.from + " " + dateStart + " " + language.to + " " + dateEnd + "[/b][/tr]\n";

    players.forEach(function (e, index) {
        let colorPosition = e.diffPosition.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
        let colorPoint = e.diffPoint.startsWith("+") ? "[color=#00cc00]" : "[color=#FF0000]";
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
    let scriptURL = "https://openuserjs.org/scripts/Choubakawa/Export_BBCODE_Ogniter";
    let scriptName = "Export BBCODE Ogniter";
    let devProfilURL = "https://twitter.com/Choubakawa";
    let devName = "Choubakawa";
    let endCenter = alignCenter.startsWith("c") ? alignCenter : "align";

    let signature = "[size=10][table]\n" +
        "[tr][td][" + alignCenter + "]" + language.generatedFrom + " " + "[url=" + ogniterURL + "]" + ogniterName + "[/url][/" + endCenter + "][/td][/tr]\n" +
        "[tr][td][" + alignCenter + "]" + language.withScript + " " + "[url=" + scriptURL + "]" + scriptName + "[/url]" + " " + language.createdBy + " " + "[url=" + devProfilURL + "]" + devName + "[/url][/" + endCenter + "][/td][/tr]\n" +
        "[/table][/size]";
    console.log(signature);

    return signature;
}

/*
 * SWITCH LANGUAGE
 */
function switchLanguage() {

    let localization = document.domain.substr(0, document.domain.indexOf("."));
    switch (localization) {
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
                type: ["progression en Point", "progression en Position", "Point", "Position"],
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
                type: ["progression in Point", "progression in Position", "Point", "Position"],
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
                type: ["progression in Point", "progression in Position", "Point", "Position"],
                labelButtonCopy: "Copy BBCODE",
                copy: "Copied !",
                doCopy: "Copy me !"
            };
    }
}

switchLanguage();
initPlayers();
sortByDiffPointDESC(players);
exportBBCODE = generateBBcode(players);
initForm();
$("#labelDiffPointDESC").addClass('btn-success');
$("#labelCenterOption").addClass('btn-success');

//==========================
// LISTENERS ON BUTTONS
//==========================
$("#optionPointASC").click(function () {
    $(".persoArrow").removeClass('btn-success');
    $("#labelPointASC").addClass('btn-success');
    sortByPointASC(players);
    updateBBcode();
});

$("#optionPointDESC").click(function () {
    $(".persoArrow").removeClass('btn-success');
    $("#labelPointDESC").addClass('btn-success');
    sortByPointDESC(players);
    updateBBcode();
});

$("#optionPositionASC").click(function () {
    $(".persoArrow").removeClass('btn-success');
    $("#labelPositionASC").addClass('btn-success');
    sortByPositionASC(players);
    updateBBcode();
});

$("#optionPositionDESC").click(function () {
    $(".persoArrow").removeClass('btn-success');
    $("#labelPositionDESC").addClass('btn-success');
    sortByPositionDESC(players);
    updateBBcode();
});

$("#optionDiffPointASC").click(function () {
    $(".persoArrow").removeClass('btn-success');
    $("#labelDiffPointASC").addClass('btn-success');
    sortByDiffPointASC(players);
    updateBBcode();
});

$("#optionDiffPointDESC").click(function () {
    $(".persoArrow").removeClass('btn-success');
    $("#labelDiffPointDESC").addClass('btn-success');
    sortByDiffPointDESC(players);
    updateBBcode();
});

$("#optionDiffPositionASC").click(function () {
    $(".persoArrow").removeClass('btn-success');
    $("#labelDiffPositionASC").addClass('btn-success');
    sortByDiffPositionASC(players);
    updateBBcode();
});

$("#optionDiffPositionDESC").click(function () {
    $(".persoArrow").removeClass('btn-success');
    $("#labelDiffPositionDESC").addClass('btn-success');
    sortByDiffPositionDESC(players);
    updateBBcode();
});

$("#centerOption").click(function () {
    $(".optionCenter").removeClass('btn-success');
    $("#labelCenterOption").addClass('btn-success');
    alignCenter = $("#centerOption").val();
    updateBBcode();
});

$("#alignCenterOption").click(function () {
    $(".optionCenter").removeClass('btn-success');
    $("#labelAlignCenterOption").addClass('btn-success');
    alignCenter = $("#alignCenterOption").val();
    updateBBcode();
});

$("#buttonCopy").click(function () {
    copyToClipboard();
    $("<td id='tempSpan'>" + language.copy + "</td>").insertAfter($("#buttonCopy"));
    setTimeout(function () {
        $("#tempSpan").remove();
    }, 3000);
});