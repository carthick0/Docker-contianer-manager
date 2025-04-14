import { TestCases } from "../types/testCases";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";



async function runPython(code:string,input:string) {

    const rawBuffer:Buffer[]=[];
    
    console.log("Initailising a new python docker container");
    const runCommand = `echo '${code.replace(/'/g, `'\\''`)}' > test.py && echo '${input}' | python3 test.py`;
  
    //const pythonDockerContainer=await  createContainer(PYTHON_IMAGE,['python3','-c',code,'stty -echo']);

    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
        '/bin/sh',
        '-c',
        runCommand
      ]);
    //starting or booting the corresponding docker container
    await pythonDockerContainer.start();   
    console.log("started the docker container")
    

    const loggerStream=await pythonDockerContainer.logs({
        stdout:true,
        stderr:true,
        timestamps:false,
        follow:true //wheather the logs are streamed or returned as a string
    });

    //Attach events on the stream objects to start and stop reading

    loggerStream.on('data',(chunk:any)=>{
        rawBuffer.push(chunk)
    })

    loggerStream.on('end',()=>{
        console.log(rawBuffer);
        const completeBuffer=Buffer.concat(rawBuffer);
        const decodeStream=decodeDockerStream(completeBuffer);
        console.log(decodeStream)
    })

    return pythonDockerContainer;


}
export default runPython    