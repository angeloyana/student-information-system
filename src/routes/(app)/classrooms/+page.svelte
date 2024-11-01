<script>
  import DataTable from '$lib/components/custom/data-table';
  import { columns } from './columns';

  let { data } = $props();
  let { classrooms, columnFilters, pageCount, pageSize } = $derived(data);
</script>

<DataTable data={classrooms} {columnFilters} {pageCount} {pageSize} {columns} />
