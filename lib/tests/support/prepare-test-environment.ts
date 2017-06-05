import 'mocha';
import * as sinonChai from "sinon-chai";
import * as sourceMapSupport from "source-map-support";
import * as chai from 'chai';

sourceMapSupport.install();

chai.use(sinonChai);

chai.config.includeStack = true;
chai.config.showDiff = true;