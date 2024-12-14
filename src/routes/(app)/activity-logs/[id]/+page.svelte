<script>
  import ExternalLink from 'lucide-svelte/icons/external-link';
  import lodash from 'lodash-es';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  let { data } = $props();
  const { activityLog } = data;
</script>

<div class="grid gap-4 p-4 md:grid-cols-2">
  <div class="space-y-2">
    <Label>ID</Label>
    <Input value={activityLog.id} disabled />
  </div>
  <div class="space-y-2">
    <Label>User</Label>
    {#if activityLog.user}
      <Button
        href="/users?id={activityLog.user.id}"
        variant="outline"
        class="w-full justify-start font-normal"
      >
        <ExternalLink class="size-4" />
        {activityLog.user.fullName}
      </Button>
    {:else}
      <Input value={'N/A'} disabled />
    {/if}
  </div>
  <div class="space-y-2">
    <Label>Role</Label>
    <Input
      value={activityLog.user
        ? lodash.capitalize(activityLog.user.role)
        : 'N/A'}
      disabled
    />
  </div>
  <div class="space-y-2">
    <Label>Action</Label>
    <Input value={lodash.capitalize(activityLog.action)} disabled />
  </div>
  <div class="space-y-2">
    <Label>Object Type</Label>
    <Input value={lodash.capitalize(activityLog.objectType)} disabled />
  </div>
  <div class="space-y-2">
    <Label>Object ID</Label>
    <Input value={activityLog.objectId} disabled />
  </div>
  <div class="space-y-2">
    <Label>Date</Label>
    <Input value={activityLog.timestamp.toLocaleString()} disabled />
  </div>
</div>
