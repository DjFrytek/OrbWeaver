function keepAlive() {
  fetch('dont-fall-sleep', {
    method: 'POST',
    mode: 'cors',
  })
  .then(response => {
    if (!response.ok) {
      console.error('Keep-alive request failed:', response.status);
    }
  })
  .catch(error => {
    console.error('Error sending keep-alive request:', error);
  });
}

// Send keep-alive message every 5 minutes
setInterval(keepAlive, 5 * 60 * 1000);

console.log('Keep-alive script running...');
