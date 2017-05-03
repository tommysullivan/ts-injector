declare const require:any;
require('source-map-support').install();

import 'mocha';
import * as chai from 'chai';

chai.config.includeStack = true;
chai.config.showDiff = true;