<script>
  import DataTable from '$lib/components/custom/data-table';
  import { columns } from './columns';

  let { data } = $props();
  let { subjects, columnFilters, pageCount, pageSize } = $derived(data);
</script>

<DataTable data={subjects} {columnFilters} {pageCount} {pageSize} {columns} />
