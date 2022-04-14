/* 
    ITSC 4155 Group 3 - The Zoomers
    Frontend script for intitalizing the google map API, using in conjunction with professor office location.
    Date: April 13th, 2022
*/

function initMap() {
    const woodwardHall = { lat: 35.307338111101764, lng: -80.73568660497662 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: woodwardHall,
    });

    const marker = new google.maps.Marker({
        position: woodwardHall,
        map: map,
    });

};

initMap();