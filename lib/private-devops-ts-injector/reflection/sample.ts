export interface IPerson {
    firstName:string;
    lastName:string;
}

export interface IOther {
    myes:string;
}

export class PersonA implements IPerson {
    constructor(public a:number, public b:IOther) {}
    firstName ='tommy';
    lastName = 'sullivan';
}

export class PersonB implements IPerson {
    firstName = 'matt';
    lastName = 'Tastula';
}