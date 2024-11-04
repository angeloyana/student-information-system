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
    id: 'studentId',
    header: 'Students',
    accessorFn: () => '',
    cell: ({ row }) =>
      renderComponent(Button, {
        href: `/students?classroomId=${row.original.id}`,
        variant: 'link',
        class: 'p-0',
        text: 'View Details',
      }),
    meta: {
      label: 'Student ID',
    },
  },
  {
    id: 'subjectId',
    header: 'Subjects',
    accessorFn: () => '',
    cell: ({ row }) =>
      renderComponent(Button, {
        href: `/subjects?classroomId=${row.original.id}`,
        variant: 'link',
        class: 'p-0',
        text: 'View Details',
      }),
    meta: {
      label: 'Subject ID',
    },
  },
  {
    id: 'teacherId',
    accessorKey: 'teacher.fullName',
    header: 'Teacher',
    cell: (props) => {
      const teacherName = props.getValue();
      if (!teacherName) return 'N/A';

      return renderComponent(Button, {
        href: `/teachers?id=${props.row.original.teacherId}`,
        variant: 'link',
        class: 'p-0',
        text: teacherName,
      });
    },
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
