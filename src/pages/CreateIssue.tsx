import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';
import Seo from '@/components/Seo';

const ISSUE_CATEGORIES = ['bug', 'feature', 'improvement', 'question'] as const;
const ISSUE_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

const issueFormSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  category: z.enum(ISSUE_CATEGORIES, {
    required_error: 'Please select a category.',
  }),
  priority: z.enum(ISSUE_PRIORITIES, {
    required_error: 'Please select a priority.',
  }),
});

type IssueFormValues = z.infer<typeof issueFormSchema>;

interface DraftIssue extends IssueFormValues {
  createdAt: string;
}

const CreateIssue: React.FC = () => {
  const [draftIssue, setDraftIssue] = useState<DraftIssue | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: IssueFormValues) => {
    const draft: DraftIssue = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    setDraftIssue(draft);
  };

  const handleAddInfo = () => {
    if (draftIssue && additionalInfo.trim()) {
      const updatedIssue = {
        ...draftIssue,
        description: `${draftIssue.description}${draftIssue.description.includes('**Additional Information:**') ? '\n\n' : '\n\n**Additional Information:**\n'}${additionalInfo}`,
      };
      setDraftIssue(updatedIssue);
      setAdditionalInfo('');
    }
  };

  const handleReset = () => {
    setDraftIssue(null);
    setAdditionalInfo('');
    form.reset();
  };

  return (
    <>
      <Seo
        title="Create Issue"
        description="Create a new draft issue and add additional information"
        ogTitle="Create Issue"
        ogDescription="Create a new draft issue and add additional information"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-boteco-wine dark:text-boteco-mustard-300">
            Create New Issue
          </h1>
          <p className="text-lg text-boteco-brown/90 dark:text-boteco-beige-200/90">
            Fill out the form below to create a draft issue. You can add more information after creating it.
          </p>
        </div>

        {!draftIssue ? (
          <Card className="shadow-lg border border-boteco-beige dark:border-boteco-brown-700 dark:bg-boteco-brown-800/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-boteco-wine dark:text-boteco-mustard-300">
                <FileText className="h-6 w-6" />
                Issue Details
              </CardTitle>
              <CardDescription className="text-boteco-brown/80 dark:text-boteco-beige-300/80">
                Provide the basic information about your issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-boteco-brown dark:text-boteco-beige-100">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of the issue" {...field} />
                        </FormControl>
                        <FormDescription className="text-boteco-brown/70 dark:text-boteco-beige-300/70">
                          A clear and concise title for your issue
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
                        <FormLabel className="text-boteco-brown dark:text-boteco-beige-100">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the issue..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-boteco-brown/70 dark:text-boteco-beige-300/70">
                          Provide as much detail as possible
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-boteco-brown dark:text-boteco-beige-100">
                            Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bug">Bug</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                              <SelectItem value="improvement">Improvement</SelectItem>
                              <SelectItem value="question">Question</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-boteco-brown/70 dark:text-boteco-beige-300/70">
                            What type of issue is this?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-boteco-brown dark:text-boteco-beige-100">
                            Priority
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-boteco-brown/70 dark:text-boteco-beige-300/70">
                            How urgent is this issue?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-boteco-wine hover:bg-boteco-wine/90 dark:bg-boteco-mustard-600 dark:hover:bg-boteco-mustard-700"
                  >
                    Create Draft Issue
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="shadow-lg border border-boteco-beige dark:border-boteco-brown-700 dark:bg-boteco-brown-800/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-boteco-wine dark:text-boteco-mustard-300">
                  <AlertCircle className="h-6 w-6" />
                  Draft Issue Created
                </CardTitle>
                <CardDescription className="text-boteco-brown/80 dark:text-boteco-beige-300/80">
                  Review your issue and add any additional information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-boteco-brown dark:text-boteco-beige-100">
                    {draftIssue.title}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-boteco-mustard/20 text-boteco-brown dark:bg-boteco-mustard-600/30 dark:text-boteco-beige-100">
                      {draftIssue.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-boteco-wine/20 text-boteco-wine dark:bg-boteco-wine/30 dark:text-boteco-beige-100">
                      {draftIssue.priority}
                    </span>
                  </div>
                </div>

                <div className="border-t border-boteco-beige dark:border-boteco-brown-700 pt-4">
                  <h4 className="font-medium text-sm text-boteco-brown dark:text-boteco-beige-100 mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-boteco-brown/90 dark:text-boteco-beige-200/90 whitespace-pre-wrap">
                    {draftIssue.description}
                  </p>
                </div>

                <div className="border-t border-boteco-beige dark:border-boteco-brown-700 pt-4">
                  <p className="text-xs text-boteco-brown/70 dark:text-boteco-beige-300/70">
                    Created: {new Date(draftIssue.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border border-boteco-beige dark:border-boteco-brown-700 dark:bg-boteco-brown-800/60">
              <CardHeader>
                <CardTitle className="text-boteco-wine dark:text-boteco-mustard-300">
                  Add Additional Information
                </CardTitle>
                <CardDescription className="text-boteco-brown/80 dark:text-boteco-beige-300/80">
                  Do you have any additional details to add to this issue?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="additional-info"
                    className="text-sm font-medium text-boteco-brown dark:text-boteco-beige-100 block mb-2"
                  >
                    Additional Details
                  </label>
                  <Textarea
                    id="additional-info"
                    placeholder="Add any additional information, steps to reproduce, screenshot information, etc..."
                    className="min-h-[120px]"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddInfo}
                    disabled={!additionalInfo.trim()}
                    className="flex-1 bg-boteco-mustard hover:bg-boteco-mustard/90 dark:bg-boteco-mustard-600 dark:hover:bg-boteco-mustard-700"
                  >
                    Add Information
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-boteco-wine text-boteco-wine hover:bg-boteco-wine/10 dark:border-boteco-mustard-600 dark:text-boteco-mustard-300"
                  >
                    Create Another Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateIssue;
