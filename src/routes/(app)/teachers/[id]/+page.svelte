<script>
  import lodash from 'lodash-es';
  import ExternalLink from 'lucide-svelte/icons/external-link';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let { data } = $props();
  const { teacher } = data;
</script>

<div class="grid gap-4 p-4 md:grid-cols-2">
  <div class="space-y-2">
    <Label>First Name</Label>
    <Input value={teacher.firstName} disabled />
  </div>
  <div class="space-y-2">
    <Label>Last Name</Label>
    <Input value={teacher.lastName} disabled />
  </div>
  <div class="space-y-2">
    <Label>Email</Label>
    <Input value={teacher.email} disabled />
  </div>
  <div class="space-y-2">
    <Label>Classrooms</Label>
    <Button
      href="/classrooms?teacherId={teacher.id}"
      variant="outline"
      class="w-full justify-start font-normal"
    >
      <ExternalLink class="size-4" />
      View Details
    </Button>
  </div>
  <div class="space-y-2">
    <Label>Subjects</Label>
    <Button
      href="/subjects?teacherId={teacher.id}"
      variant="outline"
      class="w-full justify-start font-normal"
    >
      <ExternalLink class="size-4" />
      View Details
    </Button>
  </div>
</div>
