<script lang="ts">
	import '../app.css';

	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<svelte:head>
	<title>Hello</title>
</svelte:head>

<div>
	<a href="/">Home</a>
	<a href="/posts">Posts</a>
	<a href="/about">About</a>
</div>

{@render children()}
