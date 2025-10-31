// import New from './newRoute';

const Customer = require('./customerRoute');
const Jobs = require('./JobsRoute');
const JobDetail = require('./JobDetailRoute');
const Talents = require('./TalentsRoute');
const Article = require('./articleRoute');
function route(app) {
  app.use('/customer', Customer);
  app.use('/jobs', Jobs);
  app.use('/jobdetail', JobDetail);
  app.use('/talents', Talents);
  app.use('/article', Article);
}
module.exports = route;
