const Ticket = require('../../schema/schemaTicket.js');
const User = require('../../schema/schemaUser.js');
function create(req, res) {
	if (!req.body.title || !req.body.description  || !req.body.priority) {
		res.status(400).json({
			"text": "Invalid Request"
		})
	} else {
		var ticket = {
			title: req.body.title,
			description: req.body.description,
			responsible: req.body.responsible,
			priority: req.body.priority, 
			user: req.user.email
		}
		if (req.body.responsible === ""){
			delete ticket.responsible;
		}

		var _t = new Ticket(ticket);
		_t.save(function (err, ticket) {
			if (err) {
				res.status(500).json({
					"text": "Internal Error"
				})
			} else {
				res.redirect(`${ticket.getId()}`);
			}
		})
	}
}

 async function createForm(req, res) {
	var userEmail = req.user.email;

	const user = await User.findOne({email:userEmail});
	const users = await User.find();	
	res.status(200).render('ticket/create', {title: 'Create ticket',role:user.role,users:users});
}

function show(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Invalid Request"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {

				

				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(async function (ticket) {
			var userEmail = req.user.email;

			const user = await User.findOne({email:userEmail});
			const users = await User.find();
			res.status(200).render('ticket/show', {title:`Ticket no:${ticket._id}`, ticket,role:user.role,users:users});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal Error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal Error"
					})
			}
		})
	}
}

 function edit(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Invalid Request"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then( async function (ticket) {
			var userEmail = req.user.email;

			const user = await User.findOne({email:userEmail});
			const users = await User.find();
			res.status(200).render('ticket/edit', {title:`Modify ticket no:${ticket._id}`, ticket,role:user.role,users:users});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal Error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal Error"
					})
			}
		})
	}
}

function update(req, res) {
	
	if (!req.params.id || !req.body.description || !req.body.title || !req.body.priority) {
		res.status(400).json({
			"text": "Invalid Request"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			req.body.completed = typeof req.body.completed !== 'undefined' ? true : false;

			Ticket.findByIdAndUpdate({"_id":req.params.id},{"title":req.body.title,"description":req.body.description,
			"priority":req.body.priority,"completed":req.body.completed,"responsible":req.body.responsible}
			,{new: true}, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.redirect(`../${ticket.getId()}`);
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal Error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal Error"
					})
			}
		})
	}
}

function list(req, res) {
	var findTicket = new Promise(function (resolve, reject) {
		Ticket.find({}, function (err, tickets) {
			if (err) {
				reject(500);
			} else {
				if (tickets) {
					resolve(tickets)
				} else {
					reject(200)
				}
			}
		})
	})

	findTicket.then(function (tickets) {
		res.status(200).render('ticket/index', {title:'Ticket List', tickets});
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Internal Error"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "There is no ticket yet"
				})
				break;
			default:
				res.status(500).json({
					"text": "Internal Error"
				})
		}
	})
}
 exports.newComment = async (req, res) => {
	
    var ticket_id = req.body._id;
    
    
    var comment = req.body.comment;
    
    var new_comment = {"user":req.user.email,"comment":comment};
  
    
    await Ticket.findOneAndUpdate({"_id":ticket_id},{$push:{"comments" : new_comment}})
    .exec()
		.then(() => {
		res.send("Updated")
	})
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err });
    });
 }
  function filter(req,res){

	var searchFilter = null;

	if (req.body.isAssigned === "true"){
		searchFilter = {$ne:null};
	}
	
	Ticket.find({"responsible" : searchFilter})
	.exec()
	.then(ticket => {
	if (ticket) {
		res.send(ticket);
	} else {
		res.status(404).json({ "text": "No tickets yet" });
	}
	})
	.catch(err => {
	
	res.status(500).json({ "text" : "Internal error"});
	});



}

exports.create = create;
exports.createForm = createForm;
exports.show = show;
exports.edit = edit;
exports.update = update;
exports.list = list;
exports.filter = filter;