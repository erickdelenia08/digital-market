"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import { Loader2, CameraIcon, Trash2Icon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileSchema, ProfileValues } from "@/schemas/settings"
import { updateProfile } from "@/app/actions/settings"
import { getInitials } from "@/lib/user"

export function ProfileForm() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      image: session?.user?.image || "",
    },
  })

  // Using useWatch for better React Compiler compatibility and performance
  const watchedImage = useWatch({
    control: form.control,
    name: "image",
  })
  const watchedName = useWatch({
    control: form.control,
    name: "name",
  })

  // Update form values when session data is available
  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      })
    }
  }, [session, form])

  async function onSubmit(values: ProfileValues) {
    setIsPending(true)
    try {
      const result = await updateProfile(values)
      if (result.success) {
        toast.success(result.success)
        await update({
          ...session?.user,
          name: values.name,
          image: result.imagePath,
        })
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsPending(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        toast.error("Image size must be less than 2MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        form.setValue("image", reader.result as string, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    form.setValue("image", "", { shouldDirty: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function onDelete() {
    toast.error("Account deletion is not implemented in this demo.")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your public profile and account settings.
        </p>
      </div>
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={watchedImage || undefined} alt={watchedName || "Profile Image"} />
                <AvatarFallback className="text-xl">
                  {getInitials(watchedName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Change Image
                  </Button>
                  {watchedImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={removeImage}
                    >
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WebP. Max 2MB.
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="email@example.com" 
                    {...field} 
                    disabled // Email change usually requires verification, keeping disabled for now
                  />
                </FormControl>
                <FormDescription>
                  Your account email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending || !form.formState.isDirty}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update profile
          </Button>
        </form>
      </Form>
      
      <div className="pt-8">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Irreversible and destructive actions for your account.
          </p>
        </div>
        <Separator className="mb-6" />
        
        <div className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-destructive">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Permanently remove your account and all of its contents. This action is not reversible.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger 
              render={<Button variant="destructive" size="sm">Delete Account</Button>}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDelete}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
