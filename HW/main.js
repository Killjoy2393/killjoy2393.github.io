var arr = ['Lorem ipsum', 'Blanditiis, eaque', 'Iure, quis', 'Iure, voluptatum',
'Maxime, veniam', 'Inventore, a', 'Eius, qui', 'Accusantium, amet', 'Nemo,eos', 'Vero, quos'];

alert('Необработанный массив: \n \n' + arr)

var arrWithO = arr.filter(function(elem) {

  var indx = (elem.indexOf('o'));

  if (indx !== -1) {
    return indx
  };

});
alert('Обработанный массив: \n \n' + arrWithO);
console.log(arrWithO);

var d = new Date();
var year = d.getFullYear();
var month = d.getMonth() + 1;
var date = d.getDate();
var hour = d.getHours();
var min = d.getMinutes();


 
alert('Формат: yyyy-mm-dd, hh:mm \n \n' + year + "-" + month + "-" + date + ', ' + hour + ':' + min);


var date = new Date() .toLocaleString();
alert('Формат: dd.mm.yyyy, hh:mm:ss \n \n' + date);