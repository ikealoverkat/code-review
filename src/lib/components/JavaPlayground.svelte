<script lang="ts">
    import { onMount } from 'svelte';
    import { EditorView, basicSetup } from 'codemirror';
    import { keymap } from '@codemirror/view';
    import { java } from '@codemirror/lang-java';
    import { EditorState } from '@codemirror/state';
    import { defaultKeymap } from '@codemirror/commands';

    let editorContainer: HTMLDivElement;

    onMount(() => {
        const startState = EditorState.create({
            doc: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}',
            extensions: [
                basicSetup,
                keymap.of(defaultKeymap),
                java()
            ]
        });

        const view = new EditorView({
            state: startState,
            parent: editorContainer
        });

        return () => view.destroy();
    });
</script>

<div class="p-12 min-w-[35vw]">
    <h1>Playground</h1>
    <div bind:this={editorContainer} class="editor"></div>
</div>

<style>
    .editor {
        border: 1px solid #555;
        border-radius: 8px;
        overflow: hidden;
        min-height: 500px;
    }
</style>
```