<script>
  import { superForm } from 'sveltekit-superforms';
  import { toast } from 'svelte-sonner';
  import { zodClient } from 'sveltekit-superforms/adapters';

  import { goto } from '$app/navigation';
  import MultiSelect from '$lib/components/custom/multi-select.svelte';
  import { Input } from '$lib/components/ui/input';
  import * as Form from '$lib/components/ui/form';
  import { formSchema } from '../form-schema';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success(`${form.data.name} has been added`);
        goto('/subjects');
      }
    },
  });

  const { form: formData, enhance } = form;
  const classrooms = data.classrooms.map(({ id, name }) => ({
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
    <Form.Field name="classroomIds" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Classrooms</Form.Label>
          <MultiSelect
            items={classrooms}
            placeholder="Select classrooms..."
            bind:value={$formData.classroomIds}
            {...props}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      {#each $formData.classroomIds as classroomId}
        <input type="hidden" name="classroomIds" value={classroomId} />
      {/each}
    </Form.Field>
    <Form.Field name="teacherIds" {form}>
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Teachers</Form.Label>
          <MultiSelect
            items={teachers}
            placeholder="Select teachers..."
            bind:value={$formData.teacherIds}
            {...props}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
      {#each $formData.teacherIds as teacherId}
        <input type="hidden" name="teacherIds" value={teacherId} />
      {/each}
    </Form.Field>
  </div>
  <Form.Button class="mt-4">Create</Form.Button>
</form>
