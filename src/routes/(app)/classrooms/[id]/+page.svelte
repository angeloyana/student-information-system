<script>
  import ExternalLink from 'lucide-svelte/icons/external-link';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let { data } = $props();
  const { classroom } = data;
</script>

<div class="grid gap-4 p-4 md:grid-cols-2">
  <div class="space-y-2">
    <Label>Name</Label>
    <Input value={classroom.name} disabled />
  </div>
  <div class="space-y-2">
    <Label>Students</Label>
    <Button
      href="/students?classroomName={classroom.name}"
      variant="outline"
      class="w-full justify-start font-normal"
    >
      <ExternalLink class="size-4" />
      View Details
    </Button>
  </div>
</div>
