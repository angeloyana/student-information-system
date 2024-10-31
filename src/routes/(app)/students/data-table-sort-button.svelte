<script>
  import ArrowDownAZ from 'lucide-svelte/icons/arrow-down-a-z';
  import ArrowUpZA from 'lucide-svelte/icons/arrow-up-z-a';
  import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';

  import { Button } from '$lib/components/ui/button';

  let { label, order, ...restProps } = $props();
</script>

<Button variant="ghost" size="sm" {...restProps}>
  {label}
  {#if order === 'asc'}
    <ArrowDownAZ class="size-4" />
  {:else if order === 'desc'}
    <ArrowUpZA class="size-4" />
  {:else}
    <ArrowUpDown class="size-4" />
  {/if}
</Button>
