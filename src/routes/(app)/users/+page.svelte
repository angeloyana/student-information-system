<script>
  import DataTable from '$lib/components/custom/data-table';
  import { columns } from './columns';

  let { data } = $props();
  let { users, columnFilters, pageCount, pageSize } = $derived(data);
</script>

<DataTable data={users} {columnFilters} {pageCount} {pageSize} {columns} />
