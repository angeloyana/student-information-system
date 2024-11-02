<script>
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import { VList } from 'virtua/svelte';

  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  let { value = $bindable(), items, placeholder, ...restProps } = $props();

  let open = $state(false);
  let triggerRef = $state(null);

  let selectedValue = $state();
  let searchValue = $state('');
  let filteredItems = $derived(
    items.filter(({ label }) =>
      label.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
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
        {selectedValue?.label || placeholder}
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
          getKey={(_, i) => i}
        >
          {#snippet children(item)}
            <Command.Item
              onSelect={() => {
                value = item.value;
                selectedValue = item;
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn(
                  'size-4',
                  !(selectedValue?.id === item.id) && 'text-transparent'
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
