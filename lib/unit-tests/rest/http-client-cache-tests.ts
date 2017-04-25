import './prepare-test-environment';
import {expect} from 'chai';
import {Let} from "mocha-let-ts";
import {HTTPClientCache} from "../../rest/common/http-client-cache";
import {frameworkForNodeJSInstance} from "../../framework/nodejs/framework-for-node-js-instance";
import {IRestResponse} from "../../rest/common/i-rest-response";
import {mock} from "./mock";
import {IRestRequestOptions} from "../../rest/common/i-rest-request-options";
import {IDictionary} from "../../collections/i-dictionary";

describe('rest', () => {
    describe('common', () => {
        describe('HTTPClientCache', () => {
            const fakeEtag = 'f2938h29ueif9vy9238yh';
            const urlForCacheHitCondition = 'http://urlForCacheHitCondition';
            const urlForCacheMissCondition = 'http://urlForCacheMissCondition';
            const fakeHeaderName = 'fakeHeader';
            const fakeHeaderValue = 'fakeHeaderValue';

            const subject = Let(() => frameworkForNodeJSInstance.rest.newHTTPClientCache());
            const urlToCheck = Let<string>();
            const requestOptions = Let<IRestRequestOptions>(() => mock<IRestRequestOptions>({
                headers: {
                    [fakeHeaderName]: fakeHeaderValue
                }
            }));
            const modifiedRequestOptions = Let(() => subject().addCacheHeadersIfApplicable(urlToCheck(), requestOptions()));

            describe('new HTTPClientCache()', () => {
                it('can be constructed', () => expect(subject()).to.exist);
            });

            context(`when a response comes in for ${urlForCacheHitCondition}`, () => {
                urlToCheck(()=>urlForCacheHitCondition);
                const headers = Let<IDictionary<string>>();
                const response = Let<IRestResponse>(() => mock<IRestResponse>({
                    originalUrl: urlForCacheHitCondition,
                    headers: headers()
                }));
                const addResponseIfApplicable = () => subject().addResponseIfApplicable(response());

                context(`without an ETAG header`, () => {
                    beforeEach(addResponseIfApplicable);
                    headers(() => frameworkForNodeJSInstance.collections.newEmptyDictionary<string>());

                    describe(`#containsCachedResponseFor(${urlForCacheHitCondition})`, () => {
                        it('returns false', () => expect(subject().containsCachedResponseFor(urlForCacheHitCondition)).to.be.false)
                    });

                    describe('#addCacheHeadersIfApplicable(requestOptions)', () => {
                        it('does not add If-None-Match header to outgoing request', () => {
                            expect(modifiedRequestOptions().headers).not.to.have.property('If-None-Match');
                        });

                        it('does not erase or overwrite existing headers', () => {
                            expect(modifiedRequestOptions().headers).to.have.property(fakeHeaderName, fakeHeaderValue);
                        });
                    });

                });

                context(`with an ETAG header having value ${fakeEtag}}`, () => {
                    beforeEach(addResponseIfApplicable);
                    headers(() => frameworkForNodeJSInstance.collections.newDictionary({ etag: fakeEtag}));

                    describe(`#containsCachedResponseFor(${urlForCacheHitCondition})`, () => {
                        it('returns true', () => expect(subject().containsCachedResponseFor(urlForCacheHitCondition)).to.be.true)
                    });

                    describe('#addCacheHeadersIfApplicable(requestOptions)', () => {
                        context('and the sought url is different than the cached url', () => {
                            urlToCheck(() => urlForCacheMissCondition);

                            it('does not add If-None-Match header to outgoing request', () => {
                                expect(modifiedRequestOptions().headers).not.to.have.property('If-None-Match');
                            });

                            it('does not erase or overwrite existing headers', () => {
                                expect(modifiedRequestOptions().headers).to.have.property(fakeHeaderName, fakeHeaderValue);
                            });
                        });

                        context('and the sought url is the same as the cached url', () => {
                            urlToCheck(() => urlForCacheHitCondition);

                            it('adds If-None-Match header containing etag', () => {
                                expect(modifiedRequestOptions().headers).to.have.property('If-None-Match', fakeEtag);
                            });

                            it('does not erase or overwrite existing headers', () => {
                                expect(modifiedRequestOptions().headers).to.have.property(fakeHeaderName, fakeHeaderValue);
                            });
                        });
                    });
                });
            });
        });
    });
});