'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Client, SalesRep } from "@/types";
import { Trash2, PlusCircle } from "lucide-react";

const clientFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  type: z.enum(['hospital_government', 'hospital_private', 'doctor_clinic'], { required_error: "Client type is required" }),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  assignedRepRef: z.string().min(1, "Assigned representative is required"),
  numDoctors: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : parseInt(String(val), 10)),
    z.number().int().positive().optional()
  ),
  influentialPersonnel: z.array(z.object({
    name: z.string().min(1, "Personnel name is required"),
    role: z.string().min(1, "Personnel role is required"),
  })).optional(),
  // numOperationsBySpecialty and location would require more complex inputs
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  client?: Client | null;
  salesReps: SalesRep[];
  onSave: (data: ClientFormData) => void;
  onCancel: () => void;
}

export function ClientForm({ client, salesReps, onSave, onCancel }: ClientFormProps) {
  const { control, register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      clientName: client?.clientName || '',
      type: client?.type || undefined,
      address: client?.address || '',
      phoneNumber: client?.phoneNumber || '',
      email: client?.email || '',
      assignedRepRef: client?.assignedRepRef || '',
      numDoctors: client?.numDoctors || undefined,
      influentialPersonnel: client?.influentialPersonnel || [{ name: '', role: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "influentialPersonnel",
  });

  const onSubmit = (data: ClientFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Input id="clientName" {...register("clientName")} />
        {errors.clientName && <p className="text-sm text-destructive mt-1">{errors.clientName.message}</p>}
      </div>

      <div>
        <Label htmlFor="type">Client Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital_government">Government Hospital</SelectItem>
                <SelectItem value="hospital_private">Private Hospital</SelectItem>
                <SelectItem value="doctor_clinic">Doctor Clinic</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" {...register("address")} />
        {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" {...register("phoneNumber")} />
          {errors.phoneNumber && <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>
      </div>
      
      <div>
        <Label htmlFor="assignedRepRef">Assigned Representative</Label>
         <Controller
          name="assignedRepRef"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="assignedRepRef">
                <SelectValue placeholder="Select representative" />
              </SelectTrigger>
              <SelectContent>
                {salesReps.map(rep => (
                  <SelectItem key={rep.userRef} value={rep.userRef}>
                    {rep.user?.displayName || rep.userRef}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.assignedRepRef && <p className="text-sm text-destructive mt-1">{errors.assignedRepRef.message}</p>}
      </div>

      <div>
          <Label htmlFor="numDoctors">Number of Doctors (for hospitals)</Label>
          <Input id="numDoctors" type="number" {...register("numDoctors")} />
          {errors.numDoctors && <p className="text-sm text-destructive mt-1">{errors.numDoctors.message}</p>}
      </div>
      
      <div>
        <Label>Influential Personnel</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2 mb-2 p-3 border rounded-md">
            <div className="flex-1 space-y-1">
              <Label htmlFor={`influentialPersonnel.${index}.name`} className="text-xs">Name</Label>
              <Input {...register(`influentialPersonnel.${index}.name`)} placeholder="Personnel Name" />
              {errors.influentialPersonnel?.[index]?.name && <p className="text-sm text-destructive mt-1">{errors.influentialPersonnel[index]?.name?.message}</p>}
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor={`influentialPersonnel.${index}.role`} className="text-xs">Role</Label>
              <Input {...register(`influentialPersonnel.${index}.role`)} placeholder="Personnel Role" />
              {errors.influentialPersonnel?.[index]?.role && <p className="text-sm text-destructive mt-1">{errors.influentialPersonnel[index]?.role?.message}</p>}
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', role: '' })}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Personnel
        </Button>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Client</Button>
      </div>
    </form>
  );
}
