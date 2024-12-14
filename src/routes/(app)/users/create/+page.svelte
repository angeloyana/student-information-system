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
        toast.success(`${form.data.firstName} has been added`);
        goto('/users');
      }
    },
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="p-4">
  <div class="grid gap-4 md:grid-cols-2">
    <Form.Field name="firstName" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>First Name</Form.Label>
          <Input bind:value={$formData.firstName} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field name="lastName" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Last Name</Form.Label>
          <Input bind:value={$formData.lastName} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field name="email" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input bind:value={$formData.email} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field name="role" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Role</Form.Label>
          <Select.Root type="single" bind:value={$formData.role}>
            <Select.Trigger class="capitalize" {...props}>
              {$formData.role}
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="superuser">Superuser</Select.Item>
              <Select.Item value="admin">Admin</Select.Item>
            </Select.Content>
          </Select.Root>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      <input type="hidden" name="role" value={$formData.role} />
    </Form.Field>
    <Form.Field name="password" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Password</Form.Label>
          <Input type="password" bind:value={$formData.password} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>
  <Form.Button class="mt-4">Create</Form.Button>
</form>
