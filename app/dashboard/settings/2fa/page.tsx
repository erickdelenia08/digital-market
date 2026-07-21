import { auth } from "@/lib/auth"
import { TwoFactorForm } from "./2fa-form"

export default async function TwoFactorPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground">
          Add an extra layer of security to your account.
        </p>
      </div>
      <TwoFactorForm 
        isTwoFactorEnabled={session?.user?.isTwoFactorEnabled || false} 
      />
    </div>
  )
}
