// A small educational Java interpreter for the ICS3UR playground.
//
// It does NOT compile or run real Java. It understands a safe subset:
//   - variables: int, long, short, byte, double, float, boolean, char, String
//   - System.out.print(...) and System.out.println(...)
//   - arithmetic and text expressions using + - * / % ( ) and comparisons
//   - if / else
//   - for, while and do-while loops (with break and continue)
//   - switch statements (classic "case x:" style, with break and default)
//   - Scanner input: new Scanner(System.in) with next / nextLine / nextInt /
//     nextDouble / nextBoolean / hasNext... using the provided input text
//
// It reads the code, builds a small syntax tree, and walks it. There is no
// eval() and no arbitrary code execution. Anything it does not understand
// produces a friendly message instead of silently guessing.

export interface JavaRunResult {
	output: string;
	error: string | null;
}

/** An error with a friendly message (and a line number when we know it). */
class JavaError extends Error {
	constructor(message: string, line?: number) {
		super(line === undefined ? message : `Line ${line}: ${message}`);
	}
}

// ---------------------------------------------------------------------------
// Values and syntax tree
// ---------------------------------------------------------------------------

type Value =
	| { kind: 'int'; num: number }
	| { kind: 'double'; num: number }
	| { kind: 'string'; text: string }
	| { kind: 'char'; text: string }
	| { kind: 'boolean'; value: boolean }
	| { kind: 'scanner' };

type Expr =
	| { type: 'literal'; value: Value; line: number }
	| { type: 'variable'; name: string; line: number }
	| { type: 'unary'; op: string; operand: Expr; line: number }
	| { type: 'binary'; op: string; left: Expr; right: Expr; line: number }
	| { type: 'assign'; name: string; op: string; value: Expr; line: number }
	| { type: 'update'; op: string; prefix: boolean; name: string; line: number }
	| { type: 'newScanner'; line: number }
	| { type: 'call'; object: Expr; method: string; args: Expr[]; line: number };

type Stmt =
	| { type: 'empty' }
	| { type: 'block'; statements: Stmt[] }
	| {
			type: 'varDecl';
			varType: string;
			declarations: { name: string; init: Expr | null }[];
			line: number;
	  }
	| { type: 'exprStmt'; expression: Expr }
	| { type: 'print'; newline: boolean; argument: Expr | null; line: number }
	| { type: 'if'; condition: Expr; thenBranch: Stmt; elseBranch: Stmt | null; line: number }
	| { type: 'while'; condition: Expr; body: Stmt; line: number }
	| { type: 'doWhile'; body: Stmt; condition: Expr; line: number }
	| {
			type: 'for';
			init: Stmt | null;
			condition: Expr | null;
			update: Expr[];
			body: Stmt;
			line: number;
	  }
	| { type: 'break'; line: number }
	| { type: 'continue'; line: number }
	| { type: 'switch'; subject: Expr; cases: SwitchCase[]; line: number };

interface SwitchCase {
	isDefault: boolean;
	tests: Expr[];
	statements: Stmt[];
}

type Control = 'normal' | 'break' | 'continue';

const TYPE_NAMES = new Set([
	'int',
	'long',
	'short',
	'byte',
	'double',
	'float',
	'boolean',
	'char',
	'String',
	'Scanner'
]);

const MODIFIERS = new Set([
	'public',
	'private',
	'protected',
	'static',
	'final',
	'abstract',
	'synchronized',
	'native',
	'transient',
	'volatile'
]);

// ---------------------------------------------------------------------------
// Lexer: turn source text into tokens
// ---------------------------------------------------------------------------

interface Token {
	type: 'number' | 'string' | 'char' | 'ident' | 'op' | 'eof';
	text: string;
	line: number;
	num?: number;
	isInt?: boolean;
}

const TWO_CHAR_OPS = [
	'==',
	'!=',
	'<=',
	'>=',
	'&&',
	'||',
	'++',
	'--',
	'+=',
	'-=',
	'*=',
	'/=',
	'%=',
	'->'
];
const ONE_CHAR_OPS = '+-*/%=<>!(){};,.[]:';

function isSpace(char: string): boolean {
	return char === ' ' || char === '\t' || char === '\n' || char === '\r';
}

function isDigit(char: string): boolean {
	return char >= '0' && char <= '9';
}

function isIdentStart(char: string): boolean {
	return /[A-Za-z_$]/.test(char);
}

function isIdentPart(char: string): boolean {
	return /[A-Za-z0-9_$]/.test(char);
}

function readEscape(source: string, index: number): { text: string; next: number } {
	const char = source[index];
	if (char === 'n') return { text: '\n', next: index + 1 };
	if (char === 't') return { text: '\t', next: index + 1 };
	if (char === 'r') return { text: '\r', next: index + 1 };
	if (char === '"') return { text: '"', next: index + 1 };
	if (char === "'") return { text: "'", next: index + 1 };
	if (char === '\\') return { text: '\\', next: index + 1 };
	if (char === '0') return { text: '\0', next: index + 1 };
	return { text: char ?? '', next: index + 1 };
}

