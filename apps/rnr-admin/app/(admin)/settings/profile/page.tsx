'use client';

import { PageContainer } from '@/components/layout/page-container';
import { View } from 'react-native';
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Camera, Mail, Phone, MapPin, Building, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAppStore();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    company: 'RNR Technologies',
    position: user?.role || '',
    bio: 'Passionate about building great products and leading amazing teams.',
    website: 'https://example.com',
    twitter: '@admin',
    linkedin: 'linkedin.com/in/admin',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Update profile via API
    // TODO: Implement API call
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageContainer
      title="Profile"
      description="Manage your personal information and profile"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Profile' },
      ]}
    >
      <div className="max-w-3xl space-y-6">
        {/* Profile Picture */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Upload a new photo</p>
              <p className="text-sm text-muted-foreground mb-3">
                JPG, PNG or GIF (max. 800x800px)
              </p>
              <div className="flex gap-2">
                <button className="rounded-lg border px-4 py-2 text-sm hover:bg-accent transition-colors">
                  Upload
                </button>
                <button className="rounded-lg border px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <View className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <View>
                <Text className="mb-2 text-sm font-medium">Full Name</Text>
                <Input
                  placeholder="Enter your name"
                  value={profile.name}
                  onChangeText={(text) =>
                    setProfile({ ...profile, name: text })
                  }
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">Email</Text>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter your email"
                    value={profile.email}
                    onChangeText={(text) =>
                      setProfile({ ...profile, email: text })
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="pl-10"
                  />
                </div>
              </View>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <View>
                <Text className="mb-2 text-sm font-medium">Phone</Text>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter your phone"
                    value={profile.phone}
                    onChangeText={(text) =>
                      setProfile({ ...profile, phone: text })
                    }
                    keyboardType="phone-pad"
                    className="pl-10"
                  />
                </div>
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">Location</Text>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter your location"
                    value={profile.location}
                    onChangeText={(text) =>
                      setProfile({ ...profile, location: text })
                    }
                    className="pl-10"
                  />
                </div>
              </View>
            </div>

            <View>
              <Text className="mb-2 text-sm font-medium">Bio</Text>
              <Input
                placeholder="Tell us about yourself"
                value={profile.bio}
                onChangeText={(text) => setProfile({ ...profile, bio: text })}
                multiline
                numberOfLines={3}
                className="h-20"
              />
            </View>
          </View>
        </div>

        {/* Professional Information */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
          <View className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <View>
                <Text className="mb-2 text-sm font-medium">Company</Text>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter your company"
                    value={profile.company}
                    onChangeText={(text) =>
                      setProfile({ ...profile, company: text })
                    }
                    className="pl-10"
                  />
                </div>
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">Position</Text>
                <Input
                  placeholder="Enter your position"
                  value={profile.position}
                  onChangeText={(text) =>
                    setProfile({ ...profile, position: text })
                  }
                />
              </View>
            </div>
          </View>
        </div>

        {/* Social Links */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <View className="space-y-4">
            <View>
              <Text className="mb-2 text-sm font-medium">Website</Text>
              <Input
                placeholder="https://example.com"
                value={profile.website}
                onChangeText={(text) =>
                  setProfile({ ...profile, website: text })
                }
                autoCapitalize="none"
              />
            </View>

            <div className="grid gap-4 sm:grid-cols-2">
              <View>
                <Text className="mb-2 text-sm font-medium">Twitter</Text>
                <Input
                  placeholder="@username"
                  value={profile.twitter}
                  onChangeText={(text) =>
                    setProfile({ ...profile, twitter: text })
                  }
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium">LinkedIn</Text>
                <Input
                  placeholder="linkedin.com/in/username"
                  value={profile.linkedin}
                  onChangeText={(text) =>
                    setProfile({ ...profile, linkedin: text })
                  }
                  autoCapitalize="none"
                />
              </View>
            </div>
          </View>
        </div>

        {/* Account Stats */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <Text variant="small">Member Since</Text>
              </div>
              <p className="text-lg font-semibold">January 2024</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <Text variant="small" className="text-muted-foreground mb-1">
                Total Projects
              </Text>
              <p className="text-lg font-semibold">24</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <Text variant="small" className="text-muted-foreground mb-1">
                Completed Tasks
              </Text>
              <p className="text-lg font-semibold">187</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-4">
            <Text className="text-green-800 dark:text-green-300">
              ✓ Profile updated successfully!
            </Text>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <Button onPress={handleSave} className="flex-1">
            <Text className="text-primary-foreground font-medium">
              Save Profile
            </Text>
          </Button>
          <Button variant="outline" className="flex-1">
            <Text className="font-medium">Cancel</Text>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

