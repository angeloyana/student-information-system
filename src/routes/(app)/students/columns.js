import { RowActions, SortButton } from '$lib/components/custom/data-table';
import { Checkbox } from '$lib/components/ui/checkbox';
import { renderComponent } from '$lib/components/ui/data-table';

export const columns = [
  {
    id: 'select',
    header: ({ table }) =>
      renderComponent(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        controlledChecked: true,
      }),
    cell: ({ row }) =>
      renderComponent(Checkbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        controlledChecked: true,
      }),
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: 'First Name',
        order: column.getIsSorted(),
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: (props) => props.getValue(),
    meta: {
      label: 'First Name',
    },
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: 'Last Name',
        order: column.getIsSorted(),
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: (props) => props.getValue(),
    meta: {
      label: 'Last Name',
    },
  },
  {
    accessorKey: 'sex',
    header: 'Sex',
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: 'birthDate',
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: 'Birth Date',
        order: column.getIsSorted(),
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: (props) => props.getValue().toISOString().slice(0, 10),
    meta: {
      label: 'Birth Date',
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (props) => props.getValue(),
  },
  {
    id: 'actions',
    header: '',
    cell: (props) =>
      renderComponent(RowActions, {
        rowData: props.row.original,
      }),
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
  },
];
