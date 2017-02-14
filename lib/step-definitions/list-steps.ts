import { binding as steps, given, when, then } from "cucumber-tsflow";
import {IList} from "../collections/i-list";
import {IRepository} from "../packaging/i-repository";
import {IFuture} from "../futures/i-future";
import {PromisedAssertion} from "../chai-as-promised/promised-assertion";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";

declare var module:any;
declare const $:ICucumberStepHelper;

@steps()
export class ListSteps {
    private originalItems:IList<Object>;
    private uniqueItems:IList<Object>;

    private newRepo(url:string):IRepository {
        return $.packaging.newRepository(
            {
                releases: [],
                packages: [],
                url: url
            },
            null
        );
    }

    @given(/^I have a list of repositories where two or more have the same URL$/)
    public givenAListOfReposWithDupURLs():void {
        this.originalItems = $.collections.newList<Object>([
            this.newRepo('urlA'),
            this.newRepo('urlB'),
            this.newRepo('urlC'),
            this.newRepo('urlB'),
            this.newRepo('urlA'),
        ]);
    }

    @when(/^I ask for the unique items/)
    public getUniqueRepositories():void {
        this.uniqueItems = this.originalItems.unique;
    }

    @then(/^it gives the unique repositories/)
    public thenReposAreUnique():void {
        $.expect(this.uniqueItems.map(r => (<IRepository>r).url).toArray()).to.eql(['urlA','urlB','urlC']);
    }

    @given(/^I have a list of items where two or more are the same$/)
    public givenAListOf(): void {
        this.originalItems = $.collections.newList<Object>([1,2,3,4,5,4,2]);
    }

    @then(/^it gives the unique numbers/)
    public thenNumbersAreUnique():void {
        $.expect(this.uniqueItems.toArray()).to.eql([1,2,3,4,5]);
    }

    private listOfInts:IList<number>;
    private futureGroupPromise:IFuture<IList<string>>;
    private funcThatReturnsAsync(i:number):IFuture<IList<string>> {
        const retVal = $.collections.newList([`string${i}-a`, `string${i}-b`]);
        return $.futures.newFutureForImmediateValue(retVal);
    }

    @given(/^I have a list of integers and an async map function$/)
    public GivenListOfIntsWithAsyncMap(): void {
        this.listOfInts = $.collections.newList([1,2,3]);
    }

    @when(/^I call flatMapToFutureList/)
    public WhenICallFlatMapToFutureList(): void {
        this.futureGroupPromise = this.listOfInts.flatMapToFutureList(this.funcThatReturnsAsync);
    }

    @then(/^I get a promise that behaves as expected$/)
    public ThenPromiseBehaves():PromisedAssertion {
        return this.futureGroupPromise.then(
            r => $.expect(r.toArray()).to.eql([
                'string1-a','string1-b',
                'string2-a', 'string2-b',
                'string3-a', 'string3-b'
            ])
        );
    }
}

module.exports = ListSteps;
