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
    if (data.error) {
      console.error('Sign up error:', data.error);
    } else {
      console.log('Sign up success:', data);
      localStorage.setItem('supabase.auth.token', data.session.access_token);
    }
  } catch (error) {
    console.error('Sign up error:', error);
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
    if (data.error) {
      console.error('Sign in error:', data.error);
    } else {
      console.log('Sign in success:', data);
      localStorage.setItem('supabase.auth.token', data.session.access_token);
    }
  } catch (error) {
    console.error('Sign in error:', error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('signUpButton').addEventListener('click', signUp);
  document.getElementById('signInButton').addEventListener('click', signIn);
});

