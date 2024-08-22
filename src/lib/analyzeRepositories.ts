import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

interface Repository {
  name: string;
  description: string;
  repositoryURL: string;
  organization: string;
  // Add other properties as needed
}

export default async function analyzeRepositories(fedCodeData: any, query: string): Promise<any> {
  const allRepositories: Repository[] = fedCodeData.flatMap((agency: any) => 
    agency.projects.map((project: any) => ({
      ...project,
      agency: agency.agencyName
    }))
  );
  
  const scriptPath = path.join(process.cwd(), 'scripts', 'code_analysis.py');
  const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

  // Create a temporary file to store the repository data
  const tempFilePath = path.join(os.tmpdir(), `repos_${uuidv4()}.json`);

  try {
    // Write repository data to the temporary file
    await fs.writeFile(tempFilePath, JSON.stringify(allRepositories));

    return new Promise((resolve, reject) => {
      exec(`${pythonCommand} "${scriptPath}" "${tempFilePath}" "${query}"`, {
        env: { ...process.env, GITHUB_TOKEN: process.env.GITHUB_TOKEN },
        maxBuffer: 1024 * 1024 * 10, // 10 MB buffer
      }, async (error, stdout, stderr) => {
        // Clean up the temporary file
        await fs.unlink(tempFilePath);

        if (error) {
          console.error(`Execution error: ${error.message}`);
          reject(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Script error: ${stderr}`);
        }
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (parseError) {
          console.error(`Parse error: ${parseError.message}`);
          console.error(`Stdout: ${stdout}`);
          reject(`Error parsing result: ${parseError.message}`);
        }
      });
    });
  } catch (error) {
    console.error(`Error writing temporary file: ${error.message}`);
    throw error;
  }
}