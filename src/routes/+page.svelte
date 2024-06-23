<script lang="ts">
	import { page } from '../lib/page';
	import Counter from '../lib/Counter.svelte';
</script>

<h1>Index</h1>

<Counter />

{page.url.href}
