<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="https://cdn.spurnow.com/360/7799_spurlogobluebg.svg" />
</svelte:head>

{@render children()}
