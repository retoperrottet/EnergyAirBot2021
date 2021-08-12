// ==UserScript==
// @name         Energy Air 2021 Game Bot
// @version      1.7
// @description  Win tickets for the Energy Air 2021 automatically
// @author       retoou
// @match        *game.energy.ch/*
// @run-at       document-end
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// ==/UserScript==

// HOW TO USE:
// Make sure to run your Browser in full screen, otherwise it might not work
//  - Download the Tampermonkey Addon for your browser: https://www.tampermonkey.net
// 	- Create a new userscript and delete the existing code. Copy the script and paste it into the empty userscript. Save it with Ctrl + S.
// 	- Open the following webpage https://game.energy.ch and that's it :)
//
//	If you have won, Energy will send you an SMS with the link for the tickets.
// -----------------------------------------------------------------------------
// PARAMETERS
// After every change you need to save the Script with Ctrl + S and refresh the page of the Game!

// Keep in Mind, everything lower than 2400ms tends to be suspicious
// The real timeout gets calculated times a random number between 0 and 1 + 300ms to keep it random so it doesn't get suspicious
// Adjust Timeout between questions here:
const intTimeOut = 2400; //milliseconds

// Decide here if you want to use the Bot for Energy Air tickets or for 50Chf TALLY WEIJL coupons
const strProfit = "Air"; // Replace the Text to "Tally" or "Air", make sure to leave the ""
// -----------------------------------------------------------------------------


// DONT CHANGE ANYTHING DOWN THERE IF YOU DONT KNOW WHAT YOU ARE DOING!
const questions = {
    "IN WIE VIELEN LÄNDERN IST DAS KLEIDERGESCHÄFT TALLY WEIJL VERTRETEN?": "In 39 Ländern",
    "WO KANNST DU, UNTER ANDEREM, ENERGY AIR TICKETS GEWINNEN?": "Am Sender bei Radio Energy",
    "IN WELCHER LOCATION FINDET DAS ENERGY AIR 2021 UNTER FREIEM HIMMEL STATT?": "Stadion Wankdorf",
    "WIE HEISST DIE INITIATIVE FÜR MEHR RESPEKT IM INTERNET, WELCHE SWISSCOM MIT ENERGY LANCIERT HAT UND AM ENERGY AIR IHREN GROSSEN HÖHEPUNKT FEIERT?": "Mute the hate",
    "WER WAR DER ALLERERSTE ACT IN DER GESCHICHTE DES ENERGY AIR?": "Bastian Baker",
    "WER WAR DER ÜBERRASCHUNGSACT AM ENERGY AIR 2018?": "Lo &amp; Leduc",
    "IN WELCHEM SCHWEIZER KANTON ERÖFFNETE TALLY WEIJL 1987 DEN ERSTEN STORE?": "Basel",
    "MIT WELCHER ZUSATZOPTION HAST DU DIE MÖGLICHKEIT, DIREKT VOR DER BÜHNE ZU STEHEN?": "XTRA Circle",
    "WIE LANGE DAUERTE DAS ENERGY AIR 2019?": "6 Stunden",
    "MUSIKGRÖSSEN AUS WIE VIELEN LÄNDERN WAREN AM ENERGY AIR 2019 DABEI?": "Aus 7 Ländern",
    "WANN IST DIE TICKETVERLOSUNG FÜRS ENERGY AIR 2021 GESTARTET?": "Am 2. August 2021",
    "WELCHE ZWEI ENERGY KULTFIGUREN MISCHTEN DAS ENERGY AIR 2017 RICHTIG AUF?": "Tinu &amp; Dänu",
    "WELCHE MUSIKERIN WURDE AM ENERGY AIR 2018 VON EINER 9-JÄHRIGE BESUCHERIN AUF DER BÜHNE GECOVERT?": "Namika",
    "NACH WELCHEM KRITERIUM WÄHLT DAS ENERGY TEAM DIE ACTS FÜR DAS ENERGY AIR AUS?": "Musiker*innen aus der aktuellen Energy Playlist",
    "WAS IST DAS PERFEKTE OPENAIR-OUTFIT?": 'Egal, hauptsache du kannst darin tanzen',
    "WAS FOLGT AM DIESJÄHRIGEN ENERGY AIR ALS KRÖNENDER ABSCHLUSS?": "Aftershowparty",
    "UNTER WELCHEM MOTTO FEIERN WIR AM 4. SEPTEMBER 2021 DAS ENERGY AIR?": "We are back.",
    "WAS PASSIERT, WENN ES AM ENERGY AIR REGNET?": "Der Event findet trotzdem statt",
    "VON WELCHER MARKE WAR DAS MOTORRAD, MIT DEM LOCO ESCRITO AM LETZTEN ENERGY AIR ÜBER DIE BÜHNE FUHR?": "Harley-Davidson",
    "MIT WELCHEM ESC-HIT ROCKTE LUCA HÄNNI AM LETZTEN ENERGY AIR DIE BÜHNE?": "She Got Me",
    "WIE HEISST DER OFFIZIELLE INSTAGRAM-ACCOUNT DES ENERGY AIR?": "@energyair_official",
    "IN WELCHEN FARBEN TRITT DAS ENERGY AIR LOGO JÄHRLICH FÜR DAS SOMMERFINALE AUF?": "Blau und Weiss",
    "WAS WAR DAS ERSTE, WAS KÜNSTLER KNACKEBOUL NACH SEINEM AUFTRITT 2014 BACKSTAGE GEMACHT HAT?": "Mit seinem Mami ein kühles Bier getrunken",
    "WELCHER KÜNSTLER MUSSTE AM LETZTEN ENERGY AIR BACKSTAGE EINEN PART AUS DEM DIALEKTRAPSONG VON SANDRO VORRAPPEN?": "Stress",
    "WELCHER ACT FEIERTE AM LETZTEN ENERGY AIR MIT EINEM NEUEN SONG EINE WELTPREMIERE?": "Aloe Blacc",
    "WIE KANNST DU DEINE GEWINNCHANCEN BEI TICKETVERLOSUNGEN FÜR ENERGY EVENTS VERDOPPELN?": "Mit einer Energy One Membership",
    "WIE ALT MUSS MAN SEIN, UM OHNE ERWACHSENE BEGLEITUNG AM ENERGY AIR TEILZUNEHMEN?": "14 Jahre",
    "WELCHE STADT GEHÖRT SEIT AUGUST AUCH ZUR ENERGY FAMILIE UND WIRD AM ENERGY AIR VERTRETEN SEIN?": "Luzern",
    "MIT WELCHEM AUFBLASBAREN TIER KONNTEN ZWEI AUSERWÄHLTE AM LETZTEN ENERGY AIR ÜBER DIE GANZE MEUTE CROWDSURFEN?": "Schwan",
    "WOMIT ERSCHIENEN DIE ENERGY MEIN MORGEN MODERATOREN MOSER UND SCHELKER AUF DER ENERGY AIR BÜHNE 2019?": "Mit Spielzeug-Pferden",
    "WELCHES SCHWEIZER DJ-DUO SORGTE AM ENERGY AIR 2019 ZU BEGINN FÜR REICHLICH STIMMUNG?": "Averdeck",
    "WIE HEISST DIE TRAM- UND BUSHALTESTELLE, WELCHE SICH DIREKT NEBEN DEM STADION WANKDORF BEFINDET?": "Wankdorf Center",
    "WELCHEN KLEIDUNGSSTIL VERFOLGT TALLY WEIJL GRUNDSÄTZLICH?": "Just in time (voll im Trend)",
    "WELCHER ACT WAR NOCH NIE AN EINEM ENERGY AIR DABEI?": "Cro",
    "WIE WIRD TALLY WEIJL AUSGESPROCHEN?": "Talli Weil",
    "IN WELCHER BELIEBTEN SERIE WAR TALLY WEIJL ZU SEHEN?": "Gossip Girl",
    "Du hast die erste Hürde geschafft.": "Jetzt Tickets für das Energy Air gewinnen!"
}

