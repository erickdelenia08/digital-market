import { cn } from "@/lib/utils"
import Image from "next/image"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "color" | "white"
  withText?: boolean
  iconOnly?: boolean
  icon?: React.ReactNode
  label?: string
  size?: "sm" | "md" | "lg" | number
}

export function Logo({
  variant = "color",
  withText = false,
  iconOnly = false,
  icon,
  label = process.env.NEXT_PUBLIC_APP_NAME || "Acme Inc",
  size = "md",
  className,
  ...props
}: LogoProps) {
  const sizeMap = {
    sm: { container: "h-6", text: "text-sm" },
    md: { container: "h-8", text: "text-base" },
    lg: { container: "h-10", text: "text-xl" },
  }

  const isPresetSize = typeof size === "string" && size in sizeMap
  const currentSize = isPresetSize ? sizeMap[size as keyof typeof sizeMap] : null

  // Base height for the logo
  const height = !isPresetSize ? (typeof size === 'number' ? size : 40) : (size === 'lg' ? 40 : size === 'md' ? 32 : 24)
  const isIcon = iconOnly

  const defaultIcon = (
    <Image
      src={isIcon ? "/logo-icon.svg" : "/logo.svg"}
      alt={label}
      width={!isIcon ? (height * 218 / 40) : height}
      height={height}
      className={cn(
        "h-full w-auto object-contain transition-all",
        variant === "white" ? "brightness-0 invert" : "dark:brightness-0 dark:invert"
      )}
      style={{ width: 'auto' }}
      priority
    />
  )

  return (
    <div
      className={cn("flex items-center gap-2 font-medium tracking-tight", className)}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-center shrink-0",
          currentSize?.container
        )}
        style={!isPresetSize ? { height: size } : undefined}
      >
        {icon || defaultIcon}
      </div>
      {withText && (
        <span
          className={cn(
            variant === "color" ? "text-foreground" : "text-white",
            currentSize?.text
          )}
          style={!isPresetSize ? { fontSize: typeof size === 'number' ? size * 0.6 : undefined } : undefined}
        >
          {label}
        </span>
      )}
    </div>
  )
}
