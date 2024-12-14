<script>
  import Copy from 'lucide-svelte/icons/copy';
  import Ellipsis from 'lucide-svelte/icons/ellipsis';
  import Eye from 'lucide-svelte/icons/eye';
  import { toast } from 'svelte-sonner';

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

  let { rowData } = $props();

  const handleCopyIdBtn = () => {
    navigator.clipboard.writeText(rowData.id);
  };

  const handleCopyUserIdBtn = () => {
    navigator.clipboard.writeText(rowData.userId);
  };

  const handleCopyObjectIdBtn = () => {
    navigator.clipboard.writeText(rowData.objectId);
  };

  const handleViewBtn = () => {
    goto(`${$page.url.pathname}/${rowData.id}`);
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button variant="ghost" size="sm" {...props}>
        <Ellipsis class="size-4" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item onclick={handleCopyIdBtn}>
      <Copy class="size-4" />
      <span>Copy ID</span>
    </DropdownMenu.Item>
    {#if rowData.userId}
      <DropdownMenu.Item onclick={handleCopyUserIdBtn}>
        <Copy class="size-4" />
        <span>Copy User ID</span>
      </DropdownMenu.Item>
    {/if}
    <DropdownMenu.Item onclick={handleCopyObjectIdBtn}>
      <Copy class="size-4" />
      <span>Copy Object ID</span>
    </DropdownMenu.Item>
    <DropdownMenu.Item onclick={handleViewBtn}>
      <Eye class="size-4" />
      <span>View</span>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