function lex(source: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;
	let line = 1;

	while (i < source.length) {
		const char = source[i];

		if (char === '\n') {
			line++;
			i++;
			continue;
		}
		if (isSpace(char)) {
			i++;
			continue;
		}

		if (char === '/' && source[i + 1] === '/') {
			while (i < source.length && source[i] !== '\n') i++;
			continue;
		}
		if (char === '/' && source[i + 1] === '*') {
			i += 2;
			while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
				if (source[i] === '\n') line++;
				i++;
			}
			i += 2;
			continue;
		}

		if (char === '"') {
			let text = '';
			let closed = false;
			i++;
			while (i < source.length) {
				if (source[i] === '\\') {
					const escape = readEscape(source, i + 1);
					text += escape.text;
					i = escape.next;
					continue;
				}
				if (source[i] === '"') {
					closed = true;
					i++;
					break;
				}
				text += source[i];
				i++;
			}
			if (!closed) throw new JavaError('A string is missing its closing quotation mark.', line);
			tokens.push({ type: 'string', text, line });
			continue;
		}

		if (char === "'") {
			let text = '';
			let closed = false;
			i++;
			while (i < source.length) {
				if (source[i] === '\\') {
					const escape = readEscape(source, i + 1);
					text += escape.text;
					i = escape.next;
					continue;
				}
				if (source[i] === "'") {
					closed = true;
					i++;
					break;
				}
				text += source[i];
				i++;
			}
			if (!closed) throw new JavaError('A char is missing its closing quote.', line);
			if (text.length !== 1) {
				throw new JavaError("A char must hold exactly one character, like 'a'.", line);
			}
			tokens.push({ type: 'char', text, line });
			continue;
		}

		if (isDigit(char) || (char === '.' && isDigit(source[i + 1] ?? ''))) {
			let text = '';
			while (i < source.length && (isDigit(source[i]) || source[i] === '.')) {
				text += source[i];
				i++;
			}
			if ((text.match(/\./g) ?? []).length > 1) {
				throw new JavaError(`"${text}" is not a valid number.`, line);
			}
			tokens.push({ type: 'number', text, num: Number(text), isInt: !text.includes('.'), line });
			continue;
		}

		if (isIdentStart(char)) {
			let text = '';
			while (i < source.length && isIdentPart(source[i])) {
				text += source[i];
				i++;
			}
			tokens.push({ type: 'ident', text, line });
			continue;
		}

		const two = source.slice(i, i + 2);
		if (TWO_CHAR_OPS.includes(two)) {
			tokens.push({ type: 'op', text: two, line });
			i += 2;
			continue;
		}

		if (ONE_CHAR_OPS.includes(char)) {
			tokens.push({ type: 'op', text: char, line });
			i++;
			continue;
		}

		throw new JavaError(`Unexpected character "${char}".`, line);
	}

	tokens.push({ type: 'eof', text: '', line });
	return tokens;
}

// ---------------------------------------------------------------------------
// Parser: turn tokens into a syntax tree
// ---------------------------------------------------------------------------

class Parser {
	private tokens: Token[];
	private i = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	// -- helpers ------------------------------------------------------------

	private peek(offset = 0): Token {
		return this.tokens[this.i + offset] ?? this.tokens[this.tokens.length - 1];
	}

	private next(): Token {
		const token = this.tokens[this.i];
		if (token.type !== 'eof') this.i++;
		return token;
	}

	private atEnd(): boolean {
		return this.peek().type === 'eof';
	}

	private checkOp(text: string): boolean {
		const token = this.peek();
		return token.type === 'op' && token.text === text;
	}

	private matchOp(text: string): boolean {
		if (this.checkOp(text)) {
			this.i++;
			return true;
		}
		return false;
	}

	private expectOp(text: string): void {
		if (!this.matchOp(text)) {
			throw new JavaError(
				`Expected "${text}" but found "${this.describe(this.peek())}".`,
				this.peek().line
			);
		}
	}

	private checkIdent(text: string): boolean {
		const token = this.peek();
		return token.type === 'ident' && token.text === text;
	}

	private expectIdent(): Token {
		const token = this.peek();
		if (token.type !== 'ident') {
			throw new JavaError(`Expected a name but found "${this.describe(token)}".`, token.line);
		}
		return this.next();
	}

	private describe(token: Token): string {
		return token.type === 'eof' ? 'end of code' : token.text;
	}

	private optionalSemicolon(): void {
		this.matchOp(';');
	}

	private skipModifiers(): void {
		while (this.peek().type === 'ident' && MODIFIERS.has(this.peek().text)) this.i++;
	}

	private skipParens(): void {
		this.expectOp('(');
		let depth = 1;
		while (depth > 0 && !this.atEnd()) {
			if (this.checkOp('(')) depth++;
			else if (this.checkOp(')')) depth--;
			this.i++;
		}
	}

