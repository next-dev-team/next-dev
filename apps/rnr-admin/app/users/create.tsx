import { View } from 'react-native';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormRadio,
  ProFormDigit,
  ProFormSelectMultiple,
  ProFormList,
  ProFormGroup,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSlider,
  ProFormRate,
} from '@rnr/rnr-ui';

export default function UsersCreatePage() {
  const handleFinish = async (values: any) => {
    console.log('Create user:', values);
  };

  return (
    <View className="max-w-2xl w-full">
      <PageContainer title="Create User" subTitle="Add a new user with advanced form fields">
        <ProForm title="" description="" onFinish={handleFinish} layout="vertical">
          
          {/* Basic Information Group */}
          <ProFormGroup title="Basic Information" collapsible={true} collapsed={false}>
            <ProFormText name="name" label="Name" placeholder="Full name" rules={[{ required: true }]} />
            <ProFormText name="email" label="Email" type="email" placeholder="m@example.com" rules={[{ required: true }, { type: 'email' }]} />
            <ProFormText name="password" label="Password" type="password" placeholder="••••••" rules={[{ required: true }, { min: 6 }]} />
            <ProFormDigit name="age" label="Age" placeholder="Age" min={0} max={120} />
          </ProFormGroup>

          {/* Role and Permissions Group */}
          <ProFormGroup title="Role & Permissions" collapsible={true}>
            <ProFormSelect
              name="role"
              label="Role"
              placeholder="Select role"
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'Viewer', value: 'viewer' },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormSelectMultiple
              name="permissions"
              label="Permissions"
              placeholder="Select permissions"
              options={[
                { label: 'Create Posts', value: 'create_posts' },
                { label: 'Edit Posts', value: 'edit_posts' },
                { label: 'Delete Posts', value: 'delete_posts' },
                { label: 'Manage Users', value: 'manage_users' },
                { label: 'View Analytics', value: 'view_analytics' },
                { label: 'Export Data', value: 'export_data' },
              ]}
            />
          </ProFormGroup>

          {/* Account Settings Group */}
          <ProFormGroup title="Account Settings" collapsible={true}>
            <ProFormRadio
              name="status"
              label="Status"
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              rules={[{ required: true }]}
            />
            <ProFormDatePicker
              name="joinDate"
              label="Join Date"
              placeholder="Select join date"
            />
            <ProFormDateRangePicker
              name="membershipPeriod"
              label="Membership Period"
              placeholder={['Start Date', 'End Date']}
            />
          </ProFormGroup>

          {/* Profile Information Group */}
          <ProFormGroup title="Profile Information" collapsible={true}>
            <ProFormTextArea name="bio" label="Bio" placeholder="Short bio" rows={4} maxLength={200} showCount />
            <ProFormSlider
              name="experienceLevel"
              label="Experience Level"
              min={0}
              max={10}
              marks={{
                0: 'Beginner',
                5: 'Intermediate',
                10: 'Expert'
              }}
            />
            <ProFormRate
              name="satisfaction"
              label="Satisfaction Rating"
              count={5}
            />
          </ProFormGroup>

          {/* Contact Information List */}
          <ProFormList
            name="contacts"
            label="Contact Information"
            creatorButtonText="Add Contact"
            deleteButtonText="Remove"
            min={1}
            max={5}
          >
            {(field, index) => (
              <View className="flex-row gap-2">
                <ProFormSelect
                  name={[field.name, 'type']}
                  placeholder="Type"
                  options={[
                    { label: 'Phone', value: 'phone' },
                    { label: 'Email', value: 'email' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Twitter', value: 'twitter' },
                  ]}
                  className="flex-1"
                />
                <ProFormText
                  name={[field.name, 'value']}
                  placeholder="Contact value"
                  className="flex-2"
                />
              </View>
            )}
          </ProFormList>

          {/* Preferences */}
          <ProFormGroup title="Preferences" collapsible={true}>
            <ProFormCheckbox name="agree" text="Agree to terms" rules={[{ required: true }]} />
            <ProFormCheckbox name="notifications" text="Enable email notifications" />
            <ProFormCheckbox name="newsletter" text="Subscribe to newsletter" />
            <ProFormCheckbox name="smsUpdates" text="Allow SMS updates" />
          </ProFormGroup>

        </ProForm>
      </PageContainer>
    </View>
  );
}