function titleIs(title, selector = 'h1') {
    return document.getElementsByTagName(selector)[1].textContent === title
}

function currentQuestion() {
    if ($('h3.question-text').html() != null) {
        return $('h3.question-text').html().toUpperCase()
    }
}

function nextQuestion() {
    window.clearTimeout(setTimeout);
    setTimeout(makeAction, Math.floor((Math.random() + 1) * (intTimeOut) + 600))
    $('button#next-question').trigger('click')
}

function answerQuestion() {
    window.clearTimeout(setTimeout);
    let curr = currentQuestion()
    console.log(curr, questions[curr])
    $('#answers .answer-wrapper').each((i, el) => {
        if ($(el).children('label').html() === questions[curr]) {
            $(el).children('input').trigger('click')
        }
    })
    setTimeout(nextQuestion, Math.floor((Math.random() + 1) * (intTimeOut) + 600))
}

function makeAction() {
    window.clearTimeout(setTimeout);
    if (document.getElementsByTagName('h1')[1] != null) {
        if (titleIs('Hinter welchem Logo verstecken sich die Tickets?') || titleIs("Hinter welchem Symbol versteckt sich der Gutschein?")) {
            console.log('STEP: Memory')
            var star = Math.floor(Math.random() * 12) + 2;
            document.getElementsByTagName('img')[star].click();
            setTimeout(makeAction, Math.floor((Math.random() + 1) * (intTimeOut) + 1000))
        } else if ($('h1:contains("verloren")')) {
            if ($('p:contains("Starte das Spiel neu.")').length) {
                setTimeout(makeAction, Math.floor((Math.random() + 1) * (intTimeOut) + 600))
                $('button:contains("Erneut versuchen")').trigger('click')
                $('button:contains("Neustarten")').trigger('click')
                console.clear()
            }
            else {
                setTimeout(makeAction, Math.floor((Math.random() + 1) * (intTimeOut) + 600))
                document.getElementById('lose').click()
                console.clear()
            }
        }
    }
    else if ($('button:contains("Jetzt Tickets für das Energy Air gewinnen!")').length) {
        if (strProfit == "Tally") {
            $('button:contains("Geschenkgutscheine von Tally Weijl im Wert von 50.- gewinnen.")').trigger('click')
        } else {
            $('button:contains("Jetzt Tickets für das Energy Air gewinnen!")').trigger('click')
        }
        setTimeout(makeAction, Math.floor((Math.random() + 1) * (intTimeOut) + 600))
    }
    else if ($('button:contains("Game starten")').length) {
        $('button:contains("Game starten")').trigger('click')
        setTimeout(makeAction, Math.floor((Math.random() + 1) * (intTimeOut) + 600))
    }
    else {
        try {
            answerQuestion()
        } catch(e){
            console.log(e);
            location.reload();
            console.log("Refreshed Page");
        }
    }
}

(function () {
    'use strict';

    console.log('starting...')
    makeAction()
})();
