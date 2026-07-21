"use client"

import { forwardRef, useEffect, type ComponentProps } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { slugify } from "@/lib/slug"

interface SlugInputProps extends ComponentProps<typeof Input> {
  sourceName: string
}

export const SlugInput = forwardRef<HTMLInputElement, SlugInputProps>(
  ({ sourceName, ...props }, ref) => {
    const { watch, setValue } = useFormContext()
    
    // Use a subscription for more reliable real-time updates
    useEffect(() => {
      const subscription = watch((value, { name }) => {
        // Automatically sync slug with title
        if (name === sourceName) {
          const sourceValue = value[sourceName]
          if (typeof sourceValue === "string" && props.name) {
            setValue(props.name, slugify(sourceValue), { 
              shouldValidate: true,
              shouldDirty: true 
            })
          }
        }
      })
      return () => subscription.unsubscribe()
    }, [watch, setValue, sourceName, props.name])

    return <Input {...props} ref={ref} />
  }
)

SlugInput.displayName = "SlugInput"
