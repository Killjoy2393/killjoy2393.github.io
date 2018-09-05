btn.onclick = function addcomm() { 
  var div2 = document.createElement('div');
  var div = document.createElement('div');
  var text1 = document.getElementById('mail').value;
  if (mail.value != "") {  
  div.className = "comment";
  div.innerHTML = (text1);
  comments.insertBefore(div, comments.firstChild);
  div2.className = "name_data";
  div2.innerHTML = ('<b>Без имени</b>');
  comments.insertBefore(div2, comments.firstChild);
};
  mail.value = ""; 
};  
