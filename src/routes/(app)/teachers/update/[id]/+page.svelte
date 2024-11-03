<script>
  import { superForm } from 'sveltekit-superforms';
  import { toast } from 'svelte-sonner';
  import { zodClient } from 'sveltekit-superforms/adapters';

  import { goto } from '$app/navigation';
  import Combobox from '$lib/components/custom/combobox.svelte';
  import MultiSelect from '$lib/components/custom/multi-select.svelte';
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
        goto('/teachers');
      }
    },
  });

  const { form: formData, enhance } = form;
  const classrooms = data.classrooms.map(({ id, name }) => ({
    id,
    label: name,
    value: id,
  }));
  const subjects = data.subjects.map(({ id, name }) => ({
    id,
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
    <Form.Field name="email" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Email</Form.Label>
          <Input bind:value={$formData.email} {...props} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field name="classroomIds" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Classrooms</Form.Label>
          <MultiSelect
            items={classrooms}
            placeholder="Select classrooms..."
            bind:value={$formData.classroomIds}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      {#each $formData.classroomIds as classroomId}
        <input type="hidden" name="classroomIds" value={classroomId} />
      {/each}
    </Form.Field>
    <Form.Field name="subjectIds" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Subjects</Form.Label>
          <MultiSelect
            items={subjects}
            placeholder="Select subjects..."
            bind:value={$formData.subjectIds}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      {#each $formData.subjectIds as subjectId}
        <input type="hidden" name="subjectIds" value={subjectId} />
      {/each}
    </Form.Field>
  </div>
  <Form.Button class="mt-4">Update</Form.Button>
</form>
