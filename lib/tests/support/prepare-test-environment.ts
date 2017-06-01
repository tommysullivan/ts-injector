import 'mocha';
import * as sinonChai from "sinon-chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sourceMapSupport from "source-map-support";
import * as chai from 'chai';

sourceMapSupport.install();

chai.use(sinonChai);
chai.use(chaiAsPromised);

chai.config.includeStack = true;
chai.config.showDiff = true;