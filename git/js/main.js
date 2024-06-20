
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("mainForm")
  const buttons = document.querySelectorAll(".btn-set")
  buttons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Button clicked!');
        form.classList.add("show")
    })
  })
  const closeBtn = document.getElementById('closeForm')
  closeBtn.addEventListener('click', function(event) {
    event.preventDefault
    form.classList.remove('show')
  })
});