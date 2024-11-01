<script>
  import { superForm } from 'sveltekit-superforms';
  import { toast } from 'svelte-sonner';
  import { zodClient } from 'sveltekit-superforms/adapters';

  import { goto } from '$app/navigation';
  import Combobox from '$lib/components/custom/combobox.svelte';
  import DatePicker from '$lib/components/custom/date-picker.svelte';
  import { Input } from '$lib/components/ui/input';
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import { formSchema } from '../../form-schema';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success(`${form.data.firstName} has been updated`);
        goto('/students');
      }
    },
  });

  const { form: formData, enhance } = form;
  const classrooms = data.classrooms.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
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
    <Form.Field name="sex" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Sex</Form.Label>
          <Select.Root type="single" bind:value={$formData.sex}>
            <Select.Trigger class="capitalize" {...props}>
              {$formData.sex}
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="male">Male</Select.Item>
              <Select.Item value="female">Female</Select.Item>
            </Select.Content>
          </Select.Root>
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      <input type="hidden" name="sex" value={$formData.sex} />
    </Form.Field>
    <Form.Field name="birthDate" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Birth Date</Form.Label>
          <DatePicker bind:value={$formData.birthDate} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      <input type="hidden" name="birthDate" value={$formData.birthDate} />
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
    <Form.Field name="classroomId" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Classroom</Form.Label>
          <Combobox
            placeholder="Select a classroom"
            items={classrooms}
            bind:value={$formData.classroomId}
            {...props}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      <input type="hidden" name="classroomId" value={$formData.classroomId} />
    </Form.Field>
  </div>
  <Form.Button class="mt-4">Update</Form.Button>
</form>
