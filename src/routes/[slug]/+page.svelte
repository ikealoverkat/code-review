<script lang="ts">
    import { getDoc } from '#lib/docs/index.ts';
    import type { PageData } from './$types';
    const { data }: { data: PageData } = $props();
    const Doc = $derived(getDoc(data.slug)?.component);
</script>

<div class="min-w-[50vw]">
    {#if Doc}
        <Doc />
    {/if}
</div>