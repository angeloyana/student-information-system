<script>
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';

  import { goto } from '$app/navigation';
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { formSchema } from './form-schema';

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Successfully logged in');
        goto('/dashboard');
      }
    },
  });

  const { form: formData, enhance } = form;
</script>

<div class="flex h-full items-center justify-center">
  <Card.Root>
    <Card.Header>
      <Card.Title>Login</Card.Title>
      <Card.Description>Enter your email and password to login</Card.Description
      >
    </Card.Header>
    <Card.Content>
      <form method="POST" class="grid gap-2" use:enhance>
        <Form.Field name="email" {form}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Email</Form.Label>
              <Input type="email" bind:value={$formData.email} {...props} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field name="password" {form}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Password</Form.Label>
              <Input
                type="password"
                bind:value={$formData.password}
                {...props}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button>Login</Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
