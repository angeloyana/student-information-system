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
    accessorKey: 'id',
    header: 'ID',
    cell: (props) => props.getValue(),
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
    id: 'classroomId',
    header: 'Classrooms',
    accessorFn: () => '',
    cell: ({ row }) =>
      renderComponent(Button, {
        href: `/classrooms?subjectId=${row.original.id}`,
        variant: 'link',
        class: 'p-0',
        text: 'View Details',
      }),
    meta: {
      label: 'Classroom ID',
    },
  },
  {
    id: 'teacherId',
    header: 'Teachers',
    accessorFn: () => '',
    cell: ({ row }) =>
      renderComponent(Button, {
        href: `/teachers?subjectId=${row.original.id}`,
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
