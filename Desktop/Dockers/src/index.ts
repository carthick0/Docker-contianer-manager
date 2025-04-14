import express, { Request, Response } from 'express';
import runPython from './containers/runPythonDocker';

const app = express();
const PORT = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express 🔥');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  const code=`print(input())`;
  runPython(code,'100');
});
