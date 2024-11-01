<script>
  import DataTable from '$lib/components/custom/data-table';
  import { columns } from './columns';

  let { data } = $props();
  let { students, columnFilters, pageCount, pageSize } = $derived(data);
</script>

<DataTable data={students} {columnFilters} {pageCount} {pageSize} {columns} />
