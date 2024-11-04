<script>
  import lodash from 'lodash-es';
  import ExternalLink from 'lucide-svelte/icons/external-link';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let { data } = $props();
  const { student } = data;
</script>

<div class="grid gap-4 p-4 md:grid-cols-2">
  <div class="space-y-2">
    <Label>ID</Label>
    <Input value={student.id} disabled />
  </div>
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
  <div class="space-y-2">
    <Label>Classroom</Label>
    <Button
      href="/classrooms?id={student.classroomId}"
      variant="outline"
      disabled={!student.classroomId}
      class="w-full justify-start font-normal"
    >
      {#if student.classroomId}
        <ExternalLink class="size-4" />
        {student.classroom.name}
      {:else}
        N/A
      {/if}
    </Button>
  </div>
</div>
