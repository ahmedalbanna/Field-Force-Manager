
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, Manufacturer } from "@/types";
import { mockManufacturers } from "@/lib/mock-data";
import { Trash2, PlusCircle } from "lucide-react";

const productFormSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive("Price must be a positive number")
  ),
  currency: z.string().min(3, "Currency code is required (e.g., USD)").default("USD"),
  manufacturerRef: z.string().min(1, "Manufacturer is required"),
  marketAnalysis: z.object({
    casesPerHospitalAnnually: z.string().optional().describe("JSON format: {\"client1\": 20, \"client2\": 30}"), // Storing as JSON string for simplicity
    competitors: z.array(z.object({
      name: z.string().min(1, "Competitor name is required"),
      price: z.string().min(1, "Competitor price is required"),
    })).optional(),
    otherNotes: z.string().optional(),
  }).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSave: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { control, register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: product?.productName || '',
      description: product?.description || '',
      price: product?.price || 0,
      currency: product?.currency || 'USD',
      manufacturerRef: product?.manufacturerRef || '',
      marketAnalysis: {
        casesPerHospitalAnnually: product?.marketAnalysis?.casesPerHospitalAnnually 
          ? JSON.stringify(product.marketAnalysis.casesPerHospitalAnnually) 
          : '',
        competitors: product?.marketAnalysis?.competitors || [{ name: '', price: '' }],
        otherNotes: product?.marketAnalysis?.otherNotes || '',
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "marketAnalysis.competitors",
  });

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input id="productName" {...register("productName")} />
        {errors.productName && <p className="text-sm text-destructive mt-1">{errors.productName.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" {...register("currency")} defaultValue="USD" />
          {errors.currency && <p className="text-sm text-destructive mt-1">{errors.currency.message}</p>}
        </div>
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

      <fieldset className="border p-4 rounded-md space-y-4">
        <legend className="text-sm font-medium px-1">Market Analysis (Optional)</legend>
        <div>
          <Label htmlFor="marketAnalysis.casesPerHospitalAnnually">Cases Per Hospital Annually (JSON format)</Label>
          <Textarea id="marketAnalysis.casesPerHospitalAnnually" {...register("marketAnalysis.casesPerHospitalAnnually")} placeholder='e.g., {"client1": 20, "client2": 30}' />
          {errors.marketAnalysis?.casesPerHospitalAnnually && <p className="text-sm text-destructive mt-1">{errors.marketAnalysis.casesPerHospitalAnnually.message}</p>}
        </div>
        <div>
          <Label>Competitors</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2 mb-2 p-3 border rounded-md">
              <div className="flex-1 space-y-1">
                <Label htmlFor={`marketAnalysis.competitors.${index}.name`} className="text-xs">Name</Label>
                <Input {...register(`marketAnalysis.competitors.${index}.name`)} placeholder="Competitor Name" />
                {errors.marketAnalysis?.competitors?.[index]?.name && <p className="text-sm text-destructive mt-1">{errors.marketAnalysis.competitors[index]?.name?.message}</p>}
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor={`marketAnalysis.competitors.${index}.price`} className="text-xs">Price</Label>
                <Input {...register(`marketAnalysis.competitors.${index}.price`)} placeholder="Competitor Price" />
                 {errors.marketAnalysis?.competitors?.[index]?.price && <p className="text-sm text-destructive mt-1">{errors.marketAnalysis.competitors[index]?.price?.message}</p>}
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', price: '' })}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add Competitor
          </Button>
        </div>
         <div>
          <Label htmlFor="marketAnalysis.otherNotes">Other Notes</Label>
          <Textarea id="marketAnalysis.otherNotes" {...register("marketAnalysis.otherNotes")} />
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  );
}

