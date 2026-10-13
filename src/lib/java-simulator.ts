// A tiny Java output simulator for the ICS3UR playground.
//
// It does NOT compile or run Java. It only understands a little bit:
//   - System.out.println(...) and System.out.print(...)
//   - string literals in double quotes
//   - numbers (whole and decimal)
//   - basic expressions using + - * / % and parentheses
//
// Anything it does not understand produces a friendly message instead of
// silently guessing.

export interface JavaRunResult {
	output: string;
	error: string | null;
}

/** A friendly error we can show to the student. */
class JavaSyntaxError extends Error {}

type TokenType = 'number' | 'string' | '+' | '-' | '*' | '/' | '%' | '(' | ')';

interface Token {
	type: TokenType;
	text: string;
	num?: number;
	isInt?: boolean;
	str?: string;
}

type Value =
	| { kind: 'int'; num: number }
	| { kind: 'double'; num: number }
	| { kind: 'string'; text: string };

const PRINT_START = 'System.out.print';

/** Run the supported parts of a Java program and collect printed output. */
export function runJava(source: string): JavaRunResult {
	try {
		const code = stripComments(source);

		let output = '';
		let remaining = '';
		let last = 0;
		let i = 0;

		while (i < code.length) {
			const char = code[i];

			if (char === '"' || char === "'") {
				i = skipStringLiteral(code, i);
				continue;
			}

			if (code.startsWith(PRINT_START, i)) {
				let j = i + PRINT_START.length;
				let addsNewline = false;

				if (code.startsWith('ln', j)) {
					addsNewline = true;
					j += 2;
				}

				while (j < code.length && isSpace(code[j])) j++;

				if (code[j] !== '(') {
					throw new JavaSyntaxError(
						'Found "System.out.print" but it is not followed by "(" and a value.'
					);
				}

				const close = findClosingParen(code, j);
				const argument = code.slice(j + 1, close).trim();

				let printed = '';
				if (argument !== '') {
					printed = toText(new Parser(tokenize(argument)).parse());
				}

				output += printed + (addsNewline ? '\n' : '');
				remaining += code.slice(last, i);

				i = close + 1;
				last = i;
				continue;
			}

			i++;
		}

		remaining += code.slice(last);

		const unsupported = findUnsupportedCode(remaining);
		if (unsupported) {
			return { output: '', error: unsupported };
		}

		return { output, error: null };
	} catch (err) {
		if (err instanceof JavaSyntaxError) {
			return { output: '', error: err.message };
		}
		return { output: '', error: 'Something went wrong while running your code.' };
	}
}

function isSpace(char: string): boolean {
	return char === ' ' || char === '\t' || char === '\n' || char === '\r';
}

function isDigit(char: string): boolean {
	return char >= '0' && char <= '9';
}

// remove java comments 
function stripComments(code: string): string {
	let result = '';
	let i = 0;
	let inString = false;

	while (i < code.length) {
		const char = code[i];

		if (inString) {
			result += char;
			if (char === '\\') {
				result += code[i + 1] ?? '';
				i += 2;
				continue;
			}
			if (char === '"') inString = false;
			i++;
			continue;
		}

		if (char === '"') {
			inString = true;
			result += char;
			i++;
			continue;
		}

		if (char === '/' && code[i + 1] === '/') {
			while (i < code.length && code[i] !== '\n') i++;
			continue;
		}

		if (char === '/' && code[i + 1] === '*') {
			i += 2;
			while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i++;
			i += 2;
			continue;
		}

		result += char;
		i++;
	}

	return result;
}

function skipStringLiteral(code: string, start: number): number {
	const quote = code[start];
	let i = start + 1;
	while (i < code.length) {
		if (code[i] === '\\') {
			i += 2;
			continue;
		}
		if (code[i] === quote) return i + 1;
		i++;
	}
	return i;
}

function findClosingParen(code: string, openIndex: number): number {
	let depth = 0;
	let i = openIndex;
	while (i < code.length) {
		const char = code[i];
		if (char === '"' || char === "'") {
			i = skipStringLiteral(code, i);
			continue;
		}
		if (char === '(') depth++;
		else if (char === ')') {
			depth--;
			if (depth === 0) return i;
		}
		i++;
	}
	throw new JavaSyntaxError('A print statement is missing its closing ")".');
}

