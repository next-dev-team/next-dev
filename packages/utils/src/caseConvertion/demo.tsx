import caseConversion from '.';

export default function Demo() {
  const input = {
    last_name: 'Doe',
    last_name_new: 'Doe',
  };

  const ex1 = caseConversion(input, 'camelCase');
  const ex2 = caseConversion(input, 'snakeCase');
  const output = JSON.stringify(ex1, null, 2);
  const output2 = JSON.stringify(ex2, null, 2);

  return (
    <>
      <p>Case to camel: {output}</p>
      <p>Case to snake: {output2}</p>
    </>
  );
}
