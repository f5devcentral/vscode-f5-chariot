import * as path from 'path';
import * as fs from 'fs';
import Mocha from 'mocha';
import { glob } from 'glob';

// Log file path - writes to project root
const logFile = path.resolve(__dirname, '..', '..', '..', 'test-debug.log');

export function log(message: string, data?: unknown): void {
	const timestamp = new Date().toISOString();
	let line = `[${timestamp}] ${message}`;
	if (data !== undefined) {
		line += ` ${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`;
	}
	line += '\n';
	fs.appendFileSync(logFile, line);
	console.log(message, data ?? '');
}

export async function run(): Promise<void> {
	// Clear log file at start
	fs.writeFileSync(logFile, `=== TEST RUN STARTED ${new Date().toISOString()} ===\n`);

	log('=== TEST RUNNER STARTING ===');
	log('Current directory:', __dirname);
	log('Log file:', logFile);

	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		timeout: 60000,
	});
	// mocha.useColors(true);

	const testsRoot = path.resolve(__dirname, '..');
	log('Tests root:', testsRoot);

	try {
		const files = await glob('**/**.tests.js', { cwd: testsRoot });
		log('Found test files:', files);

		// Add files to the test suite
		files.forEach((f: string) => {
			const fullPath = path.resolve(testsRoot, f);
			log('Adding test file:', fullPath);
			mocha.addFile(fullPath);
		});

		// Run the mocha test
		log('=== RUNNING MOCHA TESTS ===');
		return new Promise((c, e) => {
			mocha.run(failures => {
				log('=== MOCHA FINISHED ===');
				log('Failures:', failures);
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		});
	} catch (err) {
		log('=== TEST RUNNER ERROR ===');
		log('Error:', err instanceof Error ? err.message : String(err));
		throw err;
	}
}
