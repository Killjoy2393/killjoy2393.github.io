var age = confirm('Вам уже есть 18?');
switch (age) {
  case true:
  alert('Добро пожаловать в домашку Игоря!)');
  break;
  default:
  alert('Насколько я знаю, моему преподователю есть 18. А если вы - не он, нефиг смотреть мою домашку!!!');
  break
};

console.log('Любая строка!');

var person = {
  name: 'Igor',
  age: 25,
  favColor: 'green',
  favMusic: 'Rock-n-roll',
  sayHi: function() {
   return('Igor say, HI!!!');
  }
};

console.log(person);
console.log(person.sayHi());

var i;
for (var i = 0;  i <= 20; i++) {
  if(i % 2 === 0) {
    console.log(i)
  }
};

var x = 10; 
var text = x > 5 ? 'Im JS-genius' : x < 5 ? 'so im genius of JS' : 'wow take it easy!'; 
console.log(text);

var y = 0;
while(y <= 7) {
  console.log(y);
  y++;
};

function apr(apr1, apr2, callback) {
  var apr3 = Math.pow(apr1,apr2);
  callback(apr3);
};

apr(2, 4, function(apr3){
  console.log('Результат ' +apr3);
});

