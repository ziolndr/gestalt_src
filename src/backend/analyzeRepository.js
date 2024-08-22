const { exec } = require('child_process');
const path = require('path');

function analyzeRepository(repoUrl, query) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'code_analysis.py');
    exec(`GITHUB_TOKEN=${process.env.GITHUB_TOKEN} python "${scriptPath}" "${repoUrl}" "${query}"`, (error, stdout, stderr) => {      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Error: ${stderr}`);
        return;
      }
      resolve(JSON.parse(stdout));
    });
  });
}

module.exports = analyzeRepository;