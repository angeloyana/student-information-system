<script>
  import Ellipsis from 'lucide-svelte/icons/ellipsis';
  import Eye from 'lucide-svelte/icons/eye';
  import Pen from 'lucide-svelte/icons/pen';
  import Trash2 from 'lucide-svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';

  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

  let { rowData } = $props();

  const handleViewBtn = () => {
    goto(`${$page.url.pathname}/${rowData.id}`);
  };

  const handleUpdateBtn = () => {
    goto(`${$page.url.pathname}/update/${rowData.id}`);
  };

  const handleDeleteForm = () => {
    return ({ result, update }) => {
      if (result.type !== 'success') {
        toast.error('Something went wrong');
        return;
      }

      toast.success('Row has been deleted');
      update();
    };
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
    <DropdownMenu.Item onclick={handleViewBtn}>
      <Eye class="size-4" />
      <span>View</span>
    </DropdownMenu.Item>
    <DropdownMenu.Item onclick={handleUpdateBtn}>
      <Pen class="size-4" />
      <span>Update</span>
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <form
      method="POST"
      action="?/delete"
      class="contents"
      use:enhance={handleDeleteForm}
    >
      <input type="hidden" name="id" value={rowData.id} />
      <DropdownMenu.Item class="w-full">
        {#snippet child({ props })}
          <button type="submit" {...props}>
            <Trash2 class="size-4" />
            <span>Delete</span>
          </button>
        {/snippet}
      </DropdownMenu.Item>
    </form>
  </DropdownMenu.Content>
</DropdownMenu.Root>
