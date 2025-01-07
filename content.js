function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function getLineups(tourney_info, index) {
    var playerNames = Array.from(document.querySelectorAll(".styles__scoringPlayerCell__lxWkf"));
    var lineup = []
    if (playerNames.length > 0) {
        for (let playerNamesIndex = 0; playerNamesIndex < playerNames.length; playerNamesIndex++) {
            temp = []
            var playerName = playerNames[playerNamesIndex].querySelector(".styles__playerName__uf8z0").textContent.trim();
            temp.push(playerName);
            var temp = temp.concat(tourney_info);
            lineup.push(temp);
        };
    }
    document.querySelector(".styles__closeButton__bl92s").click();
    return lineup
  }

async function getTourneyInfo() {
    var tourney_info = [];
    document.querySelector(".styles__infoIcon__Ac3ZD").click();
    await sleep(1000);

    var tourney_name = document.querySelector(".styles__title__ZrO6C").textContent.trim();
    tourney_info.push(tourney_name);
    
    var entry_value = document.querySelector(".styles__entryInfoValue__qx_JF").textContent.trim();
    tourney_info.push(entry_value);
    
    var raw_tourney_info = document.querySelectorAll(".styles__infoValue__F0R73")

    var sport = raw_tourney_info[0].textContent.trim();
    tourney_info.push(sport);
    var entrants = raw_tourney_info[1].textContent.trim().replace(',','');
    tourney_info.push(entrants);
    var fill = raw_tourney_info[2].textContent.trim();
    tourney_info.push(fill);
    var slate = raw_tourney_info[3].textContent.trim();
    tourney_info.push(slate);
    var max_entries = raw_tourney_info[5].textContent.trim();
    tourney_info.push(max_entries);
    var draft_size = raw_tourney_info[6].textContent.trim();
    tourney_info.push(draft_size);
    var draft_rounds = raw_tourney_info[7].textContent.trim();
    tourney_info.push(draft_rounds);
    var rake = raw_tourney_info[8].textContent.trim();
    tourney_info.push(rake);
    var start_time = raw_tourney_info[9].textContent.trim();
    tourney_info.push(start_time);

    document.querySelector(".styles__closeButton__ZYuEF").click();
    await sleep(1000);

    return tourney_info
}


async function exportToCSV(filename, csvData) {
    const csvBlob = new Blob([csvData], { type: "text/csv" });
    const csvURL = URL.createObjectURL(csvBlob);
  
    const a = document.createElement("a");
    a.href = csvURL;
    a.download = filename;
  
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
  
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(csvURL);
  } 

  var tourney_lineups = [['Name', 'Tournament', 'Entry', 'Sport',
  'Entrants', 'Fill%', 'slate', 'Max Entries', 'Draft Size', 'Rounds', 'Rake', 'start_time']];

  async function live_exp() {
    // var slateDivs = document.querySelectorAll(".styles__liveSlateHeaderCell__zdCK5");
    // var slate = "NBA Fri 6:30PM"
    // var targetDiv = null;

    // slateDivs.forEach(function(div) {
    //     var paragraphs = div.querySelectorAll("p");
    
    //     paragraphs.forEach(function(paragraph) {
    //         if (paragraph.textContent.includes(slate)) {
    //             targetDiv = div;
    //             return;
    //         }
    //     });
        
    //     if (targetDiv) {
    //         return;
    //     }
    // });

    // targetDiv.click();
    // await sleep(500);

    // if (targetDiv) {
    //     // Get all div elements in the document
    //     var allDivs = document.querySelectorAll("div");
    
    //     // Initialize an array to store divs with the specified class after targetDiv
    //     var tourneys = [];
    
    //     // Variable to track whether targetDiv is found
    //     var foundTargetDiv = false;
    
    //     // Iterate through all div elements
    //     allDivs.forEach(function(div) {
    //         // Check if the current div is the targetDiv
    //         if (div === targetDiv) {
    //             foundTargetDiv = true;
    //         } else if (foundTargetDiv) {
    //             // If targetDiv has been found, check if the current div has the specified class
    //             if (div.classList.contains("styles__draftPoolContent__OvOLG")) {
    //                 // If it has the class, add it to the result array
    //                 tourneys.push(div);
    //             }
    //         }
    //     });
    
    //     // Now divsWithClassAfterTargetDiv contains all divs with the specified class 
    //     // that appear after targetDiv in the HTML structure
    //     console.log(tourneys);
    // }
    var tourneys = Array.from(document.querySelectorAll(".styles__draftPoolContent__OvOLG"));
    // console.log(tourneys_old);

    if (tourneys.length > 0) {
        for (let tourneyIndex = 0; tourneyIndex < tourneys.length; tourneyIndex++) {
            // if (tourneyIndex > 0) {
            //     console.log("True");
            //     // await sleep(500);
            //     // await targetDiv.click();
            //     await sleep(500);
            // }
            // await sleep(1000);
            var tourneys = Array.from(document.querySelectorAll(".styles__draftPoolContent__OvOLG"));
            await sleep(1000);
            tourneys[tourneyIndex].click();
            await sleep(1000);
            var tourney_info = await getTourneyInfo();
            
            const divs = Array.from(document.querySelectorAll(".styles__draftPoolTeamCell__Qapze"));
            if (divs.length > 0) {
                for (let divsIndex = 0; divsIndex < divs.length; divsIndex++) {
                    await sleep(500);
                    divs[divsIndex].click();
                    await sleep(500);
                    tourney_lineups.push(...await getLineups(tourney_info, divsIndex+1));
                }
                tourney_lineups = await Promise.all(tourney_lineups);
            }
        document.querySelector(".styles__backIcon__dJPND").click();
        await sleep(1000);
        }
    console.log(tourney_lineups);
    await exportToCSV("tourney_lineups", tourney_lineups.join("\n"));
    }    
    
}

live_exp();
