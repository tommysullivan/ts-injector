import {ReflectionDigestForTesting} from "./fake-types/ReflectionDigestForTesting";
import {Let} from "mocha-let-ts";
import {PrimitivesForNodeJS} from "private-devops-ts-primitives/dist/private-devops-ts-primitives/api/nodejs/primitives-for-node-js";

export const primitives = Let(() => new PrimitivesForNodeJS());
export const collections = Let(() => primitives().collections);
export const reflectionDigest = Let(() => new ReflectionDigestForTesting(collections()));