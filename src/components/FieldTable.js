import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

export default function FieldTable({ fields, deleteField }) {
  const limitField = (value) => value || "-";

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Min</Th>
            <Th>Max</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {fields.map((field, index) => (
            <Tr key={field.id}>
              <Td>{field.name}</Td>
              <Td>{field.type}</Td>
              <Td>{limitField(field.min)}</Td>
              <Td>{limitField(field.max)}</Td>
              <Td>
                <IconButton
                  onClick={() => deleteField(field.id)}
                  colorScheme="red"
                  size="sm"
                  icon={<DeleteIcon />}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
