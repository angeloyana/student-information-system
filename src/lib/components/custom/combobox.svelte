<script>
  import Check from 'lucide-svelte/icons/check';
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import { tick } from 'svelte';
  import * as Command from '$lib/components/ui/command/index.js';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  let { value = $bindable(), items, placeholder, ...restProps } = $props();

  let open = $state(false);
  let triggerRef = $state(null);

  const selectedValue = $derived(
    items.find((item) => item.value === value)?.label
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
        {selectedValue || placeholder}
        <ChevronsUpDown class="size-4 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search..." />
      <Command.List>
        <Command.Empty>No result found.</Command.Empty>
        <Command.Group>
          {#each items as item}
            <Command.Item
              value={item.label}
              onSelect={() => {
                value = item.value;
                closeAndFocusTrigger();
              }}
            >
              <Check
                class={cn(
                  'mr-2 size-4',
                  value !== item.value && 'text-transparent'
                )}
              />
              {item.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
