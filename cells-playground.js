const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const credentials = require('./client_secret.json');

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

async function main() {
	await initSheet();

	//Get the first 2 columns of the first 3 rows
	const cells = await promisify(sheet.getCells)({
		'min-row': 1,
		'max-row': 3,
		'min-col': 1,
		'max-col': 2
	});

	//Print contents
	for (const cell of cells) {
		console.log(`${cell.row}, ${cell.col}: ${cell.value}`);
		console.log(cell);
	}

	//Modify cell
	cells[2].formula = '=GOOGLEFINANCE("PETR4")'; //Set formula
	//cells[2].value = '12.21'; //Set absolute value
	cells[2].save();
}

main().catch(e => console.log(e));