function findUnsupportedCode(code: string): string | null {
	const allowed = [
		/\bpublic\s+class\s+[A-Za-z_]\w*\s*\{/g,
		/\bclass\s+[A-Za-z_]\w*\s*\{/g,
		/\bpublic\s+static\s+void\s+main\s*\(\s*String\s*(\[\s*\]\s*[A-Za-z_]\w*|[A-Za-z_]\w*\s*\[\s*\])\s*\)\s*\{/g,
		/\bstatic\s+void\s+main\s*\([^)]*\)\s*\{/g,
		/\bvoid\s+main\s*\([^)]*\)\s*\{/g
	];

	let rest = code;
	for (const pattern of allowed) rest = rest.replace(pattern, ' ');

	rest = rest.replace(/[{}\s;]+/g, ' ').trim();
	if (rest === '') return null;

	const snippet = rest.length > 60 ? rest.slice(0, 60) + '…' : rest;
	return `Unsupported Java code: "${snippet}". This playground only understands System.out.print and System.out.println with strings, numbers, and simple + - * / % expressions.`;
}

function tokenize(source: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;

	while (i < source.length) {
		const char = source[i];

		if (isSpace(char)) {
			i++;
			continue;
		}

		if (char === '"') {
			let text = '';
			let closed = false;
			i++;
			while (i < source.length) {
				const current = source[i];
				if (current === '\\') {
					const escaped = source[i + 1];
					if (escaped === 'n') text += '\n';
					else if (escaped === 't') text += '\t';
					else if (escaped === '"') text += '"';
					else if (escaped === '\\') text += '\\';
					else text += escaped ?? '';
					i += 2;
					continue;
				}
				if (current === '"') {
					closed = true;
					i++;
					break;
				}
				text += current;
				i++;
			}
			if (!closed) {
				throw new JavaSyntaxError('A string is missing its closing quotation mark.');
			}
			tokens.push({ type: 'string', text, str: text });
			continue;
		}

		if (isDigit(char) || (char === '.' && isDigit(source[i + 1] ?? ''))) {
			let text = '';
			while (i < source.length && (isDigit(source[i]) || source[i] === '.')) {
				text += source[i];
				i++;
			}
			if ((text.match(/\./g) ?? []).length > 1) {
				throw new JavaSyntaxError(`"${text}" is not a valid number.`);
			}
			tokens.push({ type: 'number', text, num: Number(text), isInt: !text.includes('.') });
			continue;
		}

		if ('+-*/%()'.includes(char)) {
			tokens.push({ type: char as TokenType, text: char });
			i++;
			continue;
		}

		if (/[A-Za-z_]/.test(char)) {
			let word = '';
			while (i < source.length && /[A-Za-z0-9_]/.test(source[i])) {
				word += source[i];
				i++;
			}
			throw new JavaSyntaxError(
				`Variable names like "${word}" are not supported yet. Try a string, number, or simple expression.`
			);
		}

		throw new JavaSyntaxError(`Unexpected character "${char}" in the expression.`);
	}

	return tokens;
}

function toText(value: Value): string {
	if (value.kind === 'string') return value.text;
	if (value.kind === 'int') return String(value.num);
	return Number.isInteger(value.num) ? value.num.toFixed(1) : String(value.num);
}

// differentiate between contatenation and addition
function add(left: Value, right: Value): Value {
	if (left.kind === 'string' || right.kind === 'string') {
		return { kind: 'string', text: toText(left) + toText(right) };
	}
	const bothInt = left.kind === 'int' && right.kind === 'int';
	return { kind: bothInt ? 'int' : 'double', num: left.num + right.num };
}

function calculate(left: Value, right: Value, op: '-' | '*' | '/' | '%'): Value {
	if (left.kind === 'string' || right.kind === 'string') {
		throw new JavaSyntaxError(`The "${op}" operator only works with numbers.`);
	}
	if ((op === '/' || op === '%') && right.num === 0) {
		throw new JavaSyntaxError('You cannot divide by zero.');
	}
	const bothInt = left.kind === 'int' && right.kind === 'int';

	let num: number;
	if (op === '-') num = left.num - right.num;
	else if (op === '*') num = left.num * right.num;
	else if (op === '/') num = bothInt ? Math.trunc(left.num / right.num) : left.num / right.num;
	else num = left.num % right.num;

	return { kind: bothInt ? 'int' : 'double', num };
}

class Parser {
	private tokens: Token[];
	private i = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	parse(): Value {
		const value = this.additive();
		if (this.i < this.tokens.length) {
			throw new JavaSyntaxError(`Unexpected "${this.tokens[this.i].text}" in the expression.`);
		}
		return value;
	}

	private peek(): Token | undefined {
		return this.tokens[this.i];
	}

	private next(): Token | undefined {
		return this.tokens[this.i++];
	}

	private additive(): Value {
		let left = this.term();
		for (;;) {
			const token = this.peek();
			if (!token || (token.type !== '+' && token.type !== '-')) return left;
			this.i++;
			const right = this.term();
			left = token.type === '+' ? add(left, right) : calculate(left, right, '-');
		}
	}

	private term(): Value {
		let left = this.unary();
		for (;;) {
			const token = this.peek();
			if (!token || (token.type !== '*' && token.type !== '/' && token.type !== '%')) return left;
			this.i++;
			const right = this.unary();
			left = calculate(left, right, token.type);
		}
	}

	private unary(): Value {
		const token = this.peek();
		if (token && token.type === '-') {
			this.i++;
			const value = this.unary();
			if (value.kind === 'string') {
				throw new JavaSyntaxError('You cannot put a minus sign in front of text.');
			}
			return { kind: value.kind, num: -value.num };
		}
		if (token && token.type === '+') {
			this.i++;
			return this.unary();
		}
		return this.primary();
	}

	private primary(): Value {
		const token = this.next();
		if (!token) {
			throw new JavaSyntaxError('The expression is incomplete.');
		}
		if (token.type === 'number') {
			return { kind: token.isInt ? 'int' : 'double', num: token.num ?? 0 };
		}
		if (token.type === 'string') {
			return { kind: 'string', text: token.str ?? '' };
		}
		if (token.type === '(') {
			const value = this.additive();
			const closing = this.next();
			if (!closing || closing.type !== ')') {
				throw new JavaSyntaxError('Missing a closing ")" in the expression.');
			}
			return value;
		}
		throw new JavaSyntaxError(`Unexpected "${token.text}" in the expression.`);
	}
}
