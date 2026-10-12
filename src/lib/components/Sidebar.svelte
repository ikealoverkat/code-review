<script lang="ts">
	import { docs } from '#lib/docs/index.ts';
</script>

<div class="sticky h-screen p-12 outline-2">
	<h1>ICS3UR Code Review Docs</h1>
	<h2>by <a href="https://kat.wang" target="_blank">Kat</a></h2>
	<h3 class="my-4"><a href="/">Home</a></h3>
	{#each docs as doc}
		<ul>
			<li>
				<a href={`/${doc.slug}`}
                >
                    {doc.title}
                </a>
			</li>
		</ul>
	{/each}
</div>
