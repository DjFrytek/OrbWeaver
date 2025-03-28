async function signUp() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

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
      showProfileView();
      messageDiv.textContent = 'Sign up successful!';
    }
  } catch (error) {
    console.error('Sign up error:', error);
    messageDiv.textContent = 'Sign up failed: ' + error.message;
  }
}

async function signIn() {
  needRefreshReplays = true;

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const messageDiv = document.getElementById('auth-message');

  try {
    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.error) {
      console.error('Sign in error:', data.error);
      messageDiv.textContent = 'Sign in failed: ' + data.error;
    } else {
      console.log('Sign in success:', data);
      localStorage.setItem('supabase.auth.token', data.session.access_token);
      showProfileView();
      messageDiv.textContent = 'Sign in successful!';
    }
  } catch (error) {
    console.error('Sign in error:', error);
    messageDiv.textContent = 'Sign in failed: ' + error.message;
  }

  showLevelSelectionOverlay();

}

async function showProfileView() {
  hideElement('login-view');
  showElement('profile-view');
  hideElement('profile-settings-view');
  hideElement('game-settings-view');

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
        document.getElementById('username-display').textContent = 'Logged in as: ' + data.nickname;
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
      document.getElementById('username-display').textContent = 'Logged in as: ' + nickname;
    } catch (error) {
      console.error('Error updating nickname:', error);
    }
  }

  needRefreshReplays = true;
}

function showLoginPanel() {
  showElement('login-view');
  hideElement('profile-view');
  hideElement('profile-settings-view');
  hideElement('game-settings-view');
  document.getElementById('auth-message').textContent = '';
}


function logout() {
  needRefreshReplays = true;
  localStorage.removeItem('supabase.auth.token');
  showLoginPanel();

  showLevelSelectionOverlay();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('signUpButton').addEventListener('click', signUp);
  document.getElementById('signInButton').addEventListener('click', signIn);
  document.getElementById('logoutButton').addEventListener('click', logout);
  document.getElementById('setNicknameButton').addEventListener('click', updateNickname);
  document.getElementById('nickname').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      updateNickname();
    }
  });

  document.getElementById('profileSettingsButton').addEventListener('click', function() {
    hideElement('profile-view');
    hideElement('game-settings-view');
    showElement('profile-settings-view');
  });

  document.getElementById('gameSettingsButton').addEventListener('click', function() {
    hideElement('profile-view');
    hideElement('profile-settings-view');
    showElement('game-settings-view');
  });

  document.getElementById('profileSettingsGoBackButton').addEventListener('click', function() {
    hideElement('profile-settings-view');
    showElement('profile-view');
  });

  document.getElementById('gameSettingsGoBackButton').addEventListener('click', function() {
    hideElement('game-settings-view');
    showElement('profile-view');
  });

  // Check if token exists on page load
  if (localStorage.getItem('supabase.auth.token')) {
    showProfileView();
  } else {
    showLoginPanel();
  }
});
