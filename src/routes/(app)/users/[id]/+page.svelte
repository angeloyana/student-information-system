<script>
  import lodash from 'lodash-es';

  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let { data } = $props();
  const { user } = data;
</script>

<div class="grid gap-4 p-4 md:grid-cols-2">
  <div class="space-y-2">
    <Label>ID</Label>
    <Input value={user.id} disabled />
  </div>
  <div class="space-y-2">
    <Label>First Name</Label>
    <Input value={user.firstName} disabled />
  </div>
  <div class="space-y-2">
    <Label>Last Name</Label>
    <Input value={user.lastName} disabled />
  </div>
  <div class="space-y-2">
    <Label>Role</Label>
    <Input value={lodash.capitalize(user.role)} disabled />
  </div>
  <div class="space-y-2">
    <Label>Email</Label>
    <Input value={user.email} disabled />
  </div>
</div>
