<script>
  import GraduationCap from 'lucide-svelte/icons/graduation-cap';

  import * as Avatar from '$lib/components/ui/avatar';
  import * as Card from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table';

  let { data } = $props();
  let { overviews, recentActivities } = $derived(data);
</script>

<div class="grid gap-4 p-4">
  <h2 class="font-medium">Overview</h2>
  <div class="grid gap-4 md:grid-cols-3">
    {#each overviews as overview}
      <Card.Root>
        <Card.Header class="flex-row justify-between">
          <Card.Title class="text-sm">{overview.label}</Card.Title>
          <overview.icon class="size-5 text-muted-foreground" />
        </Card.Header>
        <Card.Content class="text-3xl font-bold"
          >{overview.value.toLocaleString()}</Card.Content
        >
      </Card.Root>
    {/each}
  </div>
  {#if recentActivities != null}
    <Card.Root>
      <Card.Header>
        <Card.Title>Recent Activities</Card.Title>
        <Card.Description>Most recent system activites</Card.Description>
      </Card.Header>
      <Card.Content>
        <Table.Root>
          <Table.Caption></Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.Head>User</Table.Head>
              <Table.Head>Action</Table.Head>
              <Table.Head>Object Type</Table.Head>
              <Table.Head class="text-right">Date</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each recentActivities as activity}
              <Table.Row>
                <Table.Cell>
                  {#if activity.user}
                    <div class="flex gap-2">
                      <Avatar.Root>
                        <Avatar.Image
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <Avatar.Fallback>CN</Avatar.Fallback>
                      </Avatar.Root>
                      <div>
                        <div class="font-semibold">
                          {activity.user.fullName}
                        </div>
                        <div class="capitalize text-muted-foreground">
                          {activity.user.role}
                        </div>
                      </div>
                    </div>
                  {:else}
                    <span class="text-muted-foreground">N/A</span>
                  {/if}
                </Table.Cell>
                <Table.Cell class="capitalize">{activity.action}</Table.Cell>
                <Table.Cell class="capitalize">{activity.objectType}</Table.Cell
                >
                <Table.Cell class="text-right"
                  >{activity.timestamp.toLocaleString()}</Table.Cell
                >
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </Card.Content>
    </Card.Root>
  {/if}
</div>
