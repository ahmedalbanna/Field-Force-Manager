
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { SalesRep, User } from "@/types";

const repFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
  photoUrl: z.string().url("Must be a valid URL for photo").optional().or(z.literal('')),
  territory: z.string().min(1, "Territory is required"),
  isActive: z.boolean().default(true),
});

export type RepFormData = z.infer<typeof repFormSchema>;

interface RepFormProps {
  salesRep?: SalesRep | null;
  onSave: (data: RepFormData) => void;
  onCancel: () => void;
}

export function RepForm({ salesRep, onSave, onCancel }: RepFormProps) {
  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RepFormData>({
    resolver: zodResolver(repFormSchema),
    defaultValues: {
      displayName: salesRep?.user?.displayName || '',
      email: salesRep?.user?.email || '',
      photoUrl: salesRep?.user?.photoUrl || '',
      territory: salesRep?.territory || '',
      isActive: salesRep?.user?.isActive === undefined ? true : salesRep.user.isActive,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = (data: RepFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      <div>
        <Label htmlFor="displayName">Display Name</Label>
        <Input id="displayName" {...register("displayName")} />
        {errors.displayName && <p className="text-sm text-destructive mt-1">{errors.displayName.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="photoUrl">Photo URL (Optional)</Label>
        <Input id="photoUrl" {...register("photoUrl")} placeholder="https://example.com/image.png" />
        {errors.photoUrl && <p className="text-sm text-destructive mt-1">{errors.photoUrl.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="territory">Territory</Label>
        <Input id="territory" {...register("territory")} />
        {errors.territory && <p className="text-sm text-destructive mt-1">{errors.territory.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setValue("isActive", checked)}
        />
        <Label htmlFor="isActive">Active Representative</Label>
      </div>
       {errors.isActive && <p className="text-sm text-destructive mt-1">{errors.isActive.message}</p>}


      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Representative</Button>
      </div>
    </form>
  );
}
