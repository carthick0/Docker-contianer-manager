import { off } from "process";
import DockerStreamOutput from "../types/dockerStreamOutput";
import { HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer:Buffer):DockerStreamOutput{
    let offset:number=0;//this variable keeps track of the current pos in the buffer while parsing

    //this output that will store the accumulated stdout and stderr ouput as a string 
    const output:DockerStreamOutput={stdout:'',stderr:''}

    while(offset<buffer.length){

        //channel is read from buffer and has value of type of stream
        const typeOfStream=buffer[offset];

       

        //this length variable hold the length of the value
        //we will read this variable on a offset of 4bytes from the strart  of the chunk
        const length=buffer.readUint32BE(offset+4);

         //as  now we have read the header , we can move forward to the value of chunk
         offset+=HEADER_SIZE;

        if(typeOfStream===1){
            output.stdout+=buffer.toString('utf-8',offset,offset+length);
        }
        else if(typeOfStream===2){
            output.stderr+=buffer.toString('utf-8',offset,offset+length);

        }
        offset+=length;//move offset to next chunk

    }

    return output;

}