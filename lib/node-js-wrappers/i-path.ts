interface IPath {
    join(path1, path2):string;
    dirname(pathToFile:string):string;
}

export default IPath;