	private skipBlock(): void {
		this.expectOp('{');
		let depth = 1;
		while (depth > 0 && !this.atEnd()) {
			if (this.checkOp('{')) depth++;
			else if (this.checkOp('}')) depth--;
			this.i++;
		}
	}

	// -- program ------------------------------------------------------------

	parseProgram(): Stmt[] {
		this.skipImports();
		if (this.isClassProgram()) {
			return this.parseClass();
		}
		return this.parseStatements();
	}

	private skipImports(): void {
		while (this.checkIdent('import') || this.checkIdent('package')) {
			while (!this.atEnd() && !this.checkOp(';')) this.i++;
			this.matchOp(';');
		}
	}

	private isClassProgram(): boolean {
		let i = this.i;
		while (
			i < this.tokens.length &&
			this.tokens[i].type === 'ident' &&
			MODIFIERS.has(this.tokens[i].text)
		) {
			i++;
		}
		return this.tokens[i]?.text === 'class';
	}

	private parseClass(): Stmt[] {
		this.skipModifiers();
		if (!this.checkIdent('class')) {
			throw new JavaError(
				`Expected "class" but found "${this.describe(this.peek())}".`,
				this.peek().line
			);
		}
		this.next();
		this.expectIdent();
		this.expectOp('{');

		let main: Stmt[] | null = null;
		while (!this.checkOp('}') && !this.atEnd()) {
			const body = this.parseClassMember();
			if (body) main = body;
		}

		this.expectOp('}');
		return main ?? [];
	}

	private parseClassMember(): Stmt[] | null {
		this.skipModifiers();
		if (this.matchOp(';')) return null;

		// constructor: Name ( ... ) { ... }
		if (this.peek().type === 'ident' && this.peek(1).text === '(') {
			this.next();
			this.skipParens();
			this.parseBlock();
			return null;
		}

		// return type (possibly an array)
		this.expectIdent();
		while (this.checkOp('[')) {
			this.next();
			this.expectOp(']');
		}

		const name = this.expectIdent();

		if (this.checkOp('(')) {
			this.skipParens();
			if (name.text === 'main') {
				return this.parseBlock().statements;
			}
			// Other methods are not run, so skip their body without parsing it.
			this.skipBlock();
			return null;
		}

		// field: skip to the end of the declaration
		while (!this.atEnd() && !this.checkOp(';') && !this.checkOp('}')) this.i++;
		this.matchOp(';');
		return null;
	}

	// -- statements ---------------------------------------------------------

	private parseBlock(): { type: 'block'; statements: Stmt[] } {
		this.expectOp('{');
		const statements = this.parseStatements();
		this.expectOp('}');
		return { type: 'block', statements };
	}

	private parseStatements(): Stmt[] {
		const statements: Stmt[] = [];
		while (!this.checkOp('}') && !this.atEnd()) {
			statements.push(this.parseStatement());
		}
		return statements;
	}

	private parseStatement(): Stmt {
		const line = this.peek().line;

		if (this.checkOp('{')) return this.parseBlock();
		if (this.matchOp(';')) return { type: 'empty' };
		if (this.isPrintStart()) return this.parsePrint();

		if (this.isTypeStart()) return this.parseVarDecl(true);

		if (this.checkIdent('final') && TYPE_NAMES.has(this.peek(1).text)) {
			this.next();
			return this.parseVarDecl(true);
		}

		const word = this.peek().text;
		if (this.peek().type === 'ident') {
			if (word === 'for') return this.parseFor();
			if (word === 'while') return this.parseWhile();
			if (word === 'do') return this.parseDoWhile();
			if (word === 'if') return this.parseIf();
			if (word === 'switch') return this.parseSwitch();
			if (word === 'break') {
				this.next();
				this.optionalSemicolon();
				return { type: 'break', line };
			}
			if (word === 'continue') {
				this.next();
				this.optionalSemicolon();
				return { type: 'continue', line };
			}
		}

		const expression = this.parseExpression();
		this.optionalSemicolon();
		return { type: 'exprStmt', expression };
	}

	private isTypeStart(): boolean {
		const token = this.peek();
		return token.type === 'ident' && TYPE_NAMES.has(token.text);
	}

	private isPrintStart(): boolean {
		return (
			this.peek(0).text === 'System' &&
			this.peek(1).text === '.' &&
			this.peek(2).text === 'out' &&
			this.peek(3).text === '.' &&
			(this.peek(4).text === 'print' || this.peek(4).text === 'println')
		);
	}

	private parsePrint(): Stmt {
		const line = this.peek().line;
		this.expectIdent(); // System
		this.expectOp('.');
		this.expectIdent(); // out
		this.expectOp('.');
		const method = this.expectIdent().text; // print / println
		this.expectOp('(');

		let argument: Expr | null = null;
		if (!this.checkOp(')')) argument = this.parseExpression();
		this.expectOp(')');
		this.optionalSemicolon();

		return { type: 'print', newline: method === 'println', argument, line };
	}

