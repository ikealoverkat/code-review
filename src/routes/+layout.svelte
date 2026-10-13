<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import JavaPlayground from '#lib/components/JavaPlayground.svelte';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href="/laptop2.png" />
	<title>kat's ICS3UR code review</title>
</svelte:head>

<div class="flex flex-row gap-8 bg-pink-light">
	<div class="sticky">
		<Sidebar />
	</div>
	<div class="m-12">
		{@render children()}
	</div>
	<JavaPlayground />
</div>
