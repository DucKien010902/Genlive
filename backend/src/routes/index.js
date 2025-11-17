// import New from './newRoute';

const Customer = require('./customerRoute');
const Jobs = require('./JobsRoute');
const JobDetail = require('./JobDetailRoute');
const Talents = require('./TalentsRoute');
const Article = require('./articleRoute');
const TalentGroups = require('./talentGroupRoute');
function route(app) {
  app.use('/customer', Customer);
  app.use('/jobs', Jobs);
  app.use('/jobdetail', JobDetail);
  app.use('/talents', Talents);
  app.use('/article', Article);
  app.use('/talentGroup', TalentGroups);
}
module.exports = route;
