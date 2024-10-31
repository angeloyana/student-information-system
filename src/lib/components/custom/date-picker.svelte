<script>
  import CalendarIcon from 'lucide-svelte/icons/calendar';
  import {
    getLocalTimeZone,
    parseDate,
    DateFormatter,
  } from '@internationalized/date';

  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { Calendar } from '$lib/components/ui/calendar/index.js';
  import { cn } from '$lib/utils.js';
  import * as Popover from '$lib/components/ui/popover/index.js';

  let { value = $bindable(), ...restProps } = $props();

  let dateValue = $derived(value && parseDate(value));

  const df = new DateFormatter('en-US', {
    dateStyle: 'long',
  });
</script>

<Popover.Root>
  <Popover.Trigger
    class={cn(
      buttonVariants({
        variant: 'outline',
        class: 'w-full justify-start font-normal',
      }),
      !dateValue && 'text-muted-foreground'
    )}
    {...restProps}
  >
    <CalendarIcon class="size-4" />
    {dateValue
      ? df.format(dateValue.toDate(getLocalTimeZone()))
      : 'Select a date'}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar
      type="single"
      value={dateValue}
      onValueChange={(v) => (value = v.toString())}
    />
  </Popover.Content>
</Popover.Root>
