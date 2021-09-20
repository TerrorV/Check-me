//eslint-disable-next-line import/no-webpack-loader-syntax
import createWorker from 'workerize-loader!./SampleWorker.worker';

import * as SampleWorker from './SampleWorker.worker';
 
const sampleWorker =  createWorker<typeof SampleWorker>();

export const initSampleWorker = () => sampleWorker;