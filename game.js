Game = function(copper,silver,gold,etc){

  this.copper = copper;
  this.silver = silver;
  this.gold = gold;
  this.etc = etc;

  Game.prototype.init = function(){
    $("select").on("change",function(){

      var copper = Number($("#copper").val());
      var silver = Number($("#silver").val());
      var gold = Number($("#gold").val());
      var etc = Number($("#etc").val());

      var game = new Game(copper,silver,gold,etc)
      game.start()
    });
  };

  Game.prototype.start = function(){
    var yard = new Yard(this.copper,this.silver,this.gold,this.etc)
    yard.shuffle();


  };



  Yard = function(num_copper,num_silver,num_gold,num_etc){
    var setup = {copper: num_copper, silver: num_silver,gold: num_gold,etc: num_etc};


    for (var key in setup) {
      console.log(setup[key]);
      count = setup[key]
      for (var i = 0; i < count; i++) {
      }
    }



    Yard.prototype.shuffle = function(){
    }

  };

  Card = function(name,val){
    this.name = name;
    this.val = val;
  }

};

