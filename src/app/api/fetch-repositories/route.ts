import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import util from 'util';
import { NextRequest, NextResponse } from 'next/server';

const execPromise = util.promisify(exec);

// NOTE: AETHOS classification temporarily disabled due to ONNX binary incompatibility on Vercel
export async function POST(req: NextRequest) {
  const { query } = await req.json();

  try {
    // const classifier = await pipeline('zero-shot-classification');
    const fedCodeData = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'fed-code.json'), 'utf8')
    );

    // Temporary fallback: return unranked top 5 projects
    const results = fedCodeData
      .flatMap((agency: any) =>
        agency.projects.map((project: any) => ({
          ...project,
          agency: agency.agencyName,
          relevance: Math.random() // placeholder
        }))
      )
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Error processing query', details: error.message },
      { status: 500 }
    );
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
