'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUsers } from '@/lib/mock-data'; // Assuming current user can be fetched or is in context
import type { User } from '@/types';
import { UserCircle, Edit3, Save, ShieldCheck, LogOut, Mail, Phone, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  // Simulate fetching current user. In a real app, this would come from auth context/session.
  // For now, let's assume the first user (manager) if path is /manager, else a rep.
  // This logic is simplistic and needs proper auth context in a real app.
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');


  useEffect(() => {
    // Crude role detection based on URL. Replace with actual auth logic.
    const path = window.location.pathname;
    let userToSet: User | undefined;
    if (path.includes('/manager')) {
      userToSet = mockUsers.find(u => u.role === 'manager');
    } else if (path.includes('/rep')) {
      userToSet = mockUsers.find(u => u.role === 'sales_rep');
    }
    // Fallback if no specific role path, or for a generic /profile
    if (!userToSet) userToSet = mockUsers[0]; 
    
    if (userToSet) {
      setCurrentUser(userToSet);
      setDisplayName(userToSet.displayName);
      setPhoneNumber(userToSet.phoneNumber || '');
      setPhotoUrl(userToSet.photoUrl || 'https://placehold.co/128x128/E0E0E0/B0B0B0&text=?');
    }
  }, []);


  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSaveChanges = () => {
    if (!currentUser) return;
    // Simulate API call to update profile
    console.log("Saving profile:", { displayName, phoneNumber, photoUrl });
    setCurrentUser(prev => prev ? {...prev, displayName, phoneNumber, photoUrl} : null);
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const handleLogout = () => {
    // Simulate logout
    router.push('/login');
  };

  if (!currentUser) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View and manage your account details." icon={UserCircle} />

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary shadow-md">
            <AvatarImage src={photoUrl} alt={currentUser.displayName} data-ai-hint="profile picture" />
            <AvatarFallback className="text-4xl bg-muted-foreground text-background">{getInitials(currentUser.displayName)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline">{currentUser.displayName}</CardTitle>
          <CardDescription className="capitalize text-primary">{currentUser.role.replace('_', ' ')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input id="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://example.com/image.png"/>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex items-center"><Mail className="w-4 h-4 mr-3 text-muted-foreground" />Email: {currentUser.email}</div>
              {currentUser.phoneNumber && <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-muted-foreground" />Phone: {currentUser.phoneNumber}</div>}
              <div className="flex items-center"><Briefcase className="w-4 h-4 mr-3 text-muted-foreground" />Role: <span className="capitalize ml-1">{currentUser.role.replace('_', ' ')}</span></div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-6 border-t">
          <div className="flex gap-3 w-full sm:w-auto">
            {isEditing ? (
              <Button onClick={handleSaveChanges} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            ) : (
              <Button onClick={handleEditToggle} variant="outline" className="w-full sm:w-auto">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
            <Button variant="outline" className="w-full sm:w-auto">
              <ShieldCheck className="mr-2 h-4 w-4" /> Change Password
            </Button>
          </div>
          <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
