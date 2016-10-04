$(document).ready(()=>{
       var playerService = new PlayerService();
    playerService.loadJSON("https://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json",(data)=>{})
    playerService.getMyPlayers()
    console.log(playerService.getNflPlayers())
    console.log(playerService.getPlayersDictionary().id['TWpVMk56SXhPVGsxTXpBeE5UazBORFEyTWpJd01EVTJPRGc0Tl'])


    var _teamDictionary = {
            'ARI': 'Arizona Cardinals',
            'ATL': 'Atlanta Falcons',
            'BAL': 'Baltimore Ravens',
            'BUF': 'Buffalo Bills',
            'CAR': 'Carolina Panthers',
            'CHI': 'Chicago Bears',
            'CIN': 'Cincinnati Bengals',
            'CLE': 'Cleveland Browns',
            'DAL': 'Dallas Cowboys',
            'DEN': 'Denver Broncos',
            'DET': 'Detroit Lions',
            'GB': 'Green Bay Packers',
            'HOU': 'Houston Texans',
            'IND': 'Indianapolis Colts',
            'JAC': 'Jacksonville Jaguars',
            'KC': 'Kansas City Chiefs',
            'LAR': 'Los Angelos Rams',
            'MIA': 'Miami Dolphins',
            'MIN': 'Minnesota Vikings',
            'NE': 'New England Patriots',
            'NO': 'New Orleans Saints',
            'NYG': 'New York Giants',
            'NYJ': 'New York Jets',
            'OAK': 'Oakland Raiders',
            'PHI': 'Philadelphia Eagles',
            'PIT': 'Pittsburgh Steelers',
            'SD': 'San Diego Chargers',
            'SEA': 'Seattle Seahawks',
            'SF': 'San Francisco 49ers',
            'TB': 'Tampa Bay Buccaneers',
            'TEN': 'Tennessee Titans',
            'WAS': 'Washington Redskins'
    }
    var _positionDictionary = {
        'DB':'Defensive Back',
        'DL': 'Defensive Line',
        'K': 'Kicker',
        'LB': 'Linebacker',
        'QB': 'Quarterback',
        'RB': 'Running Back',
        'TE':'Tight End',
        'WR': 'Wide Reciever'
    }
    function uncronym(thing){
       return  _positionDictionary[thing] || _teamDictionary[thing] || "Not found. Try Again! :)";
    }
    
    var template = (player)=>{
        if(player == undefined){return ""}
        return `
        <div class="player-info">
            <div class="panel player-panel">
                <div class="panel-heading">
                    <h3><small>${player.firstname}</small></br>${player.lastname}</h3>
                    <h3 class="text-right"><button class="btn btn-primary add-btn" playerid="${player.id}"><i class="fa ${(player.onMyTeam)? "fa-check" : "fa-plus"}"></i></button></h3>
                </div>
                <div class="panel-body">
                    <div class='thumbnail-image-container'>
                        <img src="${player.photo.replace("http", "https")}" alt="">
                    </div>
                    <table class="table">
                        <tr>
                            <td>Position:</td>
                            <td>${uncronym(player.position)}</td>
                        </tr>
                        <tr>
                            <td>Jersey No.:</td>
                            <td>#${player.jersey || "NN"}</td>
                        </tr>
                        <tr>
                            <td>Team:</td>
                            <td>${uncronym(player.pro_team)}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `}

    var displayPlayers = (players, page, amount, selector)=>{
        var HTMLstring = '';
        var currentPlayers = Object.getOwnPropertyNames(players).splice(page*amount)
        for(var i = 0; i<amount; i++){
             var athlete = players[currentPlayers[i]];
            if(!!athlete){
                HTMLstring += template(athlete[0]);
            }
        }
        $(selector).html(HTMLstring)
    }



 
    $('.search-form').on("submit", function great(a){
        a.preventDefault()
        var value = a.target[0].value
        console.log(value)
        displayPlayers(playerService.filterNfl(value), 0, 20, '.insert-nfl-area')
        initializeOnDisplay()
    })

    $('.nav-link-search').click((a)=>{
        $('.nav-link-search').addClass('active')
        $('.nav-link-roster').removeClass('active')
        $('.search-page').fadeToggle(()=>{$('.profile-page').fadeToggle()})
        console.log(playerService.getNflPlayers())
        displayPlayers(playerService.getNflPlayers(), 0, 20, '.insert-nfl-area');
    })


    function initializeOnDisplay(){
        $('.add-btn').click(function goodie(a){
            $(this).html('<i class="fa fa-check"></i>');
            console.log($(a.target).attr('playerid'));
            playerService.createPlayer(playerService.getPlayersDictionary().id[$(a.target).attr('playerid')][0]);
            console.log(playerService.getPlayersDictionary().id[$(a.target).attr('playerid')][0]) 
            console.log(playerService.getMyPlayers())
        });
    }
    
   
    
     $('.nav-link-roster').click((a)=>{
         $('.nav-link-roster').addClass('active')
         $('.nav-link-search').removeClass('active')
        // $('.profile-page').removeClass('hidden')
        // $('.search-page').addClass('hidden')
        $('.profile-page').fadeToggle(()=>{$('.search-page').fadeToggle()})
        insertMyPlayers()
        console.log(playerService.getMyPlayers())
        // $('.insert-players-area').html() == undefined ? $('.insert-players-area').html("You have no players yet! <br> Click 'Search NFL' to add players.") : null;
    })

    function insertMyPlayers(){
        var myPlayers = playerService.getMyPlayers();
        displayPlayers(myPlayers, 0, 10, '.insert-my-players-area')
    }
})
