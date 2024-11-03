<script>
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner';

  import '../app.css';

  let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
{@render children()}
