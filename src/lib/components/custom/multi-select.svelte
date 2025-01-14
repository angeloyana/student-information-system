<script>
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { VList } from 'virtua/svelte';

  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  let { value = $bindable([]), items, placeholder, ...restProps } = $props();

  let open = $state(false);
  let triggerRef = $state(null);

  let searchValue = $state('');
  let filteredItems = $derived(
    items.filter(({ label }) =>
      label.toLowerCase().includes(searchValue.toLowerCase())
    )
  );
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef} {...restProps}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-full justify-between font-normal"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        {placeholder}
        <ChevronsUpDown class="size-4 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root shouldFilter={false}>
      <Command.Input placeholder="Search..." bind:value={searchValue} />
      <Command.List class="max-h-none">
        <Command.Empty>No result found.</Command.Empty>
        <VList
          data={filteredItems}
          style="height: {filteredItems.length * 32 +
            8}px; max-height: 300px; padding: 0.25rem"
          getKey={({ id }) => id}
        >
          {#snippet children(item)}
            <Command.Item
              onSelect={() => {
                if (value.includes(item.value)) {
                  value = value.filter((v) => v != item.value);
                } else {
                  value = [...value, item.value];
                }
              }}
            >
              <Check
                class={cn(
                  'size-4',
                  !value.includes(item.value) && 'text-transparent'
                )}
              />
              {item.label}
            </Command.Item>
          {/snippet}
        </VList>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
