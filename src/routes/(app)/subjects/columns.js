import { RowActions, SortButton } from '$lib/components/custom/data-table';
import { Button } from '$lib/components/ui/button';
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
    accessorKey: 'name',
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: 'Name',
        order: column.getIsSorted(),
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: (props) => props.getValue(),
    meta: {
      label: 'Name',
    },
  },
  {
    id: 'classroomName',
    header: 'Classrooms',
    accessorFn: () => '',
    cell: ({ row }) =>
      renderComponent(Button, {
        href: `/classrooms?subjectName=${row.original.name}`,
        variant: 'link',
        class: 'p-0',
        text: 'View Details',
      }),
  },
  {
    id: 'teacherId',
    header: 'Teachers',
    accessorFn: () => '',
    cell: ({ row }) =>
      renderComponent(Button, {
        href: `/teachers?subjectName=${row.original.name}`,
        variant: 'link',
        class: 'p-0',
        text: 'View Details',
      }),
    meta: {
      label: 'Teacher ID',
    },
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
