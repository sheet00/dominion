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

      var score = [];

      var game = new Game(copper,silver,gold,etc);
      for (var i = 1; i <= 20; i++){
        var result = game.start(i);
        score.push(result);
      }

      console.clear();
      //console.log(score);
      game.log(score);
    };

    $("select").on("change",function(){
      exec();
    });

    $("#play").on("click",function(){
      $(this).blur();
      exec();
    });

  };

  Game.prototype.start = function(province_turn){

    results = [];
    exec_turn = 1000; //実行回数

    for (var i = 0; i < exec_turn; i++){
      var turn = 1
      var deck = new Deck(this.copper,this.silver,this.gold,this.etc)
      deck.shuffle();

      while (0 < deck.province_count ) {
        deck.pull();
      //deck.inspect(turn);

      var card = deck.buy_card(turn,province_turn)
      deck.yard.push(card);

      deck.list_to_trash();

      turn += 1;
    }
    //deck.inspect(turn)

    result = new Result(province_turn,turn,deck.first_province_money)
    results.push(result)
  }

  return this.average(results)
};


Game.prototype.sleep = function(time,func){
  setTimeout(func, time);
};

Game.prototype.average = function(results){
  var ave_turn = 0;
  var ave_first_province_money = 0;

  results.forEach(function(item){
    ave_turn += item.turn;
    ave_first_province_money += item.first_province_money;
  });

  ave_turn = ave_turn / results.length;
  ave_first_province_money = ave_first_province_money / results.length;

  return new Result(results[0].province_turn,ave_turn,ave_first_province_money)
}

Game.prototype.log = function(score){
  score = this.sort(score);

  $table = $("#log tbody");
  $table.html(null);
  score.forEach(function(item){
    $row = $("<tr>");
    $row.html("<td>" + item.turn + "</td>");
    $row.append("<td>" + item.province_turn + "</td>");
    $row.append("<td>" + item.first_province_money + "</td>");
    $table.append($row);
  });
}

Game.prototype.sort = function(score){
  var sort_score = score.sort(function(a, b){
    var x = a.turn;
    var y = b.turn;
    if (x > y) return 1;
    if (x < y) return -1;
    return 0;
  });

  return sort_score;
}

};



Deck = function(num_copper,num_silver,num_gold,num_etc){
  this.list = []; //手札
  this.yard = []; //山札
  this.trash = []; //捨札
  this.province_count = 4 //必要属州枚数 12/3人 = 4枚持っていれば引き分け
  this.first_province_money = 0 //属州1枚目取得時の合計金額

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


//ターン数によって金貨or属州に分岐
Deck.prototype.buy_card = function(turn,province_turn){
  var card = null;
  if (turn <= province_turn){
    card = this._buy_money();
  }else{
    card = this._buy_province();
  }

  //console.log("buy_card:" + card.name )
  return card;
}

Deck.prototype.list_to_trash = function(){
  this.trash = this.trash.concat(this.list)
  this.list = [];
};

Deck.prototype.sum_list = function(){
  return this._sum(this.list);
};

Deck.prototype.sum_all = function(){
  var total = 0;
  total += this._sum(this.list);
  total += this._sum(this.yard);
  total += this._sum(this.trash);

  return total;
};

Deck.prototype.inspect = function(turn){
  console.log("turn[" + turn +"]--------------------------")
  console.log("#list");
  this._console(this.list);
  console.log("#yard");
  this._console(this.yard);
  console.log("#trash");
  this._console(this.trash);
  console.log("#province_count[" + this.province_count + "]")
}

//private--------------------
Deck.prototype._buy_money = function(){
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

  return card;
};

Deck.prototype._buy_province = function(){
  var money = this.sum_list();
  var card = null;
  if (8 <= money ){
    //初回入手時の金額記録
    if (this.first_province_money == 0){
      this.first_province_money = this.sum_all();
    }

    card = new Card("province");
    this.province_count += -1;
  }else{
    card = this._buy_money();
  };

  return card;
}

Deck.prototype._sum = function(cards){
  var sum = 0;
  cards.forEach(function(item){
    sum += item.val
  });

  return sum;
}

Deck.prototype._console = function(array){
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

Result = function(province_turn,turn,first_province_money){
  this.province_turn = province_turn;
  this.turn = turn;
  this.first_province_money = first_province_money;
}