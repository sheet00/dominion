Game = function(copper,silver,gold,etc){

  this.copper = copper;
  this.silver = silver;
  this.gold = gold;
  this.etc = etc;

  Game.prototype.init = function(){
    var exec = function(){
      var copper = Number($("#copper").val());
      var silver = Number($("#silver").val());
      var gold = Number($("#gold").val());
      var etc = Number($("#etc").val());
      var game = new Game(copper,silver,gold,etc);
      game.start();
      $(this).blur();
    };

    $("select").on("change",function(){
      exec();
    });

    $("#play").on("click",function(){
      exec();
    });

  };

  Game.prototype.start = function(){
    console.clear();

    var deck = new Deck(this.copper,this.silver,this.gold,this.etc)

    var turn = 1

    for (var i = 0; i <= 10; i++) {
      console.log("turn[" + turn +"]--------------------------")

      deck.shuffle();
      deck.pull();

      deck.inspect();

      deck.buy_money();
      deck.list_to_trash();

      turn += 1
    }
  };


  Game.prototype.sleep = function(time,func){
    setTimeout(func, time);
  };


};



Deck = function(num_copper,num_silver,num_gold,num_etc){
  this.list = []; //手札
  this.yard = []; //山札
  this.trash = []; //捨札

  if (num_copper + num_silver + num_gold + num_etc < 5){
    alert("5枚ないよ！");
    throw new Error("under 5cards");
  }

  var setup = {copper: num_copper, silver: num_silver,gold: num_gold,etc: num_etc};
  for (var key in setup) {
   count = setup[key];
   for (var i = 0; i < count; i++) {
    var card = new Card(key);
    this.yard.push(card);
  }
}

Deck.prototype.shuffle = function(){
  var n = this.yard.length;
  for(var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = this.yard[i];
    this.yard[i] = this.yard[j];
    this.yard[j] = tmp;
  }
}

Deck.prototype.pull = function(){
  for (var i = 0; i < 5; i++) {
    if (this.yard.length == 0){
      this.yard = this.yard.concat(this.trash);
      this.trash = [];
      this.shuffle();
    }
    this.list.push(this.yard.shift());
  }
}

Deck.prototype.buy_money = function(){
  var money = this.sum_list();
  var card = null;
  switch (true){
    case 6 <= money:
    card = new Card("gold");
    break;

    case 3 <= money:
    card = new Card("silver");
    break;

    default:
    card = new Card("etc");
    break;
  }
  console.log("buy_card:" + card.name )
  this.yard.push(card);
};

Deck.prototype.list_to_trash = function(){
  this.trash = this.trash.concat(this.list)
  this.list = [];
};

Deck.prototype.sum_list = function(){
  return this.sum(this.list);
};

Deck.prototype.sum_all = function(){
  var total = 0;
  total += this.sum(this.list);
  total += this.sum(this.yard);
  total += this.sum(this.trash);

  return total;
};

Deck.prototype.sum = function(cards){
  var sum = 0;
  cards.forEach(function(item){
    sum += item.val
  });

  return sum;
}

Deck.prototype.inspect = function(){
  console.log("#list");
  this.console(this.list);
  console.log("#yard");
  this.console(this.yard);
  console.log("#trash");
  this.console(this.trash);
}

Deck.prototype.console = function(array){
  array.forEach(function (item, i) {
    console.log("[" + (i + 1) + "]" + item.name + "(" +item.val + ")");
  });
}
};

Card = function(name){
  this.name = name;
  var val = 0
  switch (name){
    case "copper":
    val = 1;
    break;

    case "silver":
    val = 2;
    break;

    case "gold":
    val = 3;
    break;

    default:
    val = 0;
    break;
  }

  this.val = val;
};