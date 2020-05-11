function submitFunction() {
  console.log("RETURNING FALSE");
  return false;
}

// Validator functions
function fullnameValidator() {
  console.log("hi");
  let form = document.getElementById("fullnameGroup");

  // User Data
  const fullname = document.getElementById("fullname");

  // Checker
  fullnameChecker();
}

function usernameValidator() {
  let form = document.getElementById("fullnameGroup");

  // User Data
  const username = document.getElementById("username");

  //Checker
  usernameChecker();
}

function emailValidator() {
  let form = document.getElementById("fullnameGroup");

  // User Data
  const email = document.getElementById("email");

  // Checker
  emailChecker();
}

function passwordValidator() {
  let form = document.getElementById("fullnameGroup");
  // User Data
  const password = document.getElementById("password");

  // Checker
  passwordChecker();
}

function confirmationPasswordValidator() {
  let form = document.getElementById("fullnameGroup");

  // User Data
  const password = document.getElementById("password");
  const confirmationPassword = document.getElementById("confirmationPassword");

  // Checker
  confirmationPasswordChecker();
}

// Checker functions
function fullnameChecker() {
  const fullnameValue = fullname.value.trim();
  if (fullnameValue === "") {
    setErrorFor(fullname, "Fullname can not be empty");
  } else if (fullnameValue.length < 3) {
    setErrorFor(fullname, "Fullname can not be less than 3");
  } else {
    setSuccessFor(fullname);
  }
}

function usernameChecker() {
  const usernameValue = username.value.trim();
  if (usernameValue === "") {
    setErrorFor(username, "Username can not be empty");
  } else if (usernameValue.length < 3) {
    setErrorFor(username, "Username can not be less than 3");
  } else {
    setSuccessFor(username);
  }
}

function emailChecker() {
  const emailValue = email.value.trim();
  if (emailValue === "") {
    setErrorFor(email, "Email can not be empty");
  } else if (!isValidEmail(emailValue)) {
    setErrorFor(email, "Email is not valid");
  } else {
    setSuccessFor(email);
  }
}

function passwordChecker() {
  const passwordValue = password.value.trim();
  if (passwordValue === "") {
    setErrorFor(password, "Password can not be empty");
  } else if (passwordValue.length < 8) {
    setErrorFor(password, "Password can not be less than 8");
  } else {
    setSuccessFor(password);
  }
}

function confirmationPasswordChecker() {
  const passwordValue = password.value.trim();
  const confirmationPasswordValue = confirmationPassword.value.trim();
  if (confirmationPasswordValue === "") {
    setErrorFor(confirmationPassword, "Confirmation password can not be empty");
    setErrorFor(password, "Type your password");
  } else if (confirmationPasswordValue != passwordValue) {
    setErrorFor(confirmationPassword, "Confirmation password do not match");
    setErrorFor(password, "Ensure type your password correctly");
  } else {
    setSuccessFor(confirmationPassword);
    setSuccessFor(password);
  }
}

// Error functions
function setErrorFor(input, message) {
  const formControl = input.parentElement;
  // Icons
  const successIcon = formControl.children[2];
  const errorIcon = formControl.children[3];
  // Setting styles
  errorIcon.style = "visibility: visible; color: #e74c3c";
  successIcon.style = "visibility: hidden";
  // Printing error
  const small = formControl.querySelector("small");
  const icon = formControl.querySelector("i");
  input.className = "form-control form-style print-error";
  input.style = "border-color: #e74c3c; outline: 0";
  small.style = "visibility: visible";
  small.className = "error-msg show-error-msg";
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  // Icons
  const successIcon = formControl.children[2];
  const errorIcon = formControl.children[3];
  // Setting styles
  errorIcon.style = "visibility: hidden";
  successIcon.style = "visibility: visible; color: #2ecc71";
  // Deleting error
  const small = formControl.querySelector("small");
  input.className = "form-control form-style print-success";
  input.style = "border-color: #2ecc71; outline: 0;";
  small.className = "";
  small.style = "visibility: hidden";
  small.innerText = " ";
}

function isValidEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}
