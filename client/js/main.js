$(document).ready(function(){
    //dom cache
    var $logInToggle = $("header div h5.login");
    var $logInInputs = $("header div input.login");
    var $addGameButton = $("#addGameButton");
    var $addGameModule = $("#addGameModule");
    ////// click log in to show inputs
    $logInToggle.on("click", function(){
      console.log("clicked");
      $logInInputs.toggleClass("hidden");
      //on successful login, unhide header div h5.addUser
      //on successful login, unhide $addGameButton;
    });
    
    ///// click plus sign to show addGameModule
    $addGameButton.on("click", function(){
      console.log("clicked");
      $addGameModule.toggleClass("hidden");
      //if input.val()!= "", create a new game object populated with the values
    });
    /// Pikaday within addGameModule
    var field = document.getElementById('datepicker');
    var picker = new Pikaday({ 
      field: $('#datepicker')[0], 
      //trigger: $("#datepicker")[0],
      //container: $(this)[0],
      format: 'DD/MM/YYYY',
      firstDay: 1
    });
  
  

    
    /*
    function ChatController($scope) {
        var socket = io.connect();

        $scope.messages = [];
        $scope.roster = [];
        $scope.name = '';
        $scope.text = '';

        socket.on('connect', function () {
          $scope.setName();
        });

        socket.on('message', function (msg) {
          $scope.messages.push(msg);
          $scope.$apply();
        });

        socket.on('roster', function (names) {
          $scope.roster = names;
          $scope.$apply();
        });

        $scope.send = function send() {
          console.log('Sending message:', $scope.text);
          socket.emit('message', $scope.text);
          $scope.text = '';
        };

        $scope.setName = function setName() {
          socket.emit('identify', $scope.name);
        };
     };
     */
});

