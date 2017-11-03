import * as ts from 'typescript';
import {readFileSync} from "fs";

export class MetadataCapturer {
    captureMetadata():void {
        const fileName = '/Users/thomassullivan/Code/private-devops-ts-primitives/lib/private-devops-ts-primitives/reflection/sample.ts';
        const sourceFile = ts.createSourceFile(
            fileName,
            readFileSync(fileName).toString(),
            ts.ScriptTarget.ES2016,
            false
        );
        const recursivelySeekMetadata = (node: ts.Node) => {
            switch (node.kind) {
                case ts.SyntaxKind.ImplementsKeyword:
                    console.log('implements', node);
                    break;
                case ts.SyntaxKind.ClassDeclaration:
                    const theClass = node as ts.ClassDeclaration;
                    console.log(`Class: ${theClass.name.text}`);
                    theClass.heritageClauses.forEach(clause => {
                        console.log(clause.types.map(t => (t.expression as any).text));
                    });
                    theClass.members.forEach(member => {
                        if(member.kind==ts.SyntaxKind.Constructor) {
                            const theConstructor = member as ts.ConstructorDeclaration;
                            theConstructor.parameters.map(parameter => {
                                console.log((parameter.name as any).text);
                                const paramType = parameter.type.kind == ts.SyntaxKind.TypeReference
                                    ? (parameter.type as any).typeName.text
                                    : this.getKind(parameter.type.kind);
                                console.log(paramType);
                            });
                        }
                    });
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                    const theInterface = node as ts.InterfaceDeclaration;
                    console.log(`Interface: ${theInterface.name.text}`);
                    break;
            }
            ts.forEachChild(node, recursivelySeekMetadata);
        };
        recursivelySeekMetadata(sourceFile);
    }

    getKind(kind:ts.SyntaxKind):string {
        return ts.SyntaxKind[kind];
    }
}