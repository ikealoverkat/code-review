<script lang="ts">
	import { page } from "$app/state";
</script>

<div>
    {#if page.error}
        <h1>Error</h1>
        <p>{page.error.message}</p>
    {/if}
    <p>looks like this page couldn't be loaded! it may have been moved or deleted. click a link on the sidebar to navigate to another page.</p>
</div>