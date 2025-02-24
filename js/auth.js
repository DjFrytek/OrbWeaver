async function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    const messageDiv = document.getElementById('auth-message');
    if (data.error) {
      console.error('Sign up error:', data.error);
      messageDiv.textContent = 'Sign up failed: ' + data.error;
    } else {
      console.log('Sign up success:', data);
      localStorage.setItem('supabase.auth.token', data.session.access_token);
      messageDiv.textContent = 'Sign up successful!';
      showLogoutButton();
    }
  } catch (error) {
    console.error('Sign up error:', error);
    messageDiv.textContent = 'Sign up failed: ' + error.message;
  }
}

async function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    const messageDiv = document.getElementById('auth-message');
    if (data.error) {
      console.error('Sign in error:', data.error);
      messageDiv.textContent = 'Sign in failed: ' + data.error;
    } else {
      console.log('Sign in success:', data);
      localStorage.setItem('supabase.auth.token', data.session.access_token);
      showLogoutButton();
    }
  } catch (error) {
    console.error('Sign in error:', error);
    messageDiv.textContent = 'Sign in failed: ' + error.message;
  }
}

async function showLogoutButton() {
  document.getElementById('signUpButton').style.display = 'none';
  document.getElementById('signInButton').style.display = 'none';
  document.getElementById('email').style.display = 'none';
  document.getElementById('password').style.display = 'none';
  document.getElementById('nickname').style.display = 'block';
  document.getElementById('logoutButton').style.display = 'block';

  // Fetch and display nickname
  const token = localStorage.getItem('supabase.auth.token');
  if (token) {
    try {
      const response = await fetch('/api/get-nickname', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.nickname) {
        document.getElementById('nickname').value = data.nickname;
      }
    } catch (error) {
      console.error('Error fetching nickname:', error);
    }
  }
}

async function updateNickname() {
  const token = localStorage.getItem('supabase.auth.token');
  const nickname = document.getElementById('nickname').value;

  if (token) {
    try {
      const response = await fetch('/api/update-nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nickname })
      });
      const data = await response.json();
      console.log('Nickname updated:', data);
    } catch (error) {
      console.error('Error updating nickname:', error);
    }
  }
}

function showLoginPanel() {
  document.getElementById('signUpButton').style.display = 'inline-block';
  document.getElementById('signInButton').style.display = 'inline-block';
  document.getElementById('email').style.display = 'inline-block';
  document.getElementById('password').style.display = 'inline-block';
  document.getElementById('logoutButton').style.display = 'none';
}


function logout() {
  localStorage.removeItem('supabase.auth.token');
  showLoginPanel();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('signUpButton').addEventListener('click', signUp);
  document.getElementById('signInButton').addEventListener('click', signIn);
  document.getElementById('logoutButton').addEventListener('click', logout);
  document.getElementById('nickname').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      updateNickname();
    }
  });

  // Check if token exists on page load
  if (localStorage.getItem('supabase.auth.token')) {
    showLogoutButton();
  } else {
    showLoginPanel();
  }
});
