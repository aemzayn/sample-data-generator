import { useEffect, useState } from "react";
import { Container, Heading } from "@chakra-ui/react";
import NewField from "./components/NewField";
import FieldTable from "./components/FieldTable";
import GenerateFakeData from "./components/GenerateFakeData";
import { setCache } from "./utils/cache";

export default function App() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fieldsJSON = localStorage.getItem("fake-data-fields");
    if (fieldsJSON !== undefined && fieldsJSON !== null) {
      const parsedFields = JSON.parse(fieldsJSON);
      if (parsedFields && Array.isArray(parsedFields)) {
        setFields(parsedFields);
      }
    }
  }, []);

  function addNewField(field) {
    const newFields = [...fields, field];
    setCache("fake-data-fields", newFields);
    setFields(newFields);
  }

  function deleteField(fieldId) {
    let filteredFields = [];
    if (fieldId) {
      filteredFields = fields.filter(({ id }) => id !== fieldId);
    }

    setFields(filteredFields);
    setCache("fake-data-fields", filteredFields);
  }

  return (
    <Container py={2} maxW="container.lg">
      <Heading>Sample Data Generator</Heading>
      <NewField handleClick={addNewField} />
      <FieldTable fields={fields} deleteField={deleteField} />
      <GenerateFakeData fields={fields} />
    </Container>
  );
}
