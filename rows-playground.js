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

let info = null;
let sheet = null;

const doc = new GoogleSpreadsheet(
	'1pL3NW3A8a0HzZCNpxFBbwJBMvI5sWz6brkqPsMB6yCQ'
);

async function initSheet() {
	await promisify(doc.useServiceAccountAuth)(credentials);
	info = await promisify(doc.getInfo)();
	sheet = info.worksheets[0];
}

async function printRows() {
	const rows = await promisify(sheet.getRows)({
		offset: 1
		//limit: 10,
		//orderby: 'homestate'
	});

	rows.forEach(s => printStudent(s));
}

async function queryAndUpdateRows() {
	const rows = await promisify(sheet.getRows)({
		query: 'homestate = NY'
	});

	rows.forEach(s => {
		s.homestate = 'DF';
		s.save();
	});
}

async function addRow() {
	const row = {
		studentName: 'Pedro',
		major: 'Computer Engineering',
		classlevel: '6. Godlike',
		homestate: 'PA',
		extracurricularactivity: 'Business'
	};

	await promisify(sheet.addRow)(row);
}

async function deleteStudent(name) {
	const rows = await promisify(sheet.getRows)({
		query: `studentname = ${name}`
	});

	rows[0].del();
}

async function main() {
	await initSheet();
	await deleteStudent('Pedro');
	await printRows();
}

main().catch(e => console.log(e));
