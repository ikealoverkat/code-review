<script lang="ts">
	import { docs } from '#lib/docs/index.ts';
</script>

<div class="sticky top-0 h-screen overflow-y-auto bg-pink-mid/20 p-12 outline-1 outline-pink-dark">
	<img src="/favicon.png" alt="Laptop" class="mx-auto w-[80%] max-w-md" />
	<h1>ICS3UR Code Review Docs</h1>
	<h2>by <a href="https://kat.wang" target="_blank">Kat</a></h2>
	<h3 class="my-4"><a href="/">Home</a></h3>
	{#each docs as doc}
		<ul>
			<li>
				<a href={`/${doc.slug}`}>
					{doc.title}
				</a>
			</li>
		</ul>
	{/each}
</div>
