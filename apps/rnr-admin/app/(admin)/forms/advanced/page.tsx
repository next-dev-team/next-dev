'use client';

import { PageContainer } from '@/components/layout/page-container';
import { View } from 'react-native';
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface DynamicField {
  id: string;
  key: string;
  value: string;
}

export default function AdvancedFormPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    tags: '',
    startDate: '',
    endDate: '',
    assignee: '',
    budget: '',
  });

  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const addDynamicField = () => {
    setDynamicFields([
      ...dynamicFields,
      { id: Date.now().toString(), key: '', value: '' },
    ]);
  };

  const removeDynamicField = (id: string) => {
    setDynamicFields(dynamicFields.filter((field) => field.id !== id));
  };

  const updateDynamicField = (
    id: string,
    type: 'key' | 'value',
    text: string
  ) => {
    setDynamicFields(
      dynamicFields.map((field) =>
        field.id === id ? { ...field, [type]: text } : field
      )
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = 'Budget must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Form submitted successfully
      // TODO: Send to API with formData and dynamicFields
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <PageContainer
      title="Advanced Form"
      description="Complex form with dynamic fields and multiple sections"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Forms', href: '/forms' },
        { title: 'Advanced Form' },
      ]}
    >
      <div className="max-w-4xl space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <View className="space-y-4">
            <View>
              <Text className="mb-2 text-sm font-medium">
                Title <Text className="text-destructive">*</Text>
              </Text>
              <Input
                placeholder="Enter title"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
              {errors.title && (
                <Text variant="small" className="text-destructive mt-1">
                  {errors.title}
                </Text>
              )}
            </View>

            <View>
              <Text className="mb-2 text-sm font-medium">
                Description <Text className="text-destructive">*</Text>
              </Text>
              <Input
                placeholder="Enter description"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
                numberOfLines={4}
                className="h-24"
              />
              {errors.description && (
                <Text variant="small" className="text-destructive mt-1">
                  {errors.description}
                </Text>
              )}
            </View>

            <div className="grid gap-4 sm:grid-cols-2">
              <View>
                <Text className="mb-2 text-sm font-medium">Category</Text>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="general">General</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                </select>
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">Priority</Text>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </View>
            </div>
          </View>
        </div>

        {/* Project Details */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Project Details</h3>
          <View className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <View>
                <Text className="mb-2 text-sm font-medium">Start Date</Text>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={formData.startDate}
                  onChangeText={(text) =>
                    setFormData({ ...formData, startDate: text })
                  }
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">End Date</Text>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={formData.endDate}
                  onChangeText={(text) =>
                    setFormData({ ...formData, endDate: text })
                  }
                />
              </View>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <View>
                <Text className="mb-2 text-sm font-medium">Assignee</Text>
                <Input
                  placeholder="Enter assignee name"
                  value={formData.assignee}
                  onChangeText={(text) =>
                    setFormData({ ...formData, assignee: text })
                  }
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">Budget ($)</Text>
                <Input
                  placeholder="Enter budget"
                  value={formData.budget}
                  onChangeText={(text) =>
                    setFormData({ ...formData, budget: text })
                  }
                  keyboardType="numeric"
                />
                {errors.budget && (
                  <Text variant="small" className="text-destructive mt-1">
                    {errors.budget}
                  </Text>
                )}
              </View>
            </div>

            <View>
              <Text className="mb-2 text-sm font-medium">Tags</Text>
              <Input
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChangeText={(text) => setFormData({ ...formData, tags: text })}
              />
              <Text variant="small" className="text-muted-foreground mt-1">
                Separate tags with commas
              </Text>
            </View>
          </View>
        </div>

        {/* Dynamic Custom Fields */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Custom Fields</h3>
            <button
              onClick={addDynamicField}
              className="flex items-center space-x-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Field</span>
            </button>
          </div>

          <View className="space-y-3">
            {dynamicFields.length === 0 && (
              <Text className="text-muted-foreground text-sm text-center py-8">
                {`No custom fields added. Click "Add Field" to create one.`}
              </Text>
            )}

            {dynamicFields.map((field) => (
              <div key={field.id} className="flex items-center gap-3">
                <Input
                  placeholder="Field name"
                  value={field.key}
                  onChangeText={(text) =>
                    updateDynamicField(field.id, 'key', text)
                  }
                  className="flex-1"
                />
                <Input
                  placeholder="Field value"
                  value={field.value}
                  onChangeText={(text) =>
                    updateDynamicField(field.id, 'value', text)
                  }
                  className="flex-1"
                />
                <button
                  onClick={() => removeDynamicField(field.id)}
                  className="rounded-lg p-2 hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </View>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-4">
            <Text className="text-green-800 dark:text-green-300">
              ✓ Advanced form submitted successfully!
            </Text>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center gap-3">
          <Button onPress={handleSubmit} className="flex-1">
            <Text className="text-primary-foreground font-medium">
              Submit Form
            </Text>
          </Button>
          <Button variant="outline" className="flex-1">
            <Text className="font-medium">Save Draft</Text>
          </Button>
          <Button
            variant="ghost"
            onPress={() => {
              setFormData({
                title: '',
                description: '',
                category: 'general',
                priority: 'medium',
                tags: '',
                startDate: '',
                endDate: '',
                assignee: '',
                budget: '',
              });
              setDynamicFields([]);
              setErrors({});
            }}
          >
            <Text className="font-medium">Reset</Text>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

