
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PromotionalMaterial, Manufacturer } from "@/types";
import { mockManufacturers } from "@/lib/mock-data";

const materialFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(['catalog', 'brochure', 'image', 'video'], { required_error: "Material type is required" }),
  fileUrl: z.string().url("Must be a valid URL").min(1, "File URL is required"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  manufacturerRef: z.string().min(1, "Manufacturer is required"),
});

export type MaterialFormData = z.infer<typeof materialFormSchema>;

interface MaterialFormProps {
  material?: PromotionalMaterial | null;
  onSave: (data: MaterialFormData) => void;
  onCancel: () => void;
}

export function MaterialForm({ material, onSave, onCancel }: MaterialFormProps) {
  const { control, register, handleSubmit, formState: { errors } } = useForm<MaterialFormData>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      title: material?.title || '',
      description: material?.description || '',
      type: material?.type || undefined,
      fileUrl: material?.fileUrl || '',
      thumbnailUrl: material?.thumbnailUrl || '',
      manufacturerRef: material?.manufacturerRef || '',
    },
  });

  const onSubmit = (data: MaterialFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="type">Material Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="catalog">Catalog</SelectItem>
                <SelectItem value="brochure">Brochure</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
      </div>

      <div>
        <Label htmlFor="fileUrl">File URL</Label>
        <Input id="fileUrl" {...register("fileUrl")} placeholder="https://example.com/document.pdf" />
        {errors.fileUrl && <p className="text-sm text-destructive mt-1">{errors.fileUrl.message}</p>}
      </div>

      <div>
        <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
        <Input id="thumbnailUrl" {...register("thumbnailUrl")} placeholder="https://example.com/thumbnail.jpg" />
        {errors.thumbnailUrl && <p className="text-sm text-destructive mt-1">{errors.thumbnailUrl.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="manufacturerRef">Manufacturer</Label>
         <Controller
          name="manufacturerRef"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="manufacturerRef">
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {mockManufacturers.map(manu => (
                  <SelectItem key={manu.manufacturerId} value={manu.manufacturerId}>
                    {manu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.manufacturerRef && <p className="text-sm text-destructive mt-1">{errors.manufacturerRef.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Material</Button>
      </div>
    </form>
  );
}
