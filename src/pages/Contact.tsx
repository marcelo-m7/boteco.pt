import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Seo from '@/components/Seo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CONTACT_REQUESTS_QUERY_KEY,
  createContactRequest,
  ContactRequestInput,
} from '@/lib/storage/contactRequests';

// Define o esquema de validação com Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }).max(50, {
    message: "O nome não pode ter mais de 50 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido.",
  }),
  phone: z.string().optional(), // Telefone é opcional
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }).max(500, {
    message: "A mensagem não pode ter mais de 500 caracteres.",
  }),
});

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation('contact');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const contactMutation = useMutation({
    mutationFn: async (payload: ContactRequestInput) => createContactRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CONTACT_REQUESTS_QUERY_KEY });
    },
  });
  const isSubmitting = contactMutation.isPending;

  // Inicializa o formulário com react-hook-form e zodResolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Função de submissão do formulário
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await contactMutation.mutateAsync(data);
      toast({
        title: t('form.successMessage'),
        description: "Sua mensagem foi recebida e entraremos em contato em breve.",
        variant: "default",
      });
      form.reset();
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.";
      toast({
        title: t('form.errorMessage'),
        description,
        variant: "destructive",
      });
    }
  };

  const pageTitle = t('title');
  const pageDescription = t('description');

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        ogTitle={pageTitle}
        ogDescription={pageDescription}
        locale={i18n.language}
      />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card
          depth="elevated"
          className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-boteco-primary mb-2">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-lg text-boteco-neutral/90">
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-boteco-neutral">{t('form.nameLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.namePlaceholder')} {...field} className="mt-1" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-boteco-neutral">{t('form.emailLabel')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t('form.emailPlaceholder')} {...field} className="mt-1" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-boteco-neutral">{t('form.phoneLabel')}</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder={t('form.phonePlaceholder')} {...field} className="mt-1" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-boteco-neutral">{t('form.messageLabel')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('form.messagePlaceholder')} rows={5} {...field} className="mt-1" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full active:scale-98 transition-transform duration-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('form.submitting', { defaultValue: 'Enviando...' })}
                    </>
                  ) : (
                    t('form.submitButton')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Contact;