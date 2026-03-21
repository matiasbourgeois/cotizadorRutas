
import { NumberInput, Text } from '@mantine/core';

const CampoNumerico = ({ form, label, name, description, unidad = " " }) => (
  <NumberInput
    label={label}
    description={description}
    {...form.getInputProps(name)}
    thousandSeparator=","
    decimalScale={2}
    min={0}
    rightSection={<Text fz="xs" c="dimmed">{unidad}</Text>}
    rightSectionWidth={60}
  />
);

export default CampoNumerico;
