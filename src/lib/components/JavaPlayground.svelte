<script lang="ts">
	import { onMount } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { keymap } from '@codemirror/view';
	import { java } from '@codemirror/lang-java';
	import { EditorState } from '@codemirror/state';
	import { defaultKeymap } from '@codemirror/commands';
	import { runJava } from '#lib/java-simulator.ts';

	const STARTER_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`;

	let editorContainer: HTMLDivElement;
	let view: EditorView | undefined;

	let output = $state('');
	let error = $state<string | null>(null);
	let hasRun = $state(false);
	let input = $state('');

	onMount(() => {
		const startState = EditorState.create({
			doc: STARTER_CODE,
			extensions: [basicSetup, keymap.of(defaultKeymap), java()]
		});

		view = new EditorView({
			state: startState,
			parent: editorContainer
		});

		return () => view?.destroy();
	});

	function run() {
		const source = view ? view.state.doc.toString() : '';
		const result = runJava(source, input);
		output = result.output;
		error = result.error;
		hasRun = true;
	}

	function clearOutput() {
		output = '';
		error = null;
		hasRun = false;
	}

	const display = $derived(
		!hasRun
			? "Press Run to see your program's output."
			: error
				? error
				: output.length > 0
					? output
					: '(no output)'
	);
</script>

<div class="sticky top-0 h-screen min-w-[35vw] overflow-y-auto p-12 outline-1 outline-pink-dark container">
	<h1>Playground</h1>
	<div bind:this={editorContainer} class="editor"></div>

	<div class="controls">
		<button type="button" class="run-button" onclick={run}>Run</button>
		<p class="hint">
			Supports variables, if/else, loops, switch, Scanner input, and System.out.print / println
		</p>
	</div>

	<section class="input-section">
		<div class="input-header">
			<h2>Input</h2>
		</div>
		<p class="input-hint">Text the Scanner reads, like keyboard input (one value per line).</p>
		<textarea class="input-panel" bind:value={input} placeholder="5&#10;10"></textarea>
	</section>

	<section class="output-section">
		<div class="output-header">
			<h2>Output</h2>
			<button type="button" class="clear-button" onclick={clearOutput}>Clear</button>
		</div>
		<pre class="output-panel">{display}</pre>
	</section>

	<img src="/laptop1.png" alt="Laptop" class="mx-auto w-[30%] max-w-md" />
</div>

<style>
	.container {
		background: color-mix(in srgb, var(--color-pink-mid) 10%, transparent);
	}

	.editor {
		background: white;
		border: 1px solid #555;
		border-radius: 8px;
		overflow: hidden;
		min-height: 500px;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.run-button {
		background: var(--color-pink-dark);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.6rem 1.8rem;
		font-family: 'Helvetica', sans-serif;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
	}

	.run-button:hover {
		background: var(--color-pink-mid);
	}

	.hint {
		color: var(--color-navy);
		font-size: 0.9rem;
	}

	.input-section {
		margin-top: 1rem;
	}

	.input-header h2 {
		margin: 0;
	}

	.input-hint {
		color: var(--color-navy);
		font-size: 0.85rem;
		margin: 0.25rem 0;
	}

	.input-panel {
		width: 100%;
		box-sizing: border-box;
		background: white;
		color: var(--color-navy);
		border: 1px solid #555;
		border-radius: 8px;
		padding: 0.6rem;
		min-height: 80px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
		font-size: 1rem;
		resize: vertical;
	}

	.output-section {
		margin-top: 1rem;
	}

	.output-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.output-header h2 {
		margin: 0;
	}

	.clear-button {
		background: transparent;
		border: 1px solid var(--color-pink-dark);
		color: var(--color-pink-dark);
		border-radius: 6px;
		padding: 0.25rem 1rem;
		font-family: 'Helvetica', sans-serif;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.clear-button:hover {
		background: var(--color-pink-light);
	}

	.output-panel {
		background: var(--color-navy);
		color: var(--color-pink-light);
		border-radius: 8px;
		padding: 1rem;
		margin: 0.5rem 0 0;
		min-height: 120px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
		font-size: 1rem;
		white-space: pre-wrap;
		overflow-x: auto;
	}
</style>
