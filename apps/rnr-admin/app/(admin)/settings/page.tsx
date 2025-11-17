'use client';

import { PageContainer } from '@/components/layout/page-container';
import { View } from 'react-native';
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'RNR Admin',
    email: 'admin@example.com',
    timezone: 'UTC',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings to API
    // TODO: Implement API call
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageContainer
      title="Settings"
      description="Manage your application settings and preferences"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings' },
      ]}
    >
      <div className="max-w-3xl space-y-6">
        {/* General Settings */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center space-x-3 border-b p-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">General</h3>
              <p className="text-sm text-muted-foreground">
                Basic application settings
              </p>
            </div>
          </div>
          <div className="p-6">
            <View className="space-y-4">
              <View>
                <Text className="mb-2 text-sm font-medium">Company Name</Text>
                <Input
                  placeholder="Enter company name"
                  value={settings.companyName}
                  onChangeText={(text) =>
                    setSettings({ ...settings, companyName: text })
                  }
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">Email</Text>
                <Input
                  placeholder="Enter email"
                  value={settings.email}
                  onChangeText={(text) =>
                    setSettings({ ...settings, email: text })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </div>
        </div>

        {/* Localization */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center space-x-3 border-b p-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Localization</h3>
              <p className="text-sm text-muted-foreground">
                Language and timezone preferences
              </p>
            </div>
          </div>
          <div className="p-6">
            <View className="space-y-4">
              <View>
                <Text className="mb-2 text-sm font-medium">Timezone</Text>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">Language</Text>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
              </View>
            </View>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center space-x-3 border-b p-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      emailNotifications: !settings.emailNotifications,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on your device
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      pushNotifications: !settings.pushNotifications,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.pushNotifications
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.pushNotifications
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Weekly Reports */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summary reports
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      weeklyReports: !settings.weeklyReports,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.weeklyReports ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.weeklyReports
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center space-x-3 border-b p-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">
                Manage your security preferences
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full rounded-lg border bg-background p-4 text-left hover:bg-accent transition-colors">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your password regularly for better security
                </p>
              </button>
              <button className="w-full rounded-lg border bg-background p-4 text-left hover:bg-accent transition-colors">
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </button>
              <button className="w-full rounded-lg border bg-background p-4 text-left hover:bg-accent transition-colors">
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-muted-foreground">
                  View and manage your active sessions
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-4">
            <Text className="text-green-800 dark:text-green-300">
              ✓ Settings saved successfully!
            </Text>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <Button onPress={handleSave} className="flex-1">
            <Text className="text-primary-foreground font-medium">
              Save Changes
            </Text>
          </Button>
          <Button variant="outline" className="flex-1">
            <Text className="font-medium">Reset to Default</Text>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

