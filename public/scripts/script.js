document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("registrationForm").addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Call the validation function
    if (validateForm()) {
      // If validation succeeds, manually submit the form
      this.submit();
    }
  });

  function validateForm() {
    // Reset previous error messages
    const errorFields = ['firstname', 'lastname', 'email', 'mobile', 'password', 'password1'];
    errorFields.forEach(field => {
      clearError(field);
    });

    // Validate each field
    if (!validateName('firstname')) return false;
    if (!validateName('lastname')) return false;
    if (!validateEmail('email')) return false;
    if (!validateMobile('mobile')) return false;
    if (!validatePassword('password')) return false;
    if (!validatePasswordMatch('password1')) return false;

    return true;
  }

  function expandform(fieldName) {
    const inputField = document.getElementById(fieldName);
    if (inputField) {
      inputField.style.height = '37rem';
    }
    return true;
  }

  function clearError(fieldName) {
    const errorElement = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
    if (errorElement) {
      errorElement.textContent = '';
    } else {
      console.error(`Error element with ID ${'error' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} not found.`);
    }
  }

  function validateName(fieldName) {
    expandform('card');
    const inputField = document.getElementById(fieldName);
    const value = inputField.value.trim();
    const name = inputField.value;
    const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
    if (value === '') {
      inputField.placeholder = 'Name is required.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (name.includes(' ')) {
      console.log('Name contains space:', name);
      inputField.placeholder = 'Cannot include space.';
      inputField.style.border = '1px solid red';
      return false;
    } else {
      inputField.style.border = '1px solid #ced4da';
    }
    return true;
  }

  function validateEmail(fieldName) {
    expandform('card');
    const inputField = document.getElementById(fieldName);
    const value = inputField.value.trim();
    const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (value === '') {
      inputField.placeholder = 'Email is required.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (!emailRegex.test(value)) {
      inputField.placeholder = 'Invalid email format.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (!value.includes('gmail')) {
      inputField.placeholder= 'Only Gmail addresses are allowed.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (!value.includes('.com')) {
      inputField.placeholder = 'The email address must contain ".com".';
      inputField.style.border = '1px solid red';
      return false;
    } else {
      inputField.placeholder = ''; // Clear previous error messages
      inputField.style.border = '1px solid #ced4da';
    }
    return true;
  }
  
  

  function validateMobile(fieldName) {
    expandform('card');
    const inputField = document.getElementById(fieldName);
    const value = inputField.value.trim();
    const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
    const mobileRegex = /^\d{10}$/;

    if (value === '') {
      inputField.placeholder = 'Mobile is required.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (!mobileRegex.test(value)) {
      inputField.placeholder = 'Invalid mobile format (should be 10 digits).';
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
    const password = inputField.value;
    const value = inputField.value.trim();
    const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);

    if (value === '') {
      inputField.placeholder = 'Password is required.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (value.length < 6) {
      inputField.placeholder = 'Password should be at least 6 characters.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (password.includes(' ')) {
      inputField.placeholder= 'Cannot include space.';
      inputField.style.border = '1px solid red';
      return false;
    } else {
      inputField.style.border = '1px solid #ced4da';
    }
    return true;
  }

  function validatePasswordMatch(fieldName) {
    expandform('card');
    const inputField = document.getElementById(fieldName);
    const password = inputField.value;
    const passwordValue = document.getElementById('password').value.trim();
    const confirmPasswordValue = inputField.value.trim();
    const errorField = document.getElementById(`error${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);

    if (confirmPasswordValue === '') {
      inputField.placeholder= 'Confirm Password is required.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (passwordValue !== confirmPasswordValue) {
      inputField.placeholder= 'Passwords do not match.';
      inputField.style.border = '1px solid red';
      return false;
    } else if (password.includes(' ')) {
      console.log('password contains space:', password);
      inputField.placeholder = 'Cannot include space.';
      inputField.style.border = '1px solid red';
      return false;
    } else {
      inputField.style.border = '1px solid #ced4da';
    }
    return true;
  }
});


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
