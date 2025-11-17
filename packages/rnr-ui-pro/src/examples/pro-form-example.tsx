import React from 'react';
import { View } from 'react-native';
import { ProForm } from '../components/pro-form';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';
import { Textarea } from '@rnr/registry/src/new-york/components/ui/textarea';

/**
 * Example: Basic ProForm usage
 */
export function ProFormExample() {
  const handleSubmit = async (values: any) => {
    console.log('Form values:', values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <View className="p-4">
      <ProForm
        title="Create New Post"
        description="Fill in the form below to create a new post"
        onFinish={handleSubmit}
        initialValues={{
          title: '',
          content: '',
        }}
      >
        <ProForm.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: 'Please enter a title' },
            { min: 5, message: 'Title must be at least 5 characters' },
          ]}
        >
          <Input placeholder="Enter post title" />
        </ProForm.Item>

        <ProForm.Item
          name="content"
          label="Content"
          rules={[
            { required: true, message: 'Please enter content' },
            { min: 20, message: 'Content must be at least 20 characters' },
          ]}
        >
          <Textarea placeholder="Enter post content" />
        </ProForm.Item>

        <ProForm.Item
          name="tags"
          label="Tags"
        >
          <Input placeholder="Enter tags (comma separated)" />
        </ProForm.Item>
      </ProForm>
    </View>
  );
}

