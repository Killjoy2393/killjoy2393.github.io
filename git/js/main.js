document.addEventListener("DOMContentLoaded", function() {
    let countryCallingCode = ''

    let formMain = document.getElementById("contactForm");
    formMain.addEventListener('submit', async function(event) {
      event.preventDefault();
      const name = document.getElementById('nameInput').value.trim();
      console.log(name)
      const phone = document.getElementById('phoneInput').value.trim();
      const comment = document.getElementById('commentInput').value.trim();
  
      if (!name || !phone) {
          alert('Пожалуйста, заполните обязательные поля.');
          return;
      }
  
      const data = {
          name: name,
          phone: countryCallingCode + phone,
          comment: comment
      };

        console.log(data.phone)
  
      try {
          const response = await fetch('https://script.google.com/macros/s/AKfycbxlZJz52sz9Pvgg5D9ZAzAGQZp6gYe9CoNi8eE1I7CNw8TK-2MA5LXyjX1Mxa4ZnnUfkA/exec', {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });
  
          if (response) {
              alert('Данные успешно отправлены!');
              form.classList.remove('show')
          } else {
              alert('Произошла ошибка при отправке данных.');
          }
      } catch (error) {
          console.error('Ошибка:', error);
          alert('Произошла ошибка при отправке данных.');
      }
  
      document.getElementById('contactForm').reset();
    });


  function validateNumericInput(event) {
    const input = event.target;
    const inputValue = input.value;
    const numericValue = inputValue.replace(/\D/g, ''); // оставляем только цифры

    if (inputValue !== numericValue) {
        input.value = numericValue; // обновляем значение в поле
    }
}
document.getElementById("phoneInput").addEventListener('input', validateNumericInput)

  setPhoneInputMask();

  const form = document.getElementById("mainForm");
  const buttons = document.querySelectorAll(".btn-set");
  buttons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        form.classList.add("show");
    });
  });

  let closeBtn = document.getElementById('closeForm');
  closeBtn.addEventListener('click', function(event) {
    event.preventDefault();
    form.classList.remove('show');
  });

  (async () => {
    const countryCode = await getUserCountryCode();
    countryCallingCode = await getCallingCode();
    if (countryCode) {
        console.log(`Код страны: ${countryCode}`); 
        
    } else {
        console.log('Не удалось получить код страны');
    }
  })();

  async function getUserCountryCode() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error('Не удалось получить данные о местоположении пользователя');
        }
        const data = await response.json();
        countryCallingCode = data.country_calling_code
        return data.country_code.toLowerCase(); // Возвращает код страны в нижнем регистре (например, "ru" для России)
    } catch (error) {
        console.error('Ошибка при получении данных о местоположении:', error);
        return null;
    }
  }

  async function getCallingCode() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error('Не удалось получить данные о местоположении пользователя');
        }
        const data = await response.json();
        return data.country_calling_code.toLowerCase(); // Возвращает код страны в нижнем регистре (например, "ru" для России)
    } catch (error) {
        console.error('Ошибка при получении данных о местоположении:', error);
        return null;
    }    
  }

  async function setPhoneInputMask() {
    const phoneInput = document.getElementById('phoneInput');
    const countryCode = await getUserCountryCode();
    if (countryCode) {
        window.intlTelInput(phoneInput, {
            initialCountry: countryCode,
            autoHideDialCode: true,
            separateDialCode: true,
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
        });
    } else {
        console.error('Не удалось установить маску для телефонного ввода');
    }
  }
});