import { useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import {
  VStack,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  Checkbox,
  Flex,
  Select
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { setCache } from "../utils/cache";
import copy from "copy-to-clipboard";

export default function GenerateFakeData({ fields }) {
  const [exportType, setExportType] = useState("csv");
  const checkboxRef = useRef(null);
  const amountRef = useRef(null);
  const outputRef = useRef(null);
  const modelRef = useRef(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (exportType === "postgre" && !modelRef.current.value) {
      alert("Postgre Model name cannot be empty");
      return;
    }
    if (!fields.length) return "";
    const addId = checkboxRef.current.checked;
    const amount = amountRef.current.value;
    outputRef.current.value = "";
    const randomData = generateData(amount, addId);

    const header = getHeader(randomData[0]);

    setCache("last-output", randomData);

    let output = "";
    if (exportType === "postgre") {
      output = exportPostgreSQL(randomData, header);
    } else {
      output = exportCSV(randomData, addId);
      output = header + output;
    }

    outputRef.current.value = output;
  };

  const getHeader = (data) => {
    return Object.keys(data).reduce(
      (ac, k, i) => ac + (i > 0 ? "," : "") + k,
      ""
    );
  };

  const randomValue = (min, max, decimals = 0) => {
    return Number(Math.random() * max + (min + 1)).toFixed(decimals);
  };

  const exportCSV = (randomData, addId) => {
    if (!randomData.length) return "";
    let csvString = randomData.reduce((acc, curr, index) => {
      let line = addId ? `${index + 1},` : "";

      let i = 0;
      for (const value of Object.values(curr)) {
        let prefix = i < 1 ? "" : ",";
        line = `${line}${prefix}${value}`;
        i++;
      }
      line += "\n";
      return acc + line;
    }, "");
    let csvHeader = Object.keys(randomData[0]).reduce(
      (ac, k, i) => ac + (i > 0 ? "," : "") + k,
      ""
    );
    return csvHeader + "\n" + csvString;
  };

  const generateData = (amount, addId) => {
    const data = [];

    for (let i = 1; i <= amount; i++) {
      const item = fields.reduce((acc, field) => {
        let value = "";
        const { type, min = 0, max = 100 } = field;
        switch (type) {
          case "string":
            value = faker.lorem.words(min < 1 ? 3 : min);
            break;
          case "integer":
            value = randomValue(min, max);
            break;
          case "float":
            value = randomValue(min, max, 3);
            break;
          case "date":
            const operations = ["subtract", "add"];
            const op = operations[Math.round(Math.random())];
            const opDay = randomValue(min, max);
            value = dayjs()[op](opDay, "day").format();
            break;
          case "boolean":
            value = `${Boolean(Math.round(Math.random()))}`;
            break;
          default:
        }
        return {
          ...acc,
          [field.name]: value
        };
      }, {});
      if (addId) item.id = i;
      data.push(item);
    }

    return data;
  };

  const exportPostgreSQL = (randomData, header) => {
    let lines = "";
    const modelName = modelRef.current.value;
    const columns = header
      .split(",")
      .map((k) => `"${k}"`)
      .join(",");

    const template = "INSERT INTO public.$dbModelName($columns) VALUES ($values);"
      .replace("$dbModelName", modelName)
      .replace("$columns", columns);

    for (const data of randomData) {
      let values = Object.values(data).reduce((acc, val, i) => {
        let prefix = i > 0 ? "," : "";
        let value = val;
        if (isNaN(parseInt(val, 10))) {
          value = `'${value}'`;
        }
        return `${acc}${prefix}${value}`;
      }, "");
      const query = template.replace("$values", values);
      lines += (lines.length ? "\n" : "") + query;
    }

    return lines;
  };

  const handleClear = () => {
    outputRef.current.value = "";
  };

  const handleCopy = () => {
    copy(outputRef.current.value);
  };

  return (
    <VStack gap={2} py={4}>
      <Flex justifyContent="space-between" w="full" alignItems="center">
        <Flex gap={2}>
          <Select
            onChange={(e) => setExportType(e.target.value)}
            value={exportType}
            placeholder="Export type"
          >
            <option value="csv">CSV</option>
            <option value="postgre">PostgreSQL</option>
          </Select>

          {exportType === "postgre" && (
            <Input ref={modelRef} placeholder="DB Model name" />
          )}
        </Flex>

        <Flex onSubmit={handleGenerate} gap={2} as="form" alignSelf="flex-end">
          <Checkbox ref={checkboxRef} checkboxRef={checkboxRef}>
            Add Id?
          </Checkbox>

          <NumberInput size="sm">
            <NumberInputField ref={amountRef} placeholder="amount" min={1} />
          </NumberInput>
          <Button size="sm" type="submit">
            Generate
          </Button>
        </Flex>
      </Flex>
      <Textarea rows={10} ref={outputRef} placeholder="output" />
      <Flex alignSelf="flex-end" gap={2}>
        <Button onClick={handleClear} size="sm">
          Clear
        </Button>
        <Button onClick={handleCopy} size="sm" colorScheme="blue">
          Copy
        </Button>
      </Flex>
    </VStack>
  );
}
