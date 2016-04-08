import IPipeable from "./i-pipeable";

interface IFileStream {
    pipe(pipeable:IPipeable);
}

export default IFileStream;