
import { Table, UnstyledButton, Group, Text, Center } from '@mantine/core';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function SortableTableHeader({ children, sorted, reversed, onSort }) {
  const Icon = sorted
    ? (reversed ? ArrowDown : ArrowUp)
    : ArrowUpDown;

  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between" gap="xs" wrap="nowrap">
          <Text fw={500} fz="sm">{children}</Text>
          <Center>
            <Icon size={14} strokeWidth={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
