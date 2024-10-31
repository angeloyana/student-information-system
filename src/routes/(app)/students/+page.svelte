<script>
  import DataTable from './data-table.svelte';
  import { columns } from './columns';

  let { data } = $props();
  let { students, filter, pageCount, pageSize } = $derived(data);
</script>

<DataTable data={students} {filter} {pageCount} {pageSize} {columns} />
