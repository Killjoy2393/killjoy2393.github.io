document.addEventListener("DOMContentLoaded", function() {
  let formMain = document.getElementById("contactForm");
  formMain.addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const comment = document.getElementById('commentInput').value.trim();
    console.log(name);

    if (!name || !phone) {
        alert('Пожалуйста, заполните обязательные поля.');
        return;
    }

    const data = {
        name: name,
        phone: phone,
        comment: comment
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxlZJz52sz9Pvgg5D9ZAzAGQZp6gYe9CoNi8eE1I7CNw8TK-2MA5LXyjX1Mxa4ZnnUfkA/exec', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Данные успешно отправлены!');
        } else {
            alert('Произошла ошибка при отправке данных.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке данных.');
    }

    document.getElementById('contactForm').reset();
  });

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
    if (countryCode) {
        console.log(`Код страны: ${countryCode}`); // Код страны как строка
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
        return data.country_code.toLowerCase(); // Возвращает код страны в нижнем регистре (например, "ru" для России)
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