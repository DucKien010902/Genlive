// import New from './newRoute';

const Customer = require('./customerRoute');
const Jobs = require('./JobsRoute');
const JobDetail = require('./JobDetailRoute');
function route(app) {
  app.use('/customer', Customer);
  app.use('/jobs', Jobs);
  app.use('/jobdetail', JobDetail);
}
module.exports = route;
