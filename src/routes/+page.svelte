<script lang="ts">
	let count = $state(0);
</script>

<h1>Index</h1>

<button
	class="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
	onclick={() => count++}
>
	{count}
</button>
