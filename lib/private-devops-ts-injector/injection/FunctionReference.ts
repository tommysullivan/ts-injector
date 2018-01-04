import {IFunction, IFunctionSignature} from "../reflection/interfaces";
import {NotImplementedError} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/errors/not-implemented-error";

export class FunctionReference<ReturnType> implements IFunction<ReturnType> {

    invoke(args: any[]): ReturnType {
        return null;
    }

    get signature(): IFunctionSignature<ReturnType> {
        throw new NotImplementedError();
    }

    // isPartialFunction()
}