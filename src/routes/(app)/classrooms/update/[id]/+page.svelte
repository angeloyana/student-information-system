<script>
  import { superForm } from 'sveltekit-superforms';
  import { toast } from 'svelte-sonner';
  import { zodClient } from 'sveltekit-superforms/adapters';

  import { goto } from '$app/navigation';
  import Combobox from '$lib/components/custom/combobox.svelte';
  import MultiSelect from '$lib/components/custom/multi-select.svelte';
  import { Input } from '$lib/components/ui/input';
  import * as Form from '$lib/components/ui/form';
  import { formSchema } from '../../form-schema';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success(`${form.data.name} has been updated`);
        goto('/classrooms');
      }
    },
  });

  const { form: formData, enhance } = form;
  const subjects = data.subjects.map(({ id, name }) => ({
    id,
    label: name,
    value: id,
  }));
  const teachers = data.teachers.map(({ id, fullName }) => ({
    id,
    label: fullName,
    value: id,
  }));
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
    <Form.Field name="subjectIds" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Subjects</Form.Label>
          <MultiSelect
            items={subjects}
            placeholder="Select subjects..."
            bind:value={$formData.subjectIds}
            {...props}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      {#each $formData.subjectIds as subjectId}
        <input type="hidden" name="subjectIds" value={subjectId} />
      {/each}
    </Form.Field>
    <Form.Field name="teacherId" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Teacher</Form.Label>
          <Combobox
            items={teachers}
            placeholder="Select teacher..."
            bind:value={$formData.teacherId}
            {...props}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      <input type="hidden" name="teacherId" value={$formData.teacherId} />
    </Form.Field>
  </div>
  <Form.Button class="mt-4">Update</Form.Button>
</form>
