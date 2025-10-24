"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Globe, Save } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    organization: "",
    bio: ""
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    events: true,
    services: true,
    orders: true,
    marketing: false
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    emailVisible: false,
    phoneVisible: false,
    organizationVisible: true
  })

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Notification preferences saved!")
    } catch (error) {
      toast.error("Failed to save preferences")
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrivacy = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Privacy settings updated!")
    } catch (error) {
      toast.error("Failed to update privacy settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            <div className="space-y-8">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-red-600" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={profileData.organization}
                        onChange={(e) => setProfileData(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="Enter your organization"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} disabled={loading} className="bg-red-600 hover:bg-red-700">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-600" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about updates and activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Event Updates</Label>
                          <p className="text-xs text-gray-600">New events and event changes</p>
                        </div>
                        <Switch
                          checked={notifications.events}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, events: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Service Updates</Label>
                          <p className="text-xs text-gray-600">Service availability and updates</p>
                        </div>
                        <Switch
                          checked={notifications.services}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, services: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Order Updates</Label>
                          <p className="text-xs text-gray-600">Order status and shipping updates</p>
                        </div>
                        <Switch
                          checked={notifications.orders}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, orders: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Marketing</Label>
                          <p className="text-xs text-gray-600">Promotional offers and news</p>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSaveNotifications} disabled={loading} className="bg-red-600 hover:bg-red-700">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control what information is visible to other users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Public Profile</Label>
                        <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                      </div>
                      <Switch
                        checked={privacy.profileVisible}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisible: checked }))}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Email Visibility</Label>
                        <p className="text-sm text-gray-600">Show email address on your profile</p>
                      </div>
                      <Switch
                        checked={privacy.emailVisible}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, emailVisible: checked }))}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Phone Visibility</Label>
                        <p className="text-sm text-gray-600">Show phone number on your profile</p>
                      </div>
                      <Switch
                        checked={privacy.phoneVisible}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, phoneVisible: checked }))}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Organization Visibility</Label>
                        <p className="text-sm text-gray-600">Show organization on your profile</p>
                      </div>
                      <Switch
                        checked={privacy.organizationVisible}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, organizationVisible: checked }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSavePrivacy} disabled={loading} className="bg-red-600 hover:bg-red-700">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Privacy Settings"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
