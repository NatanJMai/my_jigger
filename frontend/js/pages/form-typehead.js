/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Form Typehead
 */
import jQuery from 'jquery';
window.$ = jQuery

import Bloodhound from 'typeahead.js/dist/bloodhound';
import 'typeahead.js/dist/typeahead.jquery';

window.Bloodhound = Bloodhound; // make it global if needed

class Typeahead {
    constructor() {
        this.states = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
            "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
            "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
            "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
            "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
            "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
            "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
            "Wisconsin", "Wyoming"
        ];

        this.NBATeams = [
            {team: "Boston Celtics"}, {team: "Dallas Mavericks"}, {team: "Brooklyn Nets"},
            {team: "Houston Rockets"}, {team: "New York Knicks"}, {team: "Memphis Grizzlies"},
            {team: "Philadelphia 76ers"}, {team: "New Orleans Hornets"}, {team: "Toronto Raptors"},
            {team: "San Antonio Spurs"}, {team: "Chicago Bulls"}, {team: "Denver Nuggets"},
            {team: "Cleveland Cavaliers"}, {team: "Minnesota Timberwolves"}, {team: "Detroit Pistons"},
            {team: "Portland Trail Blazers"}, {team: "Indiana Pacers"}, {team: "Oklahoma City Thunder"},
            {team: "Milwaukee Bucks"}, {team: "Utah Jazz"}, {team: "Atlanta Hawks"},
            {team: "Golden State Warriors"}, {team: "Charlotte Bobcats"}, {team: "Los Angeles Clippers"},
            {team: "Miami Heat"}, {team: "Los Angeles Lakers"}, {team: "Orlando Magic"},
            {team: "Phoenix Suns"}, {team: "Washington Wizards"}, {team: "Sacramento Kings"}
        ];

        this.NHLTeams = [
            {team: "New Jersey Devils"}, {team: "New York Islanders"}, {team: "New York Rangers"},
            {team: "Philadelphia Flyers"}, {team: "Pittsburgh Penguins"}, {team: "Chicago Blackhawks"},
            {team: "Columbus Blue Jackets"}, {team: "Detroit Red Wings"}, {team: "Nashville Predators"},
            {team: "St. Louis Blues"}, {team: "Boston Bruins"}, {team: "Buffalo Sabres"},
            {team: "Montreal Canadiens"}, {team: "Ottawa Senators"}, {team: "Toronto Maple Leafs"},
            {team: "Calgary Flames"}, {team: "Colorado Avalanche"}, {team: "Edmonton Oilers"},
            {team: "Minnesota Wild"}, {team: "Vancouver Canucks"}, {team: "Carolina Hurricanes"},
            {team: "Florida Panthers"}, {team: "Tampa Bay Lightning"}, {team: "Washington Capitals"},
            {team: "Winnipeg Jets"}, {team: "Anaheim Ducks"}, {team: "Dallas Stars"},
            {team: "Los Angeles Kings"}, {team: "Phoenix Coyotes"}, {team: "San Jose Sharks"}
        ];
    }

    initBasicTypeahead() {
        $(".typeahead").typeahead(
            {
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: "states",
                source: (query, syncResults) => {
                    const regex = new RegExp(query, "i");
                    const matches = this.states.filter(state => regex.test(state));
                    syncResults(matches);
                }
            }
        );
    }

    initBloodhoundBasic() {
        const bloodhoundStates = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: this.states
        });

        $(".bloodhound-typeahead").typeahead(
            {
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: "states",
                source: bloodhoundStates
            }
        );
    }

    initBloodhoundPrefetch() {
        this.bloodhoundPrefetch = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: "/data/typeahead.json"
        });

        $(".prefetch-typeahead").typeahead(
            {
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: "states",
                source: this.bloodhoundPrefetch
            }
        );
    }

    initDefaultSuggestions() {
        $(".default-suggestions-typeahead").typeahead(
            {
                hint: true,
                highlight: true,
                minLength: 0
            },
            {
                name: "states",
                source: (query, syncResults) => {
                    if (query === "") {
                        syncResults(["Alaska", "New York", "Washington"]);
                    } else {
                        this.bloodhoundPrefetch.search(query, syncResults);
                    }
                }
            }
        );
    }

    initCustomTemplates() {
        const movieDataset = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: "/data/typeahead-data-2.json"
        });

        const customTemplateInput = document.querySelector(".custom-template-typeahead");

        if (customTemplateInput) {
            $(customTemplateInput).typeahead(
                {
                    highlight: true,
                    hint: true
                },
                {
                    name: "best-movies",
                    display: "value",
                    source: movieDataset,
                    templates: {
                        empty: `
                            <div class="empty-message px-3">
                                Unable to find any Best Picture winners that match the current query
                            </div>
                        `,
                        suggestion: data => `
                            <div>
                                <span class="fw-medium">${data.value}</span> – ${data.year}
                            </div>
                        `
                    }
                }
            );
        }
    }

    initMultiDatasets() {
        const teamSource = data => new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("team"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: data
        });

        const multiDatasetInput = document.querySelector(".multi-datasets-typeahead");

        if (multiDatasetInput) {
            $(multiDatasetInput).typeahead(
                {
                    hint: true,
                    highlight: true,
                    minLength: 0
                },
                {
                    name: "nba-teams",
                    source: teamSource(this.NBATeams),
                    display: "team",
                    templates: {
                        header: '<h5 class="league-name text-muted fw-semibold border-bottom py-2">NBA Teams</h5>'
                    }
                },
                {
                    name: "nhl-teams",
                    source: teamSource(this.NHLTeams),
                    display: "team",
                    templates: {
                        header: '<h5 class="league-name text-muted fw-semibold border-bottom py-2">NHL Teams</h5>'
                    }
                }
            );
        }
    }

    init() {
        this.initBasicTypeahead();
        this.initBloodhoundBasic();
        this.initBloodhoundPrefetch();
        this.initDefaultSuggestions();
        this.initCustomTemplates();
        this.initMultiDatasets();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Typeahead().init();
})