	private parseVarDecl(expectSemicolon: boolean): Stmt {
		const line = this.peek().line;
		const varType = this.next().text;
		if (this.checkOp('[')) {
			throw new JavaError('Arrays are not supported in this playground yet.', line);
		}

		const declarations: { name: string; init: Expr | null }[] = [];
		do {
			const name = this.expectIdent().text;
			let init: Expr | null = null;
			if (this.matchOp('=')) init = this.parseExpression();
			declarations.push({ name, init });
		} while (this.matchOp(','));

		if (expectSemicolon) this.expectOp(';');
		return { type: 'varDecl', varType, declarations, line };
	}

	private parseFor(): Stmt {
		const line = this.peek().line;
		this.next(); // for
		this.expectOp('(');

		let init: Stmt | null = null;
		if (!this.checkOp(';')) {
			if (this.isTypeStart()) init = this.parseVarDecl(false);
			else init = { type: 'exprStmt', expression: this.parseExpression() };
		}
		this.expectOp(';');

		let condition: Expr | null = null;
		if (!this.checkOp(';')) condition = this.parseExpression();
		this.expectOp(';');

		const update: Expr[] = [];
		if (!this.checkOp(')')) {
			do {
				update.push(this.parseExpression());
			} while (this.matchOp(','));
		}
		this.expectOp(')');

		const body = this.parseStatement();
		return { type: 'for', init, condition, update, body, line };
	}

	private parseWhile(): Stmt {
		const line = this.peek().line;
		this.next(); // while
		this.expectOp('(');
		const condition = this.parseExpression();
		this.expectOp(')');
		const body = this.parseStatement();
		return { type: 'while', condition, body, line };
	}

	private parseDoWhile(): Stmt {
		const line = this.peek().line;
		this.next(); // do
		const body = this.parseStatement();
		if (!this.checkIdent('while')) {
			throw new JavaError('A "do" loop must be followed by "while (condition);".', line);
		}
		this.next();
		this.expectOp('(');
		const condition = this.parseExpression();
		this.expectOp(')');
		this.optionalSemicolon();
		return { type: 'doWhile', body, condition, line };
	}

	private parseIf(): Stmt {
		const line = this.peek().line;
		this.next(); // if
		this.expectOp('(');
		const condition = this.parseExpression();
		this.expectOp(')');
		const thenBranch = this.parseStatement();
		let elseBranch: Stmt | null = null;
		if (this.checkIdent('else')) {
			this.next();
			elseBranch = this.parseStatement();
		}
		return { type: 'if', condition, thenBranch, elseBranch, line };
	}

	private parseSwitch(): Stmt {
		const line = this.peek().line;
		this.next(); // switch
		this.expectOp('(');
		const subject = this.parseExpression();
		this.expectOp(')');
		this.expectOp('{');

		const cases: SwitchCase[] = [];
		while (!this.checkOp('}') && !this.atEnd()) {
			if (this.checkIdent('case') || this.checkIdent('default')) {
				const isDefault = this.checkIdent('default');
				const labelLine = this.peek().line;
				this.next();

				const tests: Expr[] = [];
				if (!isDefault) tests.push(this.parseExpression());
				if (this.checkOp('->')) {
					throw new JavaError(
						'Use the classic switch style, like "case 1:" with "break;", not "->".',
						labelLine
					);
				}
				this.expectOp(':');

				// "case 1: case 2:" groups its labels onto the next set of statements.
				const previous = cases[cases.length - 1];
				if (previous && previous.statements.length === 0) {
					if (isDefault) previous.isDefault = true;
					previous.tests.push(...tests);
				} else {
					cases.push({ isDefault, tests, statements: [] });
				}
				continue;
			}

			const target = cases[cases.length - 1];
			if (!target) {
				throw new JavaError('A "switch" must start with a "case" or "default".', line);
			}
			target.statements.push(this.parseStatement());
		}

		this.expectOp('}');
		return { type: 'switch', subject, cases, line };
	}

	// -- expressions --------------------------------------------------------

	private parseExpression(): Expr {
		return this.parseAssignment();
	}

	private parseAssignment(): Expr {
		const left = this.parseOr();
		const token = this.peek();
		if (token.type === 'op' && ['=', '+=', '-=', '*=', '/=', '%='].includes(token.text)) {
			if (left.type !== 'variable') {
				throw new JavaError('Only a variable can be assigned a value with "=".', token.line);
			}
			this.next();
			const value = this.parseAssignment();
			return { type: 'assign', name: left.name, op: token.text, value, line: token.line };
		}
		return left;
	}

	private parseOr(): Expr {
		let left = this.parseAnd();
		while (this.checkOp('||')) {
			const token = this.next();
			left = { type: 'binary', op: '||', left, right: this.parseAnd(), line: token.line };
		}
		return left;
	}

	private parseAnd(): Expr {
		let left = this.parseEquality();
		while (this.checkOp('&&')) {
			const token = this.next();
			left = { type: 'binary', op: '&&', left, right: this.parseEquality(), line: token.line };
		}
		return left;
	}

