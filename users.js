function SessionsService(){
    var self = this;
    var currentUser = ""


     function sendError(errorMessage){
        console.log(errorMessage)
         return errorMessage;
         throw new Error(errorMessage)
     }

     var initializeDB = ()=>{
        try{
            var localData = localStorage.getItem('_turfCamelotDB');
            if(localData){
                return;
            }else{
                var toBeStored = {keyTable:{},userDataTable:{}}
                localStorage.setItem("_turfCamelotDB", JSON.stringify(toBeStored));
                callback(toBeStored);
            }
        }
        catch(error){
            console.log(error);
        }
     }

     self.signup = (username, password)=>{
         initializeDB()
         var localData = localStorage.getItem('_turfCamelotDB');
         var DB = JSON.parse(localData)
         var userExists = DB.keyTable[username]
         if(!userExists){
             var randomKey = `${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}`
             DB.keyTable[username] = sjcl.encrypt(password, randomKey);
             DB.userDataTable[randomKey] = {}
             DB.userDataTable[randomKey].players = {};
             localStorage.setItem("_turfCamelotDB", JSON.stringify(DB));

             var sessionInfo = {
            'key':randomKey
            }
            sessionStorage.setItem('_turfCamelotUserSession', JSON.stringify(sessionInfo))
             
             return DB.userDataTable[randomKey].players;
         }else{
            sendError("User already exists!")
            throw new Error("USER ALREADY EXISTS")

         }
     }


     self.login = (username, password)=>{
        initializeDB();
        var local = localStorage.getItem('_turfCamelotDB');
        if(!local){sendError("User does not exist!"); return;}
        var DB = JSON.parse(local);
        var encryptedKey = DB.keyTable[username];
        var decryptedKey = sjcl.decrypt(password, encryptedKey);
        var userData = DB.userDataTable[decryptedKey].players;
        var sessionInfo = {
            'key':decryptedKey
        }

        sessionStorage.setItem('_turfCamelotUserSession', JSON.stringify(sessionInfo))
        return userData;
     }

     self.logout = ()=>{
         sessionStorage.removeItem('_turfCamelotUserSession');
     }

     function storeKey(keyString){
         var key = keyString;
     }
     
     function updateData(data){
        var localData = localStorage.getItem('_turfCamelotDB');
        var DB = JSON.parse(localData);
        console.log(DB)

        var sessionData = sessionStorage.getItem('_turfCamelotUserSession');
        var userSessionKey = JSON.parse(sessionData).key;

        DB.userDataTable[userSessionKey].players = data;
        localStorage.setItem('_turfCamelotDB', JSON.stringify(DB))

     }
     
     self.updateData = (data)=>{
        updateData(data);
     }
}
















SessionsController()
function SessionsController(){
    var sessionService = new SessionsService();
    var sessionString = sessionStorage.getItem('_turfCamelotUserSession');
    if(sessionString){
        sessionJSON = JSON.parse(sessionString);
        var key = sessionJSON.key

        var DBString = localStorage.getItem('_turfCamelotDB');
        var DBJSON = JSON.parse(DBString);

                console.log(DBString)

        var userData = DBJSON.userDataTable[key].players;
        console.log(DBJSON.userDataTable[key])
        PlayerController(userData, sessionService);
        $.get('/_userSession.html', (data)=>{
            $('body').html(data)
        });
    }else{
        loginPage();
    }


    var self = this;
    
    function loginPage(){
        $.get('/_login.html', (data)=>{
            $('body').html(data)
        });
    }


    function shout(words){
        window.alert(words);
    }

$('.logout-btn').ready(function(){
    $('.logout-btn').click(function(){
    console.log("LKONINGOINGGING OUT@!!!!")
    sessionService.logout();
    loginPage();
    location.reload()
    })
})

    $(document).ready(()=>{

$('.form-container').ready(function(){

    $('.login-form').on("submit", function great(a){
        a.preventDefault()
        console.log(a.target.password.value);
        var password = a.target.password.value;
        var username = a.target.username.value;
        try{
            var userData = sessionService.login(username, password)
            location.reload()
        }
        catch(error){
            shout("Username or Password is incorrect")
            console.log(error)
            return;
        }
        PlayerController(userData, sessionService);
    });
     $('.signup-form').on("submit", function great(a){
        a.preventDefault()
        console.log(a.target.password.value);
        var password = a.target.password.value;
        var username = a.target.username.value;
        try{
            var userData = sessionService.signup(username, password);
            location.reload()
        }
        catch(error){
            shout(error);
            return;
        }
        console.log(playerSession)
        PlayerController(userData, sessionService);
    });


})

  

    })
}


// turfCamelotDB = {
//     keyTable:{
//         "username":"encryptedkey"
//     }
//     usersTable:{
//         "decryptedkey":{
//             "playerservice": PlayerService() object
//         }
//     }
// }
