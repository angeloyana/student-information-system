<script>
  import { page } from '$app/stores';
  import { Separator } from '$lib/components/ui/separator';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import AppSidebar from './(components)/app-sidebar.svelte';

  let { children } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="flex h-16 items-center px-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2">
        <Sidebar.Trigger />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <h1>{$page.data.title}</h1>
      </div>
    </header>
    <div class="flex-1">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