	private parseEquality(): Expr {
		let left = this.parseRelational();
		for (;;) {
			if (this.checkOp('==') || this.checkOp('!=')) {
				const token = this.next();
				left = {
					type: 'binary',
					op: token.text,
					left,
					right: this.parseRelational(),
					line: token.line
				};
			} else {
				return left;
			}
		}
	}

	private parseRelational(): Expr {
		let left = this.parseAdditive();
		for (;;) {
			if (['<', '<=', '>', '>='].some((op) => this.checkOp(op))) {
				const token = this.next();
				left = {
					type: 'binary',
					op: token.text,
					left,
					right: this.parseAdditive(),
					line: token.line
				};
			} else {
				return left;
			}
		}
	}

	private parseAdditive(): Expr {
		let left = this.parseMultiplicative();
		for (;;) {
			if (this.checkOp('+') || this.checkOp('-')) {
				const token = this.next();
				left = {
					type: 'binary',
					op: token.text,
					left,
					right: this.parseMultiplicative(),
					line: token.line
				};
			} else {
				return left;
			}
		}
	}

	private parseMultiplicative(): Expr {
		let left = this.parseUnary();
		for (;;) {
			if (this.checkOp('*') || this.checkOp('/') || this.checkOp('%')) {
				const token = this.next();
				left = { type: 'binary', op: token.text, left, right: this.parseUnary(), line: token.line };
			} else {
				return left;
			}
		}
	}

	private parseUnary(): Expr {
		const token = this.peek();
		if (token.type === 'op' && (token.text === '!' || token.text === '-' || token.text === '+')) {
			this.next();
			return { type: 'unary', op: token.text, operand: this.parseUnary(), line: token.line };
		}
		if (token.type === 'op' && (token.text === '++' || token.text === '--')) {
			this.next();
			const operand = this.parseUnary();
			if (operand.type !== 'variable') {
				throw new JavaError('"++" and "--" only work on variables.', token.line);
			}
			return { type: 'update', op: token.text, prefix: true, name: operand.name, line: token.line };
		}
		return this.parsePostfix();
	}

	private parsePostfix(): Expr {
		let expr = this.parsePrimary();
		for (;;) {
			if (this.checkOp('.')) {
				this.next();
				const method = this.expectIdent();
				this.expectOp('(');
				const args: Expr[] = [];
				if (!this.checkOp(')')) {
					do {
						args.push(this.parseExpression());
					} while (this.matchOp(','));
				}
				this.expectOp(')');
				expr = { type: 'call', object: expr, method: method.text, args, line: method.line };
				continue;
			}
			if (this.checkOp('++') || this.checkOp('--')) {
				const token = this.peek();
				if (expr.type !== 'variable') {
					throw new JavaError('"++" and "--" only work on variables.', token.line);
				}
				this.next();
				expr = { type: 'update', op: token.text, prefix: false, name: expr.name, line: token.line };
				continue;
			}
			return expr;
		}
	}

	private parseNew(line: number): Expr {
		const typeName = this.expectIdent();
		if (typeName.text !== 'Scanner') {
			throw new JavaError(`"new ${typeName.text}(...)" is not supported in this playground.`, line);
		}
		this.expectOp('(');
		if (!(this.peek().type === 'ident' && this.peek().text === 'System')) {
			throw new JavaError('Only "new Scanner(System.in)" is supported.', line);
		}
		this.next(); // System
		this.expectOp('.');
		const stream = this.expectIdent();
		if (stream.text !== 'in') {
			throw new JavaError('Only "new Scanner(System.in)" is supported.', line);
		}
		this.expectOp(')');
		return { type: 'newScanner', line };
	}

	private parsePrimary(): Expr {
		const token = this.next();
		if (token.type === 'number') {
			return {
				type: 'literal',
				value: { kind: token.isInt ? 'int' : 'double', num: token.num ?? 0 },
				line: token.line
			};
		}
		if (token.type === 'string') {
			return { type: 'literal', value: { kind: 'string', text: token.text }, line: token.line };
		}
		if (token.type === 'char') {
			return { type: 'literal', value: { kind: 'char', text: token.text }, line: token.line };
		}
		if (token.type === 'ident') {
			if (token.text === 'new') return this.parseNew(token.line);
			if (token.text === 'true') {
				return { type: 'literal', value: { kind: 'boolean', value: true }, line: token.line };
			}
			if (token.text === 'false') {
				return { type: 'literal', value: { kind: 'boolean', value: false }, line: token.line };
			}
			return { type: 'variable', name: token.text, line: token.line };
		}
		if (token.type === 'op' && token.text === '(') {
			const expr = this.parseExpression();
			this.expectOp(')');
			return expr;
		}
		throw new JavaError(`Unexpected "${this.describe(token)}" in an expression.`, token.line);
	}
}

// ---------------------------------------------------------------------------
// Interpreter
// ---------------------------------------------------------------------------

class Scope {
	private frames: Map<string, Value>[] = [new Map()];

	push(): void {
		this.frames.push(new Map());
	}

	pop(): void {
		this.frames.pop();
	}

	declare(name: string, value: Value): void {
		this.frames[this.frames.length - 1].set(name, value);
	}

