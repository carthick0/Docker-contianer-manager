import express, { Request, Response } from 'express';
import runPython from './containers/runPythonDocker';
import runJava from './containers/runJavaDocker';
import runCpp from './containers/runCPPDocker';

const app = express();
const PORT = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript + Express 🔥');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // const code=`
  // import java.util.*;
  // public class Main {
  //   public static void main(String[] args){
  //     Scanner scn = new Scanner(System.in);

  //     int input=scn.nextInt();
  //     System.out.println("The value of input :"+ input);
  //     for(int i=0;i<input;i++){
  //       System.out.println(i);
  //     }
  //   }
  // }
  // `;

  const code=`
    #include<iostream>
    using namespace std;
    
    int main(){

    int x;
    cin>>x;
    cout<<"Value of x is"<<x<<endl;

    }
  
  `;
  runCpp(code,'10');
});
