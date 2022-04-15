/*
    ITSC 4155 - Group 3: "The Zoomers"
    Controller component for all functionalities relating to the search portion of the website.
    Date: March 23rd, 2022

*/

//Get /search search research page
exports.getSearch = (req, res) => {
    res.render("search");
}


exports.getData = async (req, res, next) => {
        var searchField = $('#search').val();
        var x = new x(searchField, "i");
        getJSON('test.json', function(data){
            //var output = '<ul class = "search_results">';
            each(data, function(key, val){
                if((val.professor.search(x) != -1) || (val.department.search(x) != -1)){
                    output += '<li>';
                    output += '<h2>' + val.professor + '</h2>';
                    output += '<p>' + val.department + '</p>';
                    output += '</li>'
                }
            });
            output += '</ul>';
            update.hbs(output);
            console.log("working");
        });
    };





/*.(document).ready(function () {
    ajaxSetup({ cache: false });
    ('#search').keyup(function () {
        ('#result').html('');
        ('#state').val('');
        var searchField = ('#search').val();
        var expression = new RegExp(searchField, "i");
        getJSON('test.json', function (data) {
            each(data, function (key, value) {
                if (value.professor.search(expression) != -1 || value.department.search(expression) != -1) {
                    ('#result').append('<li class="list-group-item link-class">' + value.homePage + 
                    value.professor + ' | <span class="text-muted">' + value.department + '</span></li>');
                }
            });
        });
    });

    ('#result').on('click', 'li', function () {
        var click_text = (this).text().split('|');
        ('#search').val(trim(click_text[0]));
        ("#result").hbs('');
    });
});*/

/*const search = document.getElementById('search');
const matchList = document.getElementById('match-list');

const searchStates = async seachText => {
    const res = await fetch('test.json');
    const states = await res.json();

    let matches = states.filter(state => {
        const regex = new RegExp(`^${seachText}`, 'gi');
        return state.name.match(regex) || state.abbr.match(regex);
    });

    if (seachText.length === 0){
        matches = [];
        matchList.innerHTML = '';
    }
    outputHtml(matches);

    console.log(working);
};

const outputHtml = matches => {
    if (matches.length > 0) {
        const html = matches
        .map(
            match => `
            <div class = "card card-body mb-1">
                <h4>${match.name} (${match.abbr}) <span 
                class = "text-primary">${
                match.captial
                }</span></h4>
                <small>Lat: ${match.lat} / Long: ${match.long}</small>
            </div>
        `
            )
            .join('');

        matchList.innerHTML = html;
        console.log(workingPt_2)
    }
};

search.addEventListener('input', () => searchStates(search.value));*/

