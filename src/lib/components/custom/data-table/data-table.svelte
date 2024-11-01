<script>
  import ChevronDown from 'lucide-svelte/icons/chevron-down';
  import ChevronFirst from 'lucide-svelte/icons/chevron-first';
  import ChevronLast from 'lucide-svelte/icons/chevron-last';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import Plus from 'lucide-svelte/icons/plus';
  import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
  import Trash2 from 'lucide-svelte/icons/trash-2';
  import { toast } from 'svelte-sonner';
  import { getCoreRowModel } from '@tanstack/table-core';

  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
  import { Input } from '$lib/components/ui/input';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Popover from '$lib/components/ui/popover';
  import * as Select from '$lib/components/ui/select';
  import * as Table from '$lib/components/ui/table';

  let {
    columns,
    data,
    columnFilters: initialColumnFilters,
    pageCount,
    pageSize,
    sortId,
    order,
  } = $props();

  let columnFilters = $state(initialColumnFilters);
  let columnVisibility = $state({});
  let pagination = $state({ pageIndex: 0, pageSize });
  let rowSelection = $state({});
  let sorting = $state(
    sortId && order ? [{ id: sortId, desc: order === 'desc' }] : []
  );

  const table = createSvelteTable({
    get data() {
      return data;
    },
    get pageCount() {
      return pageCount;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    getRowId: ({ id }) => id,
    onColumnVisibilityChange: (updater) => {
      if (updater instanceof Function) {
        columnVisibility = updater(columnVisibility);
      } else {
        columnVisibility = updater;
      }
    },
    onColumnFiltersChange: (updater) => {
      if (updater instanceof Function) {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
      reloadData({ keepFocus: true });
      pagination.pageIndex = 0;
    },
    onPaginationChange: (updater) => {
      if (updater instanceof Function) {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
      reloadData();
    },
    onRowSelectionChange: (updater) => {
      if (updater instanceof Function) {
        rowSelection = updater(rowSelection);
      } else {
        rowSelection = updater;
      }
    },
    onSortingChange: (updater) => {
      if (updater instanceof Function) {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
      reloadData();
    },
    state: {
      get columnFilters() {
        return columnFilters;
      },
      get columnVisibility() {
        return columnVisibility;
      },
      get pagination() {
        return pagination;
      },
      get rowSelection() {
        return rowSelection;
      },
      get sorting() {
        return sorting;
      },
    },
  });

  const reloadData = (options) => {
    const query = new URLSearchParams($page.url.searchParams.toString());

    query.set('limit', pagination.pageSize);
    query.set('skip', pagination.pageIndex * pagination.pageSize);

    table.getAllColumns().forEach((column) => {
      if (column.getCanFilter()) {
        const filterValue = column.getFilterValue();
        if (filterValue) {
          query.set(column.id, filterValue);
        } else {
          query.delete(column.id);
        }
      }
    });

    if (sorting[0]) {
      query.set('sort', sorting[0].id);
      query.set('order', sorting[0].desc ? 'desc' : 'asc');
    } else {
      query.delete('sort');
      query.delete('order');
    }

    goto(`?${query.toString()}`, options);
    table.resetRowSelection();
  };

  const handleDeleteSelectionForm = () => {
    return ({ result, update }) => {
      if (result.type !== 'success') {
        toast.error('Something went wrong');
        return;
      }

      toast.success('Selected rows has been deleted');
      table.resetRowSelection();
      update();
    };
  };

  const handleOpenCreateForm = () => {
    goto(`${$page.url.pathname}/create`);
  };
</script>

<div class="grid gap-4 p-4">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <Popover.Root>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>
            <span>Filter by</span>
            <SlidersHorizontal class="size-4" />
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content>
        <div class="grid gap-4">
          {#each table.getAllColumns() as column (column.id)}
            {#if column.getCanFilter()}
              <Input
                placeholder={column.columnDef.meta?.label ||
                  column.columnDef.header}
                value={column.getFilterValue()}
                oninput={(e) => column.setFilterValue(e.target.value)}
              />
            {/if}
          {/each}
        </div>
      </Popover.Content>
    </Popover.Root>
    <div class="flex gap-2">
      <Button size="icon" onclick={handleOpenCreateForm}>
        <Plus class="size-4" />
      </Button>
      <form
        method="POST"
        action="?/delete"
        use:enhance={handleDeleteSelectionForm}
        class="contents"
      >
        {#each Object.keys(rowSelection) as id}
          <input type="hidden" name="id" value={id} />
        {/each}
        <Button
          type="submit"
          variant="destructive"
          disabled={!Object.keys(rowSelection).length}
        >
          <Trash2 class="size-4" />
          <span>Delete</span>
        </Button>
      </form>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button variant="outline" {...props}>
              <span>Columns</span>
              <ChevronDown class="size-4" />
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {#each table.getAllColumns() as column (column.id)}
            {#if column.getCanHide()}
              <DropdownMenu.CheckboxItem
                controlledChecked
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.meta?.label || column.columnDef.header}
              </DropdownMenu.CheckboxItem>
            {/if}
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head>
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.header}
                  context={header.getContext()}
                />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && 'selected'}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender
                content={cell.column.columnDef.cell}
                context={cell.getContext()}
              />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colSpan={columns.length} class="h-24 text-center">
            No result
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
  <div class="flex flex-wrap items-center justify-between">
    <div class="text-muted-foreground">
      Page {pagination.pageIndex + 1} of {pageCount}
    </div>
    <div>
      <Select.Root
        type="single"
        value={pagination.pageSize}
        onValueChange={(value) => table.setPageSize(value)}
      >
        <Select.Trigger class="h-9 w-[70px]">
          {pagination.pageSize}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value={5}>5</Select.Item>
          <Select.Item value={10}>10</Select.Item>
          <Select.Item value={15}>15</Select.Item>
          <Select.Item value={20}>20</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
        class="aspect-square"
      >
        <ChevronFirst class="size-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        class="aspect-square"
      >
        <ChevronLeft class="size-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        class="aspect-square"
      >
        <ChevronRight class="size-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
        class="aspect-square"
      >
        <ChevronLast class="size-4" />
      </Button>
    </div>
  </div>
</div>
