import {IPipeable} from "./i-pipeable";

export interface IFileStream {
    pipe(pipeable:IPipeable);
}