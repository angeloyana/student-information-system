import { SortButton } from '$lib/components/custom/data-table';
import { Button } from '$lib/components/ui/button';
import { Checkbox } from '$lib/components/ui/checkbox';
import { renderComponent } from '$lib/components/ui/data-table';
import RowActions from './(components)/data-table-row-actions.svelte';

export const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (props) => props.getValue(),
  },
  {
    id: 'userId',
    accessorKey: 'user.fullName',
    header: 'User',
    cell: (props) => {
      const userName = props.getValue();
      if (!userName) return 'N/A';

      return renderComponent(Button, {
        href: `/users?id=${props.row.original.userId}`,
        variant: 'link',
        class: 'p-0',
        text: userName,
      });
    },
    meta: {
      label: 'User ID',
    },
  },
  {
    id: 'userRole',
    accessorKey: 'user.role',
    header: 'Role',
    cell: (props) => {
      const userRole = props.getValue();
      if (!userRole) return 'N/A';
      return userRole;
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: 'objectType',
    header: 'Object Type',
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: 'objectId',
    header: 'Object ID',
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: 'Date',
        order: column.getIsSorted(),
        onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }),
    cell: (props) => props.getValue().toLocaleString(),
    meta: {
      label: 'Date',
    },
    enableColumnFilter: false,
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
