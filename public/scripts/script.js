
function validateForm() {
  // Reset previous error messages
  const errorFields = ['firstname', 'lastname', 'email', 'mobile', 'password', 'password1'];
  errorFields.forEach(field => {
    document.getElementById(`error${field.charAt(0).toUpperCase() + field.slice(1)}`).textContent = '';
  });

  // Validate each field
  if (!validateName('firstname')) return false;
  if (!validateName('lastname')) return false;
  if (!validateEmail('email')) return false;
  if (!validateMobile('mobile')) return false;
  if (!validatePassword('password')) return false;
  if (!validatePasswordMatch('password1')) return false;
  return true
}


function expandform(fieldName) {
  const inputField = document.getElementById(fieldName);
  inputField.style.height = '37rem'
  return true;
}


function validateName(fieldName) {
  expandform('card');
  const inputField = document.getElementById(fieldName);
  const value = document.getElementById(fieldName).value.trim();
  const name = document.getElementById(fieldName).value
  const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
  if (value === '') {
    errorField.textContent = 'Name is required.';
    inputField.style.border = '1px solid red';
    return false;
  } else if (name.includes(' ')) {
    console.log('Name contains space:', name);
    errorField.textContent = 'Cannot include space.';
    inputField.style.border = '1px solid red';
    return false
  }
  else {
    inputField.style.border = '1px solid #ced4da';
  }
  return true;
}

function validateEmail(fieldName) {
  expandform('card');
  const inputField = document.getElementById(fieldName);
  const value = document.getElementById(fieldName).value.trim();
  const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === '') {
    errorField.textContent = 'Email is required.';
    inputField.style.border = '1px solid red';
    return false;
  } else if (!emailRegex.test(value)) {
    errorField.textContent = 'Invalid email format.';
    inputField.style.border = '1px solid red';
    return false;
  } else {
    inputField.style.border = '1px solid #ced4da';
  }
  return true;
}

function validateMobile(fieldName) {
  expandform('card');
  const inputField = document.getElementById(fieldName);
  const value = document.getElementById(fieldName).value.trim();
  const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
  const mobileRegex = /^\d{10}$/;

  if (value === '') {
    errorField.textContent = 'Mobile is required.';
    inputField.style.border = '1px solid red';
    return false;
  } else if (!mobileRegex.test(value)) {
    errorField.textContent = 'Invalid mobile format (should be 10 digits).';
    inputField.style.border = '1px solid red';
    return false;
  } else {
    inputField.style.border = '1px solid #ced4da';
  }
  return true;
}

function validatePassword(fieldName) {
  expandform('card');
  const inputField = document.getElementById(fieldName);
  const password = document.getElementById(fieldName).value
  const value = document.getElementById(fieldName).value.trim();
  const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);

  if (value === '') {
    errorField.textContent = 'Password is required.';
    inputField.style.border = '1px solid red';
    return false;
  } else if (value.length < 6) {
    errorField.textContent = 'Password should be at least 6 characters.';
    inputField.style.border = '1px solid red';
    return false;
  } else if (password.includes(' ')) {
    console.log('password contains space:', password);
    errorField.textContent = 'Cannot include space.';
    inputField.style.border = '1px solid red';
    return false
  } else {
    inputField.style.border = '1px solid #ced4da';
  }
  return true;
}

function validatePasswordMatch(fieldName) {
  expandform('card');
  const inputField = document.getElementById(fieldName);
  const password = document.getElementById(fieldName).value
  const passwordValue = document.getElementById('password').value.trim();
  const confirmPasswordValue = document.getElementById(fieldName).value.trim();
  const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);

  if (confirmPasswordValue === '') {
    errorField.textContent = 'Confirm Password is required.';
    inputField.style.border = '1px solid red';
    return false;
  } else if (passwordValue !== confirmPasswordValue) {
    errorField.textContent = 'Passwords do not match.';
    inputField.style.border = '1px solid red';
    return false;
  } else if (password.includes(' ')) {
    console.log('password contains space:', password);
    errorField.textContent = 'Cannot include space.';
    inputField.style.border = '1px solid red';
    return false
  } else {
    inputField.style.border = '1px solid #ced4da';
  }
  return true;
}




function validateloginform() {
  expandform('card');
  const errorFields = ['email', 'password',];
  errorFields.forEach(field => {
    document.getElementById(`error${field.charAt(0).toUpperCase() + field.slice(1)}`).textContent = '';
  });

  if (!validateEmail('email')) return false;
  if (!validatePassword('password')) return false;

  return true;

}


function showCustomAlert() {
  // Display the overlay
  document.getElementById("customAlertOverlay").style.display = "flex";
}

function closeCustomAlert() {
  // Hide the overlay
  document.getElementById("customAlertOverlay").style.display = "none";
}