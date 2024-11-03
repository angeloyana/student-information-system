<script>
  import DataTable from '$lib/components/custom/data-table';
  import { columns } from './columns';

  let { data } = $props();
  let { teachers, columnFilters, pageCount, pageSize } = $derived(data);
</script>

<DataTable data={teachers} {columnFilters} {pageCount} {pageSize} {columns} />