	get(name: string): Value | undefined {
		for (let i = this.frames.length - 1; i >= 0; i--) {
			const value = this.frames[i].get(name);
			if (value !== undefined) return value;
		}
		return undefined;
	}

	set(name: string, value: Value): boolean {
		for (let i = this.frames.length - 1; i >= 0; i--) {
			if (this.frames[i].has(name)) {
				this.frames[i].set(name, value);
				return true;
			}
		}
		return false;
	}
}

interface Context {
	output: string;
	steps: number;
	input: string;
	scannerPos: number;
}

const MAX_STEPS = 100000;
const MAX_OUTPUT = 100000;

function tick(context: Context, line: number): void {
	context.steps++;
	if (context.steps > MAX_STEPS) {
		throw new JavaError('Your loop ran too many times. Check for an infinite loop.', line);
	}
}

function appendOutput(context: Context, text: string, line: number): void {
	context.output += text;
	if (context.output.length > MAX_OUTPUT) {
		throw new JavaError('Your program printed too much text. Check your loop.', line);
	}
}

function defaultForType(varType: string): Value {
	switch (varType) {
		case 'double':
		case 'float':
			return { kind: 'double', num: 0 };
		case 'boolean':
			return { kind: 'boolean', value: false };
		case 'char':
			return { kind: 'char', text: '\0' };
		case 'String':
			return { kind: 'string', text: 'null' };
		case 'Scanner':
			return { kind: 'scanner' };
		default:
			return { kind: 'int', num: 0 };
	}
}

function toText(value: Value): string {
	switch (value.kind) {
		case 'int':
			return String(value.num);
		case 'double':
			return Number.isInteger(value.num) ? value.num.toFixed(1) : String(value.num);
		case 'boolean':
			return value.value ? 'true' : 'false';
		case 'scanner':
			return 'java.util.Scanner';
		default:
			return value.text;
	}
}

// -- Scanner helpers --------------------------------------------------------

function requireScanner(value: Value, line: number): void {
	if (value.kind !== 'scanner') {
		throw new JavaError('Only a Scanner can use the input methods, like nextInt().', line);
	}
}

function scannerPeekToken(context: Context): string {
	const input = context.input;
	let start = context.scannerPos;
	while (start < input.length && /\s/.test(input[start])) start++;
	let end = start;
	while (end < input.length && !/\s/.test(input[end])) end++;
	return input.slice(start, end);
}

function scannerNextToken(context: Context, line: number): string {
	if (!scannerPeekToken(context)) {
		throw new JavaError('The Scanner ran out of input to read.', line);
	}
	const token = scannerPeekToken(context);
	context.scannerPos += context.input.slice(context.scannerPos).indexOf(token) + token.length;
	return token;
}

function scannerHasNextToken(context: Context): boolean {
	return scannerPeekToken(context).length > 0;
}

function scannerNextLine(context: Context): string {
	const input = context.input;
	const start = context.scannerPos;
	let end = start;
	while (end < input.length && input[end] !== '\n') end++;
	let line = input.slice(start, end);
	if (line.endsWith('\r')) line = line.slice(0, -1);
	context.scannerPos = end < input.length ? end + 1 : end;
	return line;
}

function scannerHasNextLine(context: Context): boolean {
	return context.scannerPos < context.input.length;
}

const INTEGER_TOKEN = /^[+-]?\d+$/;

function isIntegerToken(token: string): boolean {
	return INTEGER_TOKEN.test(token);
}

function isNumberToken(token: string): boolean {
	return token.length > 0 && Number.isFinite(Number(token));
}

function callScanner(expr: { method: string; line: number }, context: Context): Value {
	switch (expr.method) {
		case 'next':
			return { kind: 'string', text: scannerNextToken(context, expr.line) };
		case 'nextLine':
			return { kind: 'string', text: scannerNextLine(context) };
		case 'nextInt':
		case 'nextLong':
		case 'nextShort':
		case 'nextByte': {
			const token = scannerNextToken(context, expr.line);
			if (!isIntegerToken(token)) {
				throw new JavaError(`The Scanner could not read "${token}" as a whole number.`, expr.line);
			}
			return { kind: 'int', num: Number(token) };
		}
		case 'nextDouble':
		case 'nextFloat': {
			const token = scannerNextToken(context, expr.line);
			if (!isNumberToken(token)) {
				throw new JavaError(`The Scanner could not read "${token}" as a number.`, expr.line);
			}
			return { kind: 'double', num: Number(token) };
		}
		case 'nextBoolean': {
			const token = scannerNextToken(context, expr.line);
			if (token === 'true') return { kind: 'boolean', value: true };
			if (token === 'false') return { kind: 'boolean', value: false };
			throw new JavaError(`The Scanner could not read "${token}" as true or false.`, expr.line);
		}
		case 'hasNext':
			return { kind: 'boolean', value: scannerHasNextToken(context) };
		case 'hasNextLine':
			return { kind: 'boolean', value: scannerHasNextLine(context) };
		case 'hasNextInt':
			return { kind: 'boolean', value: isIntegerToken(scannerPeekToken(context)) };
		case 'hasNextDouble':
			return { kind: 'boolean', value: isNumberToken(scannerPeekToken(context)) };
		case 'close':
			return { kind: 'boolean', value: false };
		default:
			throw new JavaError(`"${expr.method}" is not a Scanner method we support.`, expr.line);
	}
}

