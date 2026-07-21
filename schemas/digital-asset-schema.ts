import { z } from "zod";

export const digitalAssetSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["FILE", "LINK"]),
    fileUrl: z.string().optional(),
    linkUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.type === "LINK") {
        return !!data.linkUrl && data.linkUrl.length > 0;
      }
      return true; // FILE upload logic will be handled manually via base64 or fileUrl presence
    },
    {
      message: "Link URL is required when type is LINK",
      path: ["linkUrl"],
    }
  );

export type DigitalAssetInput = z.infer<typeof digitalAssetSchema>;
