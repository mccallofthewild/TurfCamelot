function PlayerService(_savedPlayers, SessionService){
        var _myPlayers = _savedPlayers || {};
        var _playersDictionary = {};
        var _nflPlayers = {};
        var sessionService = SessionService
    this.loadJSON = (URI, callback)=>{
        var debugFlag;
        try{
            var localData = localStorage.getItem('_nflJSON');
            function parseData(){
                var localData = localStorage.getItem('_nflJSON');
                var tempPlayers = JSON.parse(localData);
                console.log(tempPlayers.splice(0, 20))
                for(var i = 0; i<tempPlayers.length; i++){
                    var cp = tempPlayers[i]
                    cp.id = window.btoa(window.btoa(`${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}`)).slice(0,50)
                    cp.onMyTeam = false;
                    _nflPlayers[cp.id] = cp;
                    dictionarify(cp)
                }
                callback(_nflPlayers)
                return;
            }
            if(localData){
                parseData();
            }else{
                var bcwProxy = "https://bcw-getter.herokuapp.com/?url=";
                var pullURL = bcwProxy + encodeURIComponent(URI);
                $.getJSON(pullURL, (data)=>{
                    var toBeStored = data.body.players
                    if(debugFlag){
                        console.log("Player Data Ready");
                        console.log("Writing Player Data to local  storage...");
                    }
                    localStorage.setItem("_nflJSON", JSON.stringify(toBeStored));
                    if(debugFlag){console.log("completed writing player data to local storage!");}
                    callback(toBeStored);
                    parseData()
                })
            }
        }
        catch(error){
            console.log(error);
        }
    }


    function Team(name) {
        this.name = name || "My Team";
        this.players = {};
    }
    function Player(name, position, jersey){
        this.name = name || "My Player";
        this.position = position;
        this.jersey = jersey;
        this.id = window.btoa(window.btoa(`${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}`)).slice(0,50)
    }
    
    function dictionarify(player){
        var propnames = Object.getOwnPropertyNames(player);
        for(var i = 0; i < propnames.length; i++){
            var currentpropname = propnames[i];
            var dictionaryProp = _playersDictionary[currentpropname];
            var playerCurrentProp = player[currentpropname];
            if(!!_playersDictionary[currentpropname]){
                if(!!dictionaryProp[playerCurrentProp]){
                        _playersDictionary[currentpropname][playerCurrentProp].push(player);
                }else{
                        dictionaryProp[playerCurrentProp] = [player]
                }
            }else{
                _playersDictionary[currentpropname] = {};
                _playersDictionary[currentpropname][playerCurrentProp] = [player];

            }
        }
    }
    this.createTeam = (name)=>{
        var team = new Team(name);
        return team;
    }
    this.createPlayer = (player)=>{
        player.onMyTeam = true;
        _myPlayers[player.elias_id] = [player];
        sessionService.updateData(_myPlayers)
        
    }
    this.destroyPlayer = (player)=>{
        delete _myPlayers[player.elias_id];
        console.log(_myPlayers[player.elias_id])
        sessionService.updateData(_myPlayers);
        console.log("removing player forevverrr")
    }
    this.getMyPlayers = ()=>{
        return _myPlayers
    }
    this.sortNflPlayers = (players)=>{
        for(var i in players){
            dictionarify(i)
        }
    }
    this.getNflPlayers=()=>{
        return _nflPlayers;
    }
    this.getPlayersDictionary = ()=>{
        return _playersDictionary
    }
    this.getPlayersByX = (x, query)=>{
        new ReferenceError("That Property Does Not Exist.")
        return _playersDictionary[x][query]
    }
    this.filterNfl = (query)=>{
        var tempObj = {};
        for(var a in _nflPlayers){
            (JSON.stringify(_playersDictionary['id'][a]).toLowerCase().includes(query.toLowerCase()))? tempObj[a] = _playersDictionary['id'][a] : null;
        }
        console.log(tempObj)
        return tempObj;

    }
}