function isNumber(value: Value): value is { kind: 'int' | 'double'; num: number } {
	return value.kind === 'int' || value.kind === 'double';
}

function asNumber(value: Value, line: number): { kind: 'int' | 'double'; num: number } {
	if (isNumber(value)) return value;
	throw new JavaError(`Expected a number but found ${toText(value)}.`, line);
}

function asBoolean(value: Value, line: number): boolean {
	if (value.kind === 'boolean') return value.value;
	throw new JavaError(`A condition must be true or false, but found ${toText(value)}.`, line);
}

function addValues(left: Value, right: Value, line: number): Value {
	if (left.kind === 'string' || right.kind === 'string') {
		return { kind: 'string', text: toText(left) + toText(right) };
	}
	if (left.kind === 'char' || right.kind === 'char') {
		throw new JavaError('Adding char values is not supported. Use a string or a number.', line);
	}
	const a = asNumber(left, line);
	const b = asNumber(right, line);
	const bothInt = a.kind === 'int' && b.kind === 'int';
	return { kind: bothInt ? 'int' : 'double', num: a.num + b.num };
}

function numericValues(left: Value, right: Value, op: '-' | '*' | '/' | '%', line: number): Value {
	const a = asNumber(left, line);
	const b = asNumber(right, line);
	if ((op === '/' || op === '%') && b.num === 0) {
		throw new JavaError('You cannot divide by zero.', line);
	}
	const bothInt = a.kind === 'int' && b.kind === 'int';
	let num: number;
	if (op === '-') num = a.num - b.num;
	else if (op === '*') num = a.num * b.num;
	else if (op === '/') num = bothInt ? Math.trunc(a.num / b.num) : a.num / b.num;
	else num = a.num % b.num;
	return { kind: bothInt ? 'int' : 'double', num };
}

function equalsValues(left: Value, right: Value): boolean {
	if (isNumber(left) && isNumber(right)) return left.num === right.num;
	if (
		(left.kind === 'string' || left.kind === 'char') &&
		(right.kind === 'string' || right.kind === 'char')
	) {
		return toText(left) === toText(right);
	}
	if (left.kind === 'boolean' && right.kind === 'boolean') return left.value === right.value;
	return false;
}

function compareValues(left: Value, right: Value, op: string, line: number): boolean {
	const a = asNumber(left, line);
	const b = asNumber(right, line);
	if (op === '<') return a.num < b.num;
	if (op === '<=') return a.num <= b.num;
	if (op === '>') return a.num > b.num;
	return a.num >= b.num;
}

function evaluate(expr: Expr, scope: Scope, context: Context): Value {
	switch (expr.type) {
		case 'literal':
			return expr.value;

		case 'newScanner':
			return { kind: 'scanner' };

		case 'call': {
			const object = evaluate(expr.object, scope, context);
			requireScanner(object, expr.line);
			return callScanner(expr, context);
		}

		case 'variable': {
			const value = scope.get(expr.name);
			if (value === undefined) {
				throw new JavaError(
					`Variable "${expr.name}" is not defined. Declare it first, like: int ${expr.name} = 0;`,
					expr.line
				);
			}
			return value;
		}

		case 'update': {
			const current = evaluate(
				{ type: 'variable', name: expr.name, line: expr.line },
				scope,
				context
			);
			const step = asNumber(current, expr.line);
			const delta = expr.op === '++' ? 1 : -1;
			const next: Value = { kind: step.kind, num: step.num + delta };
			scope.set(expr.name, next);
			return expr.prefix ? next : current;
		}

		case 'unary': {
			const operand = evaluate(expr.operand, scope, context);
			if (expr.op === '!') return { kind: 'boolean', value: !asBoolean(operand, expr.line) };
			if (expr.op === '-') {
				const number = asNumber(operand, expr.line);
				return { kind: number.kind, num: -number.num };
			}
			return asNumber(operand, expr.line);
		}

		case 'binary': {
			if (expr.op === '&&') {
				const left = asBoolean(evaluate(expr.left, scope, context), expr.line);
				return {
					kind: 'boolean',
					value: left && asBoolean(evaluate(expr.right, scope, context), expr.line)
				};
			}
			if (expr.op === '||') {
				const left = asBoolean(evaluate(expr.left, scope, context), expr.line);
				return {
					kind: 'boolean',
					value: left || asBoolean(evaluate(expr.right, scope, context), expr.line)
				};
			}
			const left = evaluate(expr.left, scope, context);
			const right = evaluate(expr.right, scope, context);
			if (expr.op === '+') return addValues(left, right, expr.line);
			if (expr.op === '-') return numericValues(left, right, '-', expr.line);
			if (expr.op === '*') return numericValues(left, right, '*', expr.line);
			if (expr.op === '/') return numericValues(left, right, '/', expr.line);
			if (expr.op === '%') return numericValues(left, right, '%', expr.line);
			if (expr.op === '==') return { kind: 'boolean', value: equalsValues(left, right) };
			if (expr.op === '!=') return { kind: 'boolean', value: !equalsValues(left, right) };
			return { kind: 'boolean', value: compareValues(left, right, expr.op, expr.line) };
		}

		case 'assign': {
			const current = scope.get(expr.name);
			if (current === undefined) {
				throw new JavaError(
					`Variable "${expr.name}" is not defined. Declare it first, like: int ${expr.name} = 0;`,
					expr.line
				);
			}
			let value = evaluate(expr.value, scope, context);
			if (expr.op !== '=') {
				const baseOp = expr.op[0];
				if (baseOp === '+') value = addValues(current, value, expr.line);
				else value = numericValues(current, value, baseOp as '-' | '*' | '/' | '%', expr.line);
			}
			scope.set(expr.name, value);
			return value;
		}
	}
}

