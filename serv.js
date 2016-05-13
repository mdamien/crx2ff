var path = require('path');
var express = require('express');
var app = express();

var extensionChecker = require('./libs/ext-checker');
var extensionConverter = require('./libs/ext-converter');
var cliReporter = require('./libs/reporters/cli-reporter');

var router = express.Router();router.get('/', function(req, res) {
	var id = req.query.id;
	var check = req.query.check !== undefined;
	if (!id) {
		res.sendFile(path.join(__dirname, 'index.html'));
		return;
	}
	if (check) {
		extensionChecker(id, null, function (error, report) {
	        if (error) {
	            return console.error(error);
	        }
	        res.send('<pre>'+cliReporter(report)+'</pre>');
	    });
	} else {
	    var opts = {
	        excludeGlob: null,
	    };

		var filename = id+".xpi";
		extensionConverter(id, opts, function (error, output) {
	        if (error) {
	            return console.error(error);
	        }
			res.set({
			    "Content-Disposition": 'attachment; filename="'+filename+'"',
			    // "Content-Type": "application/x-xpinstall",
			});
	        res.send(output);
	    });
	}
});

app.use('/', router);

var port = process.env.PORT || 8080;
app.listen(port);
console.log('\\o/ Server is in da place: ' + port);