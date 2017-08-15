function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((ya.ru)|(yandex.ru)|(yandex.ua)|(yandex.by)|(yandex.kz)|(yandex.com))$/;
  return re.test(email);
}

function isNumeric(obj) { // из jquery
  return !isNaN(obj - parseFloat(obj));
}

function validateFIO(fio) {
  let fio_arr_length = fio.split(" ").filter(x => x).length;
  if (fio_arr_length !== 3) {
    return false;
  } else return true;
}

function validatePhoneSum(phone) {
  if (phone) {
    let num_sum = phone.split("").filter(x => isNumeric(x)).reduce(function(sum, current) {
      return parseInt(sum) + parseInt(current);
    });
    return num_sum <= 30;
  } else return false;
}

function validatePhoneFormat(phone) {
  let re = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/g;
  return re.test(phone);
}

function validatePhone(phone) {
  return validatePhoneSum(phone) && validatePhoneFormat(phone);
}

function validateForm() {
  let fio = document.forms["myForm"]["fio"].value;
  let email = document.forms["myForm"]["email"].value;
  let phone = document.forms["myForm"]["phone"].value;

  return {
    fio: validateFIO(fio),
    email: validateEmail(email),
    phone: validatePhone(phone)
  };
}

let MyForm = {
  validate: function() {
    let isValid = true;
    let errorFields = Object.keys(validateForm()).filter(function(key) {
      if (!validateForm()[key]) {
        document.forms["myForm"][key].classList.add("error");
      }
      return !validateForm()[key];
    });

    if (Object.values(validateForm()).every(x => x)) {
      isValid = true;
    } else isValid = false;

    return {
      isValid: isValid,
      errorFields: errorFields
    };
  },
  getData: function() {
    return {
      fio: document.forms["myForm"]["fio"].value,
      email: document.forms["myForm"]["email"].value,
      phone: document.forms["myForm"]["phone"].value
    };

  },
  setData: function(inputDataObj) {
    for (let input of ["fio", "email", "phone"]) {
      if (inputDataObj[input]) {
        document.forms["myForm"][input].value = inputDataObj[input];
      }
    }
  },
  submit: function(e) {
    e.preventDefault();
    // let self = this;
    if (this.validate().isValid) {
      for (let input of ["fio", "email", "phone"]) {
        document.forms["myForm"][input].classList.remove("error");
      }

      document.forms["myForm"]["submitButton"].disabled = true;

      const statesArr = ["success", "error", "progress"];

      function send() {
        let state = statesArr[Math.floor(Math.random()*statesArr.length)];

        fetch(`./api/${state}.json`, {
          method: "GET", // вообще, конечно, POST, но для запроса за json файлы корретней get
          // body: JSON.stringify(self.getData()),
          headers: { "Content-Type": "application/json"}
        })
        .then(response => response.json())
        .then(data => {
          let resConttainer = document.getElementById("resultContainer");
          resConttainer.className = data.status;

          if (data.status === "progress") {
            setTimeout(send, data.timeout);
          }

          if (data.status === "error") {
            resConttainer.innerHTML = data.reason;
          }

          if (data.status === "success") {
            resConttainer.innerHTML = "Success";
          }
        });
      }

      send();
    } else {
      console.warn("Обнаружены ошибки в полях: ", this.validate().errorFields);
    }
  }
}

document.forms["myForm"].addEventListener("submit", MyForm.submit.bind(MyForm));
