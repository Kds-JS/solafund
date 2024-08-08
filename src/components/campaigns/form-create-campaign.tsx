'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { storeFile } from '@/services/ipfs';
import { DateTimePicker } from '@/components/time';
import { toast } from 'react-toastify';

import { useWallet } from '@solana/wallet-adapter-react';
import { createCampaign } from '@/services/programs';
import { SessionContext } from '../wallets/sessions';
import { fileToBase64 } from '@/utils';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Project Title must be at least 2 characters.',
  }),
  orgName: z.string().min(2, {
    message: 'Organization Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Project Description must be at least 10 characters.',
  }),
  link: z.string().url(),
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.',
    ),
  goal: z.coerce.number().gt(0),
  startDate: z.date(),
  endDate: z.date(),
});

export default function FormCreateCampaign() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      orgName: '',
      description: '',
      link: '',
      image: undefined,
      goal: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const currentDate = new Date();

    if (values.startDate.getTime() <= currentDate.getTime()) {
      toast.error('start time is too early');
      return;
    }

    if (values.endDate.getTime() <= values.startDate.getTime()) {
      toast.error('end date must be greater than start date');
      return;
    }

    /**
     * Transform file
     */
    const base64File = await fileToBase64(selectedImage!);
    const mimeType = selectedImage!.type;
    const fileData = {
      fileData: base64File,
      fileName: selectedImage!.name,
      mimeType: mimeType,
    };

    /**
     * Store Image to IPFS
     */
    const { result, errors } = await storeFile(fileData, values.title);
    if (errors) {
      toast.error('failed to store image to IPFS');
      return;
    }
    const imageCID = result!.IpfsHash;

    try {
      const tx = await createCampaign(program!, publicKey!, {
        title: values.title,
        description: values.description,
        org_name: values.orgName,
        project_link: values.link,
        project_image: imageCID,
        goal: values.goal,
        startAt: values.startDate,
        endAt: values.endDate,
      });

      console.log(tx);

      toast.success('campaign created');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Card className="mt-6 rounded-lg border-none">
      <CardContent className="p-6">
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] flex-col items-center justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8 md:w-[500px]"
            >
              <FormField
                control={form.control}
                name="orgName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your organization name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your project title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter project description"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your project description.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project link" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your project link.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Image</FormLabel>
                    <FormControl>
                      <Input
                        name="image"
                        placeholder="Enter project link"
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          setSelectedImage(e.target.files?.[0] || null);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your project image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Goal (SOL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter funding goal"
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormDescription>
                      This is your funding goal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <div>
                        <DateTimePicker onUpdateDate={field.onChange} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your campaign start date.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <div>
                        <DateTimePicker onUpdateDate={field.onChange} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is your campaign end date.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
