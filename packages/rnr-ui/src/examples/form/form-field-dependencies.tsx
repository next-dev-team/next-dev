import { Form } from '@/rnr-ui/components/ui/forms';
import { TextInput, View } from 'react-native';
import { Button } from '~/components/ui/button';

export function FormFieldDependenciesPreview() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  // Watch for country changes
  const country = Form.useWatch('country', form);

  return (
    <View className="w-full max-w-md">
      <Form form={form} onFinish={onFinish}>
        {/* Country Selection */}
        <Form.Item
          name="country"
          label="Country"
          rules={[{ required: true, message: 'Please select your country' }]}
        >
          <TextInput
            placeholder="Enter your country (e.g., USA, Canada, UK)"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Conditional fields based on country */}
        {country === 'USA' && (
          <Form.Item
            name="ssn"
            label="Social Security Number"
            rules={[
              { required: true, message: 'SSN is required for USA residents' },
              { pattern: /^\d{3}-\d{2}-\d{4}$/, message: 'Please enter a valid SSN (XXX-XX-XXXX)' },
            ]}
          >
            <TextInput
              placeholder="XXX-XX-XXXX"
              className="border-input bg-background text-foreground rounded-md border px-3 py-2"
            />
          </Form.Item>
        )}

        {country === 'Canada' && (
          <Form.Item
            name="sin"
            label="Social Insurance Number"
            rules={[
              { required: true, message: 'SIN is required for Canadian residents' },
              { pattern: /^\d{3}-\d{3}-\d{3}$/, message: 'Please enter a valid SIN (XXX-XXX-XXX)' },
            ]}
          >
            <TextInput
              placeholder="XXX-XXX-XXX"
              className="border-input bg-background text-foreground rounded-md border px-3 py-2"
            />
          </Form.Item>
        )}

        {country === 'UK' && (
          <Form.Item
            name="nino"
            label="National Insurance Number"
            rules={[
              { required: true, message: 'NI Number is required for UK residents' },
              { pattern: /^[A-Z]{2}\d{6}[A-D]$/, message: 'Please enter a valid NI Number' },
            ]}
          >
            <TextInput
              placeholder="XX123456X"
              className="border-input bg-background text-foreground rounded-md border px-3 py-2"
            />
          </Form.Item>
        )}

        {/* Conditional validation */}
        <Form.Item
          name="postalCode"
          label="Postal Code"
          rules={[
            { required: true, message: 'Postal code is required' },
            ...(country === 'USA' ? [
              { pattern: /^\d{5}(-\d{4})?$/, message: 'Please enter a valid US ZIP code' }
            ] : country === 'Canada' ? [
              { pattern: /^[A-Z]\d[A-Z] \d[A-Z]\d$/, message: 'Please enter a valid Canadian postal code' }
            ] : []),
          ]}
        >
          <TextInput
            placeholder={country === 'USA' ? '12345 or 12345-6789' : country === 'Canada' ? 'A1A 1A1' : 'Enter postal code'}
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        <View className="mt-4">
          <Button onPress={() => form.submit()}>Submit Form</Button>
        </View>
      </Form>
    </View>
  );
}