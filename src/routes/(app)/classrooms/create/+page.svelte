<script>
  import { superForm } from 'sveltekit-superforms';
  import { toast } from 'svelte-sonner';
  import { zodClient } from 'sveltekit-superforms/adapters';

  import { goto } from '$app/navigation';
  import { Input } from '$lib/components/ui/input';
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import { formSchema } from '../form-schema';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success(`${form.data.name} has been added`);
        goto('/classrooms');
      }
    },
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="p-4">
  <div class="grid gap-4 md:grid-cols-2">
    <Form.Field name="name" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Name</Form.Label>
          <Input bind:value={$formData.name} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>
  <Form.Button class="mt-4">Create</Form.Button>
</form>
