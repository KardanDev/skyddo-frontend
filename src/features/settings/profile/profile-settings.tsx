import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Loader2, Trash2, User } from 'lucide-react'

import {
  useProfile,
  useUpdateProfile,
  useUploadProfilePhoto,
  useDeleteProfilePhoto,
  useUpdatePassword,
} from '@/hooks/api/use-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

// Validation schemas
const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
})

const passwordFormSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords don't match",
    path: ['new_password_confirmation'],
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function ProfileSettings() {
  const { data: profile, isLoading } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const uploadPhotoMutation = useUploadProfilePhoto()
  const deletePhotoMutation = useDeleteProfilePhoto()
  const updatePasswordMutation = useUpdatePassword()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      position: profile?.position || '',
      bio: profile?.bio || '',
    },
  })

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      uploadPhotoMutation.mutate(file, {
        onSuccess: () => {
          setSelectedFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        },
      })
    }
  }

  const handleDeletePhoto = () => {
    deletePhotoMutation.mutate()
  }

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data)
  }

  const onPasswordSubmit = (data: PasswordFormValues) => {
    updatePasswordMutation.mutate(data, {
      onSuccess: () => {
        passwordForm.reset()
      },
    })
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className='space-y-6'>
      {/* Profile Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent className='flex items-center gap-6'>
          <Avatar className='h-24 w-24'>
            <AvatarImage src={profile.profile_photo_url || undefined} alt={profile.name} />
            <AvatarFallback className='bg-primary text-primary-foreground text-2xl'>
              {profile.initials}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-2'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/jpeg,image/png,image/jpg'
              className='hidden'
              onChange={handleFileSelect}
            />
            <Button
              variant='outline'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadPhotoMutation.isPending}
            >
              {uploadPhotoMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className='mr-2 h-4 w-4' />
                  Change Photo
                </>
              )}
            </Button>
            {profile.profile_photo_path && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleDeletePhoto}
                disabled={deletePhotoMutation.isPending}
              >
                {deletePhotoMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Remove Photo
                  </>
                )}
              </Button>
            )}
            <p className='text-xs text-muted-foreground'>
              JPG, PNG or JPEG. Max size 2MB.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className='space-y-4'>
              <FormField
                control={profileForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='john@example.com' {...field} />
                    </FormControl>
                    <FormDescription>
                      This email will be used for account notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='+258 84 123 4567' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name='position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position / Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Insurance Agent' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Tell us about yourself...'
                        className='resize-none'
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description about yourself (max 1000 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className='space-y-4'>
              <FormField
                control={passwordForm.control}
                name='current_password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password *</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='••••••••' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name='new_password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password *</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='••••••••' {...field} />
                    </FormControl>
                    <FormDescription>Must be at least 8 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name='new_password_confirmation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password *</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='••••••••' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' disabled={updatePasswordMutation.isPending}>
                {updatePasswordMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
