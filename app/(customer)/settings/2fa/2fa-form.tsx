"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { updateSettings, generateTwoFactorSetup, enableTwoFactor } from "@/app/actions/auth/settings"
import Image from "next/image"

interface TwoFactorFormProps {
  isTwoFactorEnabled: boolean
}

export function TwoFactorForm({ isTwoFactorEnabled }: TwoFactorFormProps) {
  const [isEnabled, setIsEnabled] = useState(isTwoFactorEnabled)
  const [isLoading, setIsLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  
  const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const onToggle = async (checked: boolean) => {
    if (checked) {
      // Start setup flow
      setIsLoading(true)
      try {
        const result = await generateTwoFactorSetup()
        if (result.error) {
          toast.error(result.error)
          return
        }
        setSetupData({ secret: result.secret!, qrCode: result.qrCode! })
        setShowSetup(true)
      } catch {
        toast.error("Failed to initialize 2FA setup")
      } finally {
        setIsLoading(false)
      }
    } else {
      // Disable 2FA
      setIsLoading(true)
      try {
        const result = await updateSettings({ isTwoFactorEnabled: false })
        if (result.error) {
          toast.error(result.error)
          return
        }
        setIsEnabled(false)
        toast.success("2FA Disabled")
      } catch {
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleVerify = async () => {
    if (!setupData || !verificationCode) return

    setIsVerifying(true)
    try {
      const result = await enableTwoFactor(verificationCode, setupData.secret)
      
      if (result.error) {
        toast.error(result.error)
        return
      }

      setIsEnabled(true)
      setShowSetup(false)
      setSetupData(null)
      setVerificationCode("")
      toast.success("2FA Enabled successfully!")
    } catch {
      toast.error("Verification failed")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <>
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Two-Factor Authentication (TOTP)</Label>
            <p className="text-sm text-muted-foreground">
              Secure your account using an authenticator app (Google Authenticator, Authy, etc.).
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Switch
              checked={isEnabled}
              onCheckedChange={onToggle}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Setup Authenticator App</DialogTitle>
            <DialogDescription>
              Scan the QR code below in your authenticator app to enable 2FA.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            {setupData?.qrCode && (
              <div className="relative h-48 w-48 overflow-hidden rounded-md border bg-white p-2">
                <Image
                  src={setupData.qrCode}
                  alt="2FA QR Code"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            
            <div className="w-full space-y-2">
              <Label htmlFor="secret">Manual Secret</Label>
              <div className="flex gap-2">
                <Input
                  id="secret"
                  value={setupData?.secret || ""}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(setupData?.secret || "")
                    toast.success("Secret copied")
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="w-full space-y-3 flex flex-col items-center">
              <Label htmlFor="code">Verification Code</Label>
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={(value) => setVerificationCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetup(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={isVerifying || verificationCode.length !== 6}>
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
