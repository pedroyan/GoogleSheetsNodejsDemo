const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const credentials = require('./client_secret.json');

function printStudent(student) {
	console.log(`Name: ${student.studentname}`);
	console.log(`Major: ${student.major}`);
	console.log(`Gender: ${student.gender}`);
	console.log(`Home State: ${student.homestate}`);
	console.log('-----------------------------------');
}

async function accessSpreadsheet() {
	const doc = new GoogleSpreadsheet(
		'1pL3NW3A8a0HzZCNpxFBbwJBMvI5sWz6brkqPsMB6yCQ'
	);
	await promisify(doc.useServiceAccountAuth)(credentials);
	const info = await promisify(doc.getInfo)();

	const sheet = info.worksheets[0];
	const rows = await promisify(sheet.getRows)({
		offset: 1,
		limit: 10,
		orderby: 'homestate'
	});

	rows.forEach(s => printStudent(s));
}

accessSpreadsheet().catch(e => console.log(e));
