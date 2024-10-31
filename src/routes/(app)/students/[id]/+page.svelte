<script>
  import lodash from 'lodash-es';

  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let { data } = $props();
  const { student } = data;
</script>

<div class="grid gap-4 p-4 md:grid-cols-2">
  <div class="space-y-2">
    <Label>First Name</Label>
    <Input value={student.firstName} disabled />
  </div>
  <div class="space-y-2">
    <Label>Last Name</Label>
    <Input value={student.lastName} disabled />
  </div>
  <div class="space-y-2">
    <Label>Sex</Label>
    <Input value={lodash.capitalize(student.sex)} disabled />
  </div>
  <div class="space-y-2">
    <Label>Birth Date</Label>
    <Input value={student.birthDate.toISOString().slice(0, 10)} disabled />
  </div>
  <div class="space-y-2">
    <Label>Email</Label>
    <Input value={student.email} disabled />
  </div>
</div>
