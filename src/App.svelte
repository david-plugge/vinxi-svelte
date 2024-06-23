<script lang="ts" context="module">
	function renderTag(
		tag: string,
		attrs: Record<string, string>,
		options?: {
			children?: string;
			selfClosing?: boolean;
		}
	) {
		const attrStr = Object.entries(attrs)
			.map(([key, value]) => ` ${key}="${value}"`)
			.join('');

		if (options?.selfClosing) {
			return `<${tag}${attrStr}/>`;
		}
		return `<${tag}${attrStr}>${options?.children ?? ''}</${tag}>`;
	}

	function renderAsset(asset: any) {
		switch (asset.tag) {
			case 'script':
				if (asset.attrs.src) {
					return renderTag('script', { ...asset.attrs, key: asset.attrs.src });
				}
				return renderTag('script', asset.attrs, { children: asset.children });
			case 'link':
				return renderTag('link', asset.attrs, { selfClosing: true });
			case 'style':
				return renderTag('style', asset.attrs, { children: asset.children });
		}
	}
</script>

<script lang="ts">
	import { setContext, type Component } from 'svelte';
	import type { Page } from './lib/page';

	let {
		components,
		assets,

		page
	}: {
		components: Component[];
		assets: any[];
		page: Page;
	} = $props();

	const pageContext = $state.frozen(page);

	setContext('PAGE_CONTEXT', () => pageContext);
</script>

<svelte:head>
	{#each assets as asset}
		{@html renderAsset(asset)}
	{/each}
</svelte:head>

{@render stack(components)}

{#snippet stack([component, ...rest])}
	<svelte:component this={component}>
		{#if rest.length}
			{@render stack(rest)}
		{/if}
	</svelte:component>
{/snippet}
