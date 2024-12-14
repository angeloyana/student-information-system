<script>
  import DataTable from '$lib/components/custom/data-table';
  import { columns } from './columns';

  let { data } = $props();
  let { activityLogs, columnFilters, pageCount, pageSize } = $derived(data);
</script>

<DataTable
  readOnly={true}
  data={activityLogs}
  {columnFilters}
  {pageCount}
  {pageSize}
  {columns}
/>