function exec(stmt: Stmt, scope: Scope, context: Context): Control {
	switch (stmt.type) {
		case 'empty':
			return 'normal';

		case 'break':
			return 'break';

		case 'continue':
			return 'continue';

		case 'block': {
			scope.push();
			let result: Control = 'normal';
			for (const inner of stmt.statements) {
				result = exec(inner, scope, context);
				if (result !== 'normal') break;
			}
			scope.pop();
			return result;
		}

		case 'varDecl': {
			for (const declaration of stmt.declarations) {
				const value = declaration.init
					? evaluate(declaration.init, scope, context)
					: defaultForType(stmt.varType);
				scope.declare(declaration.name, value);
			}
			return 'normal';
		}

		case 'exprStmt':
			evaluate(stmt.expression, scope, context);
			return 'normal';

		case 'print': {
			let text = '';
			if (stmt.argument) text = toText(evaluate(stmt.argument, scope, context));
			appendOutput(context, text + (stmt.newline ? '\n' : ''), stmt.line);
			return 'normal';
		}

		case 'switch': {
			const subject = evaluate(stmt.subject, scope, context);
			scope.push();
			let result: Control = 'normal';
			let index = -1;
			for (let i = 0; i < stmt.cases.length; i++) {
				const matched = stmt.cases[i].tests.some((test) =>
					equalsValues(evaluate(test, scope, context), subject)
				);
				if (matched) {
					index = i;
					break;
				}
			}
			if (index === -1) index = stmt.cases.findIndex((item) => item.isDefault);
			if (index !== -1) {
				for (let i = index; i < stmt.cases.length; i++) {
					for (const statement of stmt.cases[i].statements) {
						result = exec(statement, scope, context);
						if (result !== 'normal') break;
					}
					if (result !== 'normal') break;
				}
			}
			scope.pop();
			return result === 'break' ? 'normal' : result;
		}

		case 'if': {
			if (asBoolean(evaluate(stmt.condition, scope, context), stmt.line)) {
				return exec(stmt.thenBranch, scope, context);
			}
			if (stmt.elseBranch) return exec(stmt.elseBranch, scope, context);
			return 'normal';
		}

		case 'while': {
			while (asBoolean(evaluate(stmt.condition, scope, context), stmt.line)) {
				tick(context, stmt.line);
				if (exec(stmt.body, scope, context) === 'break') break;
			}
			return 'normal';
		}

		case 'doWhile': {
			do {
				tick(context, stmt.line);
				if (exec(stmt.body, scope, context) === 'break') break;
			} while (asBoolean(evaluate(stmt.condition, scope, context), stmt.line));
			return 'normal';
		}

		case 'for': {
			scope.push();
			if (stmt.init) exec(stmt.init, scope, context);
			while (
				stmt.condition ? asBoolean(evaluate(stmt.condition, scope, context), stmt.line) : true
			) {
				tick(context, stmt.line);
				const result = exec(stmt.body, scope, context);
				if (result === 'break') break;
				for (const update of stmt.update) evaluate(update, scope, context);
			}
			scope.pop();
			return 'normal';
		}
	}
}

/**
 * Run the supported parts of a Java program and collect the printed output.
 * `input` is the text a Scanner reads from, like typed keyboard input.
 */
export function runJava(source: string, input = ''): JavaRunResult {
	try {
		const tokens = lex(source);
		const statements = new Parser(tokens).parseProgram();

		const context: Context = { output: '', steps: 0, input, scannerPos: 0 };
		const scope = new Scope();
		scope.push();

		for (const statement of statements) {
			const result = exec(statement, scope, context);
			if (result !== 'normal') {
				throw new JavaError('"break" and "continue" can only be used inside a loop.');
			}
		}

		return { output: context.output, error: null };
	} catch (err) {
		if (err instanceof JavaError) return { output: '', error: err.message };
		return { output: '', error: 'Something went wrong while running your code.' };
	}
}
