import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import util from 'util';
import { NextRequest, NextResponse } from 'next/server';

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  
  try {
    const classifier = await pipeline('zero-shot-classification');
    const fedCodeData = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'fed-code.json'), 'utf8')
    );
    
    const results = await Promise.all(
      fedCodeData.flatMap((agency: any) =>
        agency.projects.map(async (project: any) => {
          const result = await classifier(project.description, [query]);
          return {
            ...project,
            agency: agency.agencyName,
            relevance: result.scores[0]
          };
        })
      )
    );

    const sortedResults = results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);

    return NextResponse.json(sortedResults);
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json({ error: 'Error processing query' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'fed-code.js');
    console.log('Script path:', scriptPath);

    const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
    console.log('Script output:', stdout);
    if (stderr) console.error('Script errors:', stderr);

    const dataFilePath = path.join(process.cwd(), 'fed-code.json');
    console.log('Data file path:', dataFilePath);

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    console.log('File read successfully');

    const data = JSON.parse(fileContents);
    console.log('Data parsed successfully');

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Error fetching repository data', details: error.message },
      { status: 500 }
    );
  }
}
