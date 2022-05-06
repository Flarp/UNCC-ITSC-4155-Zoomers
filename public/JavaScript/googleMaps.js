/* 
    ITSC 4155 Group 3 - The Zoomers
    Frontend script for intitalizing the google map API, using in conjunction with professor office location.
    Date: April 13th, 2022
*/

function initMap() {

    let defaultCoords = {
        lat: 35.30632076318478,
        lng: -80.73338984015999
    };

    window.addEventListener("load", () => {
        let clickableDivs = Array.from(document.getElementsByClassName("nested"));
    
        clickableDivs.forEach(div => {
            div.addEventListener("click", locateBuilding);
        });
    
    }); 
    
    function locateBuilding() {
        //Grab the building of the professor clicked
        let profBuilding = (this.children[1].children[0].children[2].textContent);
        let coords = {};
        
        //Translate the building name to coordinate
        if (profBuilding.charAt(0) === "W") {  //Woodward
            coords = {
                lat: 35.307338111101764,
                lng: -80.73568660497662
            }
        } else if(profBuilding.charAt(0) === "B") { //BioInformatics
            coords = {
                lat: 35.31269852519046,
                lng: -80.74179074584086
            }
        } else {  //NC Research Campus
            coords = {
                lat: 35.49981791771678,
                lng: -80.62302782239209
            }
        }
    
        //console.log(coords);

        addMarker(coords);
    };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: defaultCoords,
    });

    function addMarker(coords) {
        const marker = new google.maps.Marker({
            position: coords,
            map: map,
        });
        map.setCenter(coords);
        map.setZoom(18);
    }

};

window.onload = initMap;

