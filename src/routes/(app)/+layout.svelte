<script>
  import { page } from '$app/stores';
  import { Separator } from '$lib/components/ui/separator';
  import { Toaster } from '$lib/components/ui/sonner';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import AppSidebar from './app-sidebar.svelte';

  let { children } = $props();
</script>

<Toaster />
<Sidebar.Provider>
  <AppSidebar />
  <main class="flex-1">
    <header
      class="flex h-16 items-center px-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2">
        <Sidebar.Trigger />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <h1>{$page.data.title}</h1>
      </div>
    </header>
    {@render children?.()}
  </main>
</Sidebar.Provider>
