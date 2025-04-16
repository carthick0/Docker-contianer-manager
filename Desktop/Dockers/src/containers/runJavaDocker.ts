import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";


async function runJava(code:string,input:string) {
    

    const rawBuffer:Buffer[]=[];

    console.log("Initailising a new java docker container");
    const runCommand = `echo '${code.replace(/'/g, `'\\''`)}' > Main.java  && javac Main.java && echo '${input}' | java Main`;
  
    

    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
        '/bin/sh',
        '-c',
        runCommand
      ]);
    //starting or booting the corresponding docker container
    await javaDockerContainer.start();   
    console.log("started the docker container")
    

    const loggerStream=await javaDockerContainer.logs({
        stdout:true,
        stderr:true,
        timestamps:false,
        follow:true //wheather the logs are streamed or returned as a string
    });

    //Attach events on the stream objects to start and stop reading

    loggerStream.on('data',(chunk:any)=>{
        rawBuffer.push(chunk)
    })

    await new Promise((res)=>{
        loggerStream.on('end',()=>{
            console.log(rawBuffer);
            const completeBuffer=Buffer.concat(rawBuffer);
            const decodeStream=decodeDockerStream(completeBuffer);
            console.log(decodeStream)
            console.log(decodeStream.stdout);
            res(decodeDockerStream);
        })
    })
    
    await javaDockerContainer.remove();


}

export default runJava;