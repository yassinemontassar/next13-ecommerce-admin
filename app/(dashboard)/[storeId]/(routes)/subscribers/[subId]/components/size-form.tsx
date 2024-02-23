"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import {  Subscriber } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";





const formSchema = z.object({
  name: z
  .string()
  .min(1, { message: "This field has to be filled." })
  .email("This is not a valid email.")
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Subscriber | null;
}


export const SizeForm: React.FC<SizeFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Mettre à jour l'abonné" : "Créer un abonné";
  const description = initialData ? "Modifier un abonné" : "Ajouter un abonné";
  const toastMessage = initialData ? "Abonné mis à jour" : "Abonné créé";
  const action = initialData ? "Enregistrer" : "Créer";
  

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
    }
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
      await axios.patch(`/api/${params.storeId}/subscribers/${params.subId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/subscribers`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/subscribers`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      // setLoading(false);
    }
  };


  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/subscribers/${params.subId}`);
      router.refresh();
      router.push(`/${params.storeId}/subscribers`)
      toast.success("Subscriber deleted!")
    } catch (error) {
      toast.error("Make sure you removed all products uisng this size first!");
    } finally {
      // setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between p-1">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-1">

          <div className="grind grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="w-auto" disabled={loading}
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>

        </form>

      </Form>
    

    </>
  );
};