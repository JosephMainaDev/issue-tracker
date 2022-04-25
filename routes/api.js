'use strict';

const { issue_get, issue_create, issue_update, issue_delete } = require('../controllers/controllers.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(issue_get)
    
    .post(issue_create)
    
    .put(issue_update)
    
    .delete(issue_delete);
    
};

/*
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
*/