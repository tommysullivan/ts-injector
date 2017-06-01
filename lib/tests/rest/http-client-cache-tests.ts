import '../support/prepare-test-environment';
import {expect} from 'chai';
import {Let} from "mocha-let-ts";
import {HTTPClientCache} from "../../private-devops-ts-primitives/rest/common/http-client-cache";
import {IRestResponse} from "../../private-devops-ts-primitives/rest/common/i-rest-response";
import {IRestRequestOptions} from "../../private-devops-ts-primitives/rest/common/i-rest-request-options";
import {IDictionary} from "../../private-devops-ts-primitives/collections/i-dictionary";
import {PrimitivesForNodeJS} from "../../private-devops-ts-primitives/api/nodejs/primitives-for-node-js";
import {mock} from "mocha-let-ts/dist/mocha-let-ts/mock";

describe('rest', () => {
    describe('common', () => {
        describe('HTTPClientCache', () => {
            const fakeEtag = 'f2938h29ueif9vy9238yh';
            const urlForCacheHitCondition = 'http://urlForCacheHitCondition';
            const urlForCacheMissCondition = 'http://urlForCacheMissCondition';
            const fakeHeaderName = 'fakeHeader';
            const fakeHeaderValue = 'fakeHeaderValue';
            const primitives = Let(()=>new PrimitivesForNodeJS());
            const subject = Let(() => primitives().rest.newHTTPClientCache());
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
                    originalUrl: urlToCheck(),
                    headers: headers()
                }));
                const addResponseIfApplicable = () => subject().addResponseIfApplicable(response());

                context(`without an ETAG header`, () => {
                    beforeEach(addResponseIfApplicable);
                    headers(() => primitives().collections.newEmptyDictionary<string>());

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
                    headers(() => primitives().collections.newDictionary({ etag: fakeEtag}));

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