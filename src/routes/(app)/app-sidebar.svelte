<script>
  import Backpack from 'lucide-svelte/icons/backpack';
  import BookType from 'lucide-svelte/icons/book-type';
  import Briefcase from 'lucide-svelte/icons/briefcase';
  import FileClock from 'lucide-svelte/icons/file-clock';
  import Gauge from 'lucide-svelte/icons/gauge';
  import Moon from 'lucide-svelte/icons/moon';
  import Presentation from 'lucide-svelte/icons/presentation';
  import Sun from 'lucide-svelte/icons/sun';
  import TableIcon from 'lucide-svelte/icons/table';
  import Users from 'lucide-svelte/icons/users';
  import { toggleMode } from 'mode-watcher';

  import { Button } from '$lib/components/ui/button';
  import * as Avatar from '$lib/components/ui/avatar';
  import * as Sidebar from '$lib/components/ui/sidebar';

  const routes = [
    {
      title: 'Dashboard',
      pathname: '/dashboard',
      icon: Gauge,
    },
    {
      title: 'Students',
      pathname: '/students',
      icon: Backpack,
    },
    {
      title: 'Teachers',
      pathname: '/teachers',
      icon: Briefcase,
    },
    {
      title: 'Classrooms',
      pathname: '/classrooms',
      icon: Presentation,
    },
    {
      title: 'Subjects',
      pathname: '/subjects',
      icon: BookType,
    },
    {
      title: 'Users',
      pathname: '/users',
      icon: Users,
    },
    {
      title: 'Activity Logs',
      pathname: '/activity-logs',
      icon: FileClock,
    },
  ];
</script>

<Sidebar.Root collapsible="icon">
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg">
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <TableIcon class="size-4" />
          </div>
          <div class="grid leading-tight">
            <span class="truncate text-sm font-semibold"
              >Student Information</span
            >
            <span class="truncate text-xs">System</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onclick={toggleMode}
            class="relative ml-auto size-8 bg-transparent"
          >
            <Sun class="size-4 dark:scale-0" />
            <Moon class="absolute size-4 scale-0 dark:scale-100" />
          </Button>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each routes as route}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={route.pathname} {...props}>
                    <route.icon />
                    <span>{route.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg">
          <Avatar.Root class="size-8 rounded-lg">
            <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
            <Avatar.Fallback>CN</Avatar.Fallback>
          </Avatar.Root>
          <div class="grid leading-tight">
            <span class="truncate text-sm font-semibold">Angelo Yana</span>
            <span class="truncate text-xs">Superuser</span>
          </div>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>
