// route.ts

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';

async function fetchFileContent(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching file content from ${url}:`, error);
    return null;
  }
}

function calculateRelevance(query: string, project: any, fileContent: string | null = null) {
  const searchTerms = query.toLowerCase().split(' ');
  let projectText = `${project.name} ${project.description} ${project.tags.join(' ')}`.toLowerCase();

  if (fileContent) {
    projectText += ' ' + fileContent.toLowerCase();
  }

  return searchTerms.reduce((score, term) => {
    return score + (projectText.includes(term) ? 1 : 0);
  }, 0) / searchTerms.length;
}

export async function POST(request: NextRequest) {
  try {
    const { query, analysisType, repositoryURL } = await request.json();

    const dataFilePath = path.join(process.cwd(), 'fed-code.json');
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const fedCodeData = JSON.parse(fileContents);

    let results = [];

    if (analysisType === 'code' && repositoryURL) {
      const codeFiles = await fetchGithubRepoContents(repositoryURL);
      results = await analyzeCode(query, codeFiles);
      results = results.map(result => ({
        ...result,
        repositoryURL,
        agency: 'N/A',
        name: 'N/A',
        description: 'N/A',
        tags: []
      }));
    } else {
      for (const agency of fedCodeData) {
        for (const project of agency.projects) {
          let relevance = 0;
          let codeSnippet = null;
          let filePath = null;

          if (analysisType === 'repository' || analysisType === 'both') {
            relevance = calculateRelevance(query, project);
          }

          if ((analysisType === 'both') && project.repositoryURL) {
            const codeFiles = await fetchGithubRepoContents(project.repositoryURL);
            const codeAnalysisResults = await analyzeCode(query, codeFiles);

            for (const codeResult of codeAnalysisResults) {
              if (codeResult.similarity > 0.5) {
                relevance = Math.max(relevance, codeResult.similarity);
                codeSnippet = codeResult.codeSnippet;
                filePath = codeResult.filePath;
              }
            }
          }

          if (relevance > 0) {
            results.push({
              ...project,
              agency: agency.agencyName,
              relevance,
              codeSnippet,
              filePath,
              repositoryURL: project.repositoryURL
            });
          }
        }
      }
    }

    const sortedResults = results
      .sort((a: any, b: any) => b.relevance - a.relevance)
      .slice(0, 5);

    console.log('Sorted Results:', JSON.stringify(sortedResults, null, 2));

    return NextResponse.json(sortedResults);
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json({ error: 'Error processing query' }, { status: 500 });
  }
}

async function fetchGithubRepoContents(repositoryURL: string): Promise<any[]> {
  const [_, __, owner, repoName] = repositoryURL.split('/').slice(-4);
  const githubRepoURL = `https://api.github.com/repos/${owner}/${repoName}/contents`;

  try {
    const response = await axios.get(githubRepoURL);
    return response.data;
  } catch (error) {
    console.error(`Error fetching repository contents from ${repositoryURL}:`, error);
    return [];
  }
}

async function analyzeCode(query: string, codeFiles: any[]): Promise<any[]> {
  const scriptPath = path.join(process.cwd(), 'scripts', 'code_analysis.py');
  const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
  const tempFilePath = path.join(os.tmpdir(), `code_files_${uuidv4()}.json`);

  try {
    await fs.writeFile(tempFilePath, JSON.stringify(codeFiles));

    return new Promise((resolve, reject) => {
      exec(`${pythonCommand} "${scriptPath}" "${tempFilePath}" "${query}"`, {
        env: { ...process.env, GITHUB_TOKEN: process.env.GITHUB_TOKEN },
        maxBuffer: 1024 * 1024 * 10,
      }, async (error, stdout, stderr) => {
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
          if (parseError instanceof Error) {
            console.error(`Parse error: ${parseError.message}`);
            console.error(`Stdout: ${stdout}`);
            reject(`Error parsing result: ${parseError.message}`);
          } else {
            console.error('Parse error:', parseError);
            reject('Unknown parse error occurred.');
          }
        }
      });
    });
  } catch (error: any) {
    console.error(`Error writing temporary file: ${error.message}`);
    throw error;
  }
}
