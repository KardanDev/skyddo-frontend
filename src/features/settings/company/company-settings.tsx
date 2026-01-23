import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Camera, Loader2, Trash2, ShieldAlert } from 'lucide-react'

import {
  useCompanySettings,
  useUpdateCompanySettings,
  useUploadCompanyLogo,
  useDeleteCompanyLogo,
} from '@/hooks/api/use-company-settings'
import { useProfile } from '@/hooks/api/use-profile'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

// Validation schema
const companyFormSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  company_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  company_phone: z.string().optional(),
  company_address: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  tax_id: z.string().optional(),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

export function CompanySettings() {
  const { data: profile } = useProfile()
  const { data: settings, isLoading } = useCompanySettings()
  const updateSettingsMutation = useUpdateCompanySettings()
  const uploadLogoMutation = useUploadCompanyLogo()
  const deleteLogoMutation = useDeleteCompanyLogo()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Check if user is admin
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_user'

  // Company form
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    values: {
      company_name: settings?.company_name || '',
      company_email: settings?.company_email || '',
      company_phone: settings?.company_phone || '',
      company_address: settings?.company_address || '',
      website: settings?.website || '',
      tax_id: settings?.tax_id || '',
      description: settings?.description || '',
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      uploadLogoMutation.mutate(file, {
        onSuccess: () => {
          setSelectedFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        },
      })
    }
  }

  const handleDeleteLogo = () => {
    deleteLogoMutation.mutate()
  }

  const onSubmit = (data: CompanyFormValues) => {
    updateSettingsMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!settings) {
    return null
  }

  return (
    <div className='space-y-6'>
      {/* Admin-only warning */}
      {!isAdmin && (
        <Alert variant='destructive'>
          <ShieldAlert className='h-4 w-4' />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            Only administrators can view and edit company settings. Please contact your
            administrator if you need to make changes to company information.
          </AlertDescription>
        </Alert>
      )}
      {/* Company Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
          <CardDescription>
            Upload your company logo to personalize the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className='flex items-center gap-6'>
          <div className='flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed bg-muted'>
            {settings.logo_url || '/images/skyddo_logo.jpg' ? (
              <img
                src={settings.logo_url || '/images/skyddo_logo.jpg'}
                alt={settings.company_name}
                className='h-full w-full rounded-lg object-contain p-2'
              />
            ) : (
              <Building2 className='h-12 w-12 text-muted-foreground' />
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/jpeg,image/png,image/jpg,image/svg+xml'
              className='hidden'
              onChange={handleFileSelect}
            />
            <Button
              variant='outline'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
              disabled={!isAdmin || uploadLogoMutation.isPending}
            >
              {uploadLogoMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className='mr-2 h-4 w-4' />
                  Upload Logo
                </>
              )}
            </Button>
            {settings.logo_path && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleDeleteLogo}
                disabled={!isAdmin || deleteLogoMutation.isPending}
              >
                {deleteLogoMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Remove Logo
                  </>
                )}
              </Button>
            )}
            <p className='text-xs text-muted-foreground'>
              JPG, PNG, SVG or JPEG. Max size 2MB.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Update your company details displayed throughout the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={companyForm.control}
                name='company_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Skyddo Corretora de Seguros' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={companyForm.control}
                  name='company_email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='info@company.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={companyForm.control}
                  name='company_phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Phone</FormLabel>
                      <FormControl>
                        <Input placeholder='+258 21 32 10 97' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={companyForm.control}
                name='company_address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Rua. Caetano Viegas (Aloe Vera), Nº 34, Maputo, Mozambique'
                        className='resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={companyForm.control}
                  name='website'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          type='url'
                          placeholder='https://www.company.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={companyForm.control}
                  name='tax_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID / NUIT</FormLabel>
                      <FormControl>
                        <Input placeholder='123456789' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={companyForm.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief description of your company...'
                        className='resize-none'
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This description may be used in reports and documents (max 2000 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' disabled={!isAdmin || updateSettingsMutation.isPending}>
                {updateSettingsMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              {!isAdmin && (
                <p className='text-sm text-muted-foreground'>
                  Only administrators can edit company settings
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
