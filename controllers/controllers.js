const Issue = require('../models/models.js');

exports.issue_get = async function(req, res) {
  // api/issues/apitest/?created_by=admin&assigned_to=admin...
  let project = req.params.project;
  let query = req.query;
  query.project = project;
  let issues = await Issue.find(query).exec();
  res.json(issues);
};

exports.issue_create = async function(req, res) {
  // api/issues/:project
  let project = req.params.project; // part of url
  let issue_title = req.body.issue_title;
  let issue_text =req.body.issue_text;
  let created_by = req.body.created_by;
  let assigned_to = req.body.assigned_to || '';
  let status_text = req.body.status_text || '';

  // If required fields are missing, respond with error message
  if (!issue_title || !issue_text || !created_by) {
    return res.json({ error: 'required field(s) missing' });
  }

  const issue = new Issue({
    project,
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text
  });

  const doc = await issue.save().catch(err => console.error(err));
  return res.json(doc);
};

exports.issue_update = async function(req, res) {
  let { _id, ...fields } = req.body;
  if (!_id) {
    return res.json({ error: 'missing _id' });
  }
  if (!Object.keys(fields).length) {
    // missing update fields
    return res.json({ error: 'no update field(s) sent', '_id': _id });
  }
  let issue = await Issue.findOneAndUpdate(
    { _id: _id },
    { ...fields, updated_on: new Date() }
  );
  if (!issue) {
    // invalid _id
    return res.json({ error: 'could not update', '_id': _id });
  }
  return res.json({ result: 'successfully updated', '_id': _id });
};

exports.issue_delete = async function(req, res) {
  // let project = req.params.project;
  let _id = req.body._id;
  if (!_id) {
    return res.json({ error: 'missing _id' });
  }
  let issue = await Issue.findByIdAndDelete(_id);
  if (issue) {
    return res.json({ result: 'successfully deleted', '_id': _id });
  } else {
    res.json({ error: 'could not delete', '_id': _id });
  }
};

/*
fields = {
  project, 
  issue_title, 
  issue_text, 
  created_by, 
  assigned_to, 
  status_text, 
  created_on, 
  updated_on, 
  open
}
*/