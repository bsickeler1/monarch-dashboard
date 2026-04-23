import fs from 'fs';
import path from 'path';
import Dashboard from './dashboard';

export default function Page() {
  const filePath = path.join(process.cwd(), 'monarch-deal-analysis.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return <Dashboard data={data} />;
}
