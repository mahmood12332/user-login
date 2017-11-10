var mapp = angular.module("MyApp", ['firebase','ngRoute']);
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBCPKAX8a-vgXQnuIRd-zBkvd-meKKHV5w",
    authDomain: "angular-59971.firebaseapp.com",
    databaseURL: "https://angular-59971.firebaseio.com",
    projectId: "angular-59971",
    storageBucket: "angular-59971.appspot.com",
    messagingSenderId: "598546800687"
  };
  firebase.initializeApp(config);
var db = firebase.database();
// var fbAuth = $firebaseAuth();

mapp.run(["$rootScope", "$location", function($rootScope, $location) {
$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
  // We can catch the error thrown when the $requireAuth promise is rejected
  // and redirect the user back to the home page
  if (error === "AUTH_REQUIRED") {
    $location.path("/");
  }
});
}]);
mapp.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    
    return $firebaseAuth();
  }
]);

  mapp.controller("MainCtrl", HomeController);
  mapp.controller("ViewCtrl", ViewController);
  mapp.config(function($routeProvider){
    $routeProvider
    
    .when('/',{
        templateUrl:'home.htm',
        controller:  'MainCtrl'
    })
    
    .when('/viewdata',{
        templateUrl: 'viewData.htm',
        controller: 'ViewCtrl',
        // resolve: {
        //   "currentAuth" : ["Auth",function(Auth){
        //     return Auth.$requireSignIn();
        //   }]
        // }
      })
    
    .otherwise({
      redirectTo: '/'
    });
  
  //  $locationProvider.html5Mode(true);
  });
              
function HomeController($scope, $firebaseObject, $firebaseAuth, $firebaseArray){
$scope.fbAuth = $firebaseAuth();
$scope.err = {};
  //var authData = fbAuth.$getAuth();
$scope.fbAuth.$onAuthStateChanged(function(firebaseUser) {
  if (firebaseUser) {
    console.log("Signed in as:", firebaseUser.email);
    $scope.btn_show = true;
  } else {
    console.log("Signed out");
    $scope.btn_hide = true;
    $scope.btn_show = false;
  }
});
      $scope.logmein = function(username, password) {
        $scope.fbAuth.$signInWithEmailAndPassword(
            username,
            password
        ).then(function(authData) {
            $scope.err.message = "Successfully Logged in as " + authData.uid +" "+authData.providerId;
          $scope.btn_hide = false;
        }).catch(function(error) {
          $scope.err.message = "Error" + error;
            console.error("ERROR: " + error);
          $scope.btn_hide = true;
        });
    };
  
      $scope.regmein = function(usernames, passwords,lnames,fnames) {
        console.error("User Details: " + usernames +  $scope.usernames);
       // username = "test@test123.com";
        $scope.fbAuth.$createUserWithEmailAndPassword(
            usernames,
            passwords,
            lnames,
            fnames
        ).then(function(authData) {
            $scope.err.message = "User registered "+authData.uid;
            $scope.populate();
        }).catch(function(error) {
          $scope.err.message = "Error" + error;
            console.error("ERROR: " + error);
        });

    };
  
  // $scope.logmeout = function() {
  //   $scope.fbAuth.$signOut();
  //   $scope.err.message = "Logged Out";
  // };
  console.error("ERROR: ");
    $scope.deleteuser = function() {
    $scope.fbAuth.$deleteUser();
    $scope.err.message = "User Deleted";
      $scope.btn_hide = true;
  };
  
     $scope.checkstatus = function(){
       var authData = $scope.fbAuth.$getAuth();

        if (authData) {
           $scope.err.message = "Logged in as: " + authData.uid +" "+ authData.email+" "+ authData.password;
          
            $scope.btn_hide = false;
          
        } else {
           $scope.err.message = "Not Logged in!";
          $scope.btn_hide = true;
        }
      };
//   $scope.populate = function(){
//     var ref = db.ref("/topics");
//     syncObject = $firebaseObject(ref);
//     syncObject.$bindTo($scope, "data");                                         
    
//     syncObject.$watch(function(info) {
//      console.log("$scope: Data Changed on the Server", info);
//      });
    
//   };

  
  $scope.populate = function(){
    var authData = $scope.fbAuth.$getAuth();
    if (authData){
    var refPath = "/topics/"+authData.uid;
    so = $firebaseArray(db.ref(refPath));
    so.$add({
      lnames: $scope.lnames,
      fnames: $scope.fnames,
      email: authData.email
    }).then(function(dat){
      $scope.err.message = "Data uploaded";
    });
    }
  };
  $scope.cusauth = function() {
     // e.preventDefault();
    var sec = '';
    var tokenGenerator = new FirebaseTokenGenerator(sec);
    var token = tokenGenerator.createToken({ uid: "5KuXbpGU2AP3zUYcP2PvcaoUQOT", role: "Admin", username: "testadmin@test.com" });

    console.log(token);
    // 
   // var ref = new Firebase("https://ionicangular-8752e.firebaseio.com/");
// $scope.fbAuth.$signInWithCustomToken(token, function(authData) {
//   if (authData) {
//     console.log("Login Succeeded!", authData);
//   } else {
//     console.log("Login Failed!");
//   }
// });
    $scope.fbAuth.$signInWithCustomToken(token)
    .then(function(authData) {
            $scope.err.message = "User registered "+authData.uid;
      console.log("Custom Login success: " , authData);
        }).catch(function(error) {
          $scope.err.message = "Error" + error;
            console.error("ERROR: " + error);
        });
  };
  
};


function ViewController($scope,$firebaseObject, $firebaseArray, Auth){
  var aout = Auth.$getAuth();
    if (aout){
      var reff = '/topics/'+aout.Identifier;
      if (aout.email=='testadmin@test.com'){
        reff = '/topics/';
      }
    } else{
     reff = '/topics/'; 
    }
    $scope.uid = {};
    $scope.lst = {};
    $scope.list = [];
    $scope.lst = $firebaseArray(db.ref(reff));
    $scope.newlst = $firebaseArray(db.ref('/topics/'));
    $scope.user = $firebaseArray(db.ref('/topics/'));


    $scope.lst.$loaded().then(function(object){
     $scope.lst = object;
     console.log($scope.lst)
    });

    $scope.newlst.$loaded().then(function(object){
     $scope.list = object;
     console.log($scope.list)
    });

    $scope.user.$loaded().then(function(object){
     $scope.uid = object;
     console.log($scope.uid)
    });

};