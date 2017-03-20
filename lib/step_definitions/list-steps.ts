import {IList} from "../collections/i-list";
import {IRepository} from "../packaging/i-repository";
import {IFuture} from "../futures/i-future";
import {ICucumberStepHelper} from "../clusters/i-cucumber-step-helper";

declare var module:any;
declare const $:ICucumberStepHelper;

module.exports = function() {
    let originalItems:IList<Object>;
    let uniqueItems:IList<Object>;

    this.Before(function () {
        originalItems = undefined;
        uniqueItems = undefined;
    });

    function newRepo(url:string):IRepository {
        return $.packaging.newRepository(
            {
                releases: [],
                packages: [],
                url: url
            },
            null
        );
    }

    this.Given(/^I have a list of repositories where two or more have the same URL$/, () => {
        originalItems = $.collections.newList<Object>([
            newRepo('urlA'),
            newRepo('urlB'),
            newRepo('urlC'),
            newRepo('urlB'),
            newRepo('urlA'),
        ]);
    });

    this.When(/^I ask for the unique items/, () => {
        uniqueItems = originalItems.unique;
    });

    this.Then(/^it gives the unique repositories/, () => {
        $.expect(uniqueItems.map(r => (<IRepository>r).url).toArray()).to.eql(['urlA','urlB','urlC']);
    });

    this.Given(/^I have a list of items where two or more are the same$/, () => {
        originalItems = $.collections.newList<Object>([1,2,3,4,5,4,2]);
    });

    this.Then(/^it gives the unique numbers/, () => {
        $.expect(uniqueItems.toArray()).to.eql([1,2,3,4,5]);
    });

    let listOfInts:IList<number>;
    let  futureGroupPromise:IFuture<IList<string>>;

    function funcThatReturnsAsync(i:number):IFuture<IList<string>> {
        const retVal = $.collections.newList([`string${i}-a`, `string${i}-b`]);
        return $.futures.newFutureForImmediateValue(retVal);
    }

    this.Given(/^I have a list of integers and an async map function$/, () => {
        listOfInts = $.collections.newList([1,2,3]);
    });

    this.When(/^I call flatMapToFutureList/, () => {
        futureGroupPromise = listOfInts.flatMapToFutureList(funcThatReturnsAsync);
    });

    this.Then(/^I get a promise that behaves as expected$/, () => {
        return futureGroupPromise.then(
            r => $.expect(r.toArray()).to.eql([
                'string1-a','string1-b',
                'string2-a', 'string2-b',
                'string3-a', 'string3-b'
            ])
        );
    });
};

