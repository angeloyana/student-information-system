<script>
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';

  import { Input } from '$lib/components/ui/input';
  import * as Form from '$lib/components/ui/form';
  import { generalFormSchema, passwordFormSchema } from './formSchema';

  let { data } = $props();

  const generalForm = superForm(data.generalForm, {
    validators: zodClient(generalFormSchema),
    resetForm: false,
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success(`Successfully saved changes`);
      }
    },
  });
  const passwordForm = superForm(data.passwordForm, {
    validators: zodClient(passwordFormSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success(`Successfully changed password`);
      }
    },
  });

  const { form: generalFormData, enhance: generalFormEnhance } = generalForm;
  const { form: passwordFormData, enhance: passwordFormEnhance } = passwordForm;
</script>

<div class="space-y-6 p-4">
  <section class="space-y-4">
    <h2 class="font-medium">General</h2>
    <form method="POST" action="?/changeGeneral" use:generalFormEnhance>
      <div class="grid gap-4 md:grid-cols-2">
        <Form.Field name="firstName" form={generalForm}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>First Name</Form.Label>
              <Input bind:value={$generalFormData.firstName} {...props} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field name="lastName" form={generalForm}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Last Name</Form.Label>
              <Input bind:value={$generalFormData.lastName} {...props} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field name="email" form={generalForm}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Email</Form.Label>
              <Input bind:value={$generalFormData.email} {...props} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <Form.Button class="mt-4">Save</Form.Button>
    </form>
  </section>
  <section class="space-y-4">
    <h2 class="font-medium">Security</h2>
    <form method="POST" action="?/changePassword" use:passwordFormEnhance>
      <div class="grid gap-4 md:grid-cols-2">
        <Form.Field name="oldPassword" form={passwordForm}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Old Password</Form.Label>
              <Input
                type="password"
                bind:value={$passwordFormData.oldPassword}
                {...props}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field name="newPassword" form={passwordForm}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>New Password</Form.Label>
              <Input
                type="password"
                bind:value={$passwordFormData.newPassword}
                {...props}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field name="confirmNewPassword" form={passwordForm}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Confirm Password</Form.Label>
              <Input
                type="password"
                bind:value={$passwordFormData.confirmNewPassword}
                {...props}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <Form.Button class="mt-4">Change password</Form.Button>
    </form>
  </section>
</div>
