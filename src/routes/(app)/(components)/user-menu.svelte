<script>
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import LogOut from 'lucide-svelte/icons/log-out';
  import User from 'lucide-svelte/icons/user';
  import { toast } from 'svelte-sonner';

  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { useSidebar } from '$lib/components/ui/sidebar';
  import * as Avatar from '$lib/components/ui/avatar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Sidebar from '$lib/components/ui/sidebar';

  const sidebar = useSidebar();

  const handleLogout = () => {
    return ({ result }) => {
      goto('/auth/login');
      if (result.type === 'failure') {
        toast.error('You are not logged in yet');
        goto('/auth/login');
        return;
      }

      toast.success('Successfully logged out');
      goto(result.location);
    };
  };
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            {...props}
          >
            <Avatar.Root class="size-8 rounded-lg">
              <Avatar.Image
                src="/default-avatar.png"
                alt={$page.data.user.fullName}
              />
              <Avatar.Fallback
                >{$page.data.user.firstName[0] +
                  $page.data.user.lastName[0]}</Avatar.Fallback
              >
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold"
                >{$page.data.user.fullName}</span
              >
              <span class="truncate text-xs capitalize"
                >{$page.data.user.role}</span
              >
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar.Root class="size-8 rounded-lg">
              <Avatar.Image
                src="/default-avatar.png"
                alt={$page.data.user.fullName}
              />
              <Avatar.Fallback
                >{$page.data.user.firstName[0] +
                  $page.data.user.lastName[0]}</Avatar.Fallback
              >
            </Avatar.Root>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold"
                >{$page.data.user.fullName}</span
              >
              <span class="truncate text-xs capitalize"
                >{$page.data.user.role}</span
              >
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <a href="/account" class="contents">
          <DropdownMenu.Item>
            <User />
            Account
          </DropdownMenu.Item>
        </a>
        <form
          method="POST"
          action="/auth/logout"
          use:enhance={handleLogout}
          class="contents"
        >
          <DropdownMenu.Item class="w-full">
            {#snippet child({ props })}
              <button type="submit" {...props}>
                <LogOut />
                Log out
              </button>
            {/snippet}
          </DropdownMenu.Item>
        </form>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
