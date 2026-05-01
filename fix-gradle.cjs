const fs = require('fs');
const https = require('https');
const path = require('path');

const jarPath = path.join(__dirname, 'android', 'gradle', 'wrapper', 'gradle-wrapper.jar');

async function downloadJar() {
  console.log('Fetching pure gradle-wrapper.jar to prevent CI corruption...');
  const url = 'https://raw.githubusercontent.com/ionic-team/capacitor-testapp/main/android/gradle/wrapper/gradle-wrapper.jar';

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects if any
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (res2) => {
          const file = fs.createWriteStream(jarPath);
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
      } else {
        const file = fs.createWriteStream(jarPath);
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', reject);
  });
}

downloadJar().then(() => {
  console.log('gradle-wrapper.jar has been replaced successfully!');
}).catch(err => {
  console.error('Failed to download wrapper:', err);
  process.exit(1);
});
