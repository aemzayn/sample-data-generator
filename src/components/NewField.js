import { useRef } from "react";
import {
  Flex,
  Input,
  NumberInput,
  IconButton,
  Select,
  NumberInputField
} from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";

export default function NewField({ handleClick }) {
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const typeRef = useRef(null);
  const minRef = useRef(null);
  const maxRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const field = {
      id: uuidv4(),
      name: nameRef.current.value,
      type: typeRef.current.value,
      min: minRef.current.value,
      max: maxRef.current.value
    };
    handleClick(field);

    nameRef.current.value = "";
    typeRef.current.value = "";
    minRef.current.value = "";
    maxRef.current.value = "";
  };

  return (
    <Flex onSubmit={onSubmit} py={2} gap={2} ref={formRef} as="form">
      <Input required ref={nameRef} name="name" placeholder="name" />
      <Select required ref={typeRef} name="type" placeholder="Select type">
        <option value="string">String</option>
        <option value="float">Float</option>
        <option value="integer">Integer</option>
        <option value="date">Date</option>
        <option value="boolean">Boolean</option>
      </Select>
      <NumberInput>
        <NumberInputField ref={minRef} placeholder="min" />
      </NumberInput>
      <NumberInput>
        <NumberInputField ref={maxRef} placeholder="max" />
      </NumberInput>
      <IconButton type="submit" colorScheme="blue" icon={<SmallAddIcon />} />
    </Flex>
  );
}
