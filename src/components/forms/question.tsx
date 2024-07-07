"use client";

import React, { Fragment, useRef, useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuestionsSchema } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";

interface QuestionProps {
    type?: "create" | "edit";
}

const Question = ({ type }: QuestionProps) => {
    const editorRef = useRef<any>(null);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Router

    // For editor dark and light mode
    const { theme } = useTheme();

    const form = useForm<z.infer<typeof QuestionsSchema>>({
        resolver: zodResolver(QuestionsSchema),
        defaultValues: {
            title: "",
            explanation: "",
            tags: [],
        },
    });

    function onSubmit(values: z.infer<typeof QuestionsSchema>) {
        setIsSubmitting(true);

        try {
            // Do something with the form values
        } catch (error) {
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleInputKeyDown(
        e: React.KeyboardEvent<HTMLInputElement>,
        field: any,
    ) {
        if (e.key === "Enter" && field.name === "tags") {
            e.preventDefault();
            const tagInput = e.target as HTMLInputElement;
            const tagValue = tagInput.value.trim();

            // Check if the tags are not empty
            if (tagValue !== "") {
                // Check for tags greater than 15 characters
                if (tagValue.length > 15) {
                    return form.setError("tags", {
                        type: "required",
                        message: "Tag length should be less than 15 characters",
                    });
                }

                // If the tag does not exists, then add it to the tags array
                if (!field.value.includes(tagValue as never)) {
                    form.setValue("tags", [...field.value, tagValue]);
                    tagInput.value = "";
                    form.clearErrors("tags");
                }
            } else {
                form.trigger();
            }
        }
    }

    // Handle tag remove
    const handleTagRemove = (tag: string, field: any) => {
        const newTags = field.value.filter((t: string) => t !== tag);
        form.setValue("tags", newTags);
    };

    console.log(theme)

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex w-full flex-col gap-10"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Question Title
                                <span className="ml-1 text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Be specific and imagine you&apos;re asking a
                                question to another person
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Detailed Explanation of your problem
                                <span className="ml-1 text-primary-500">*</span>
                            </FormLabel>
                            <FormControl className="mt-3.5">
                                <Editor
                                    apiKey={
                                        process.env.NEXT_PUBLIC_TINY_MCE_API_KEY
                                    }
                                    onInit={(evt, editor) => {
                                        editorRef.current = editor;
                                    }}
                                    initialValue=""
                                    init={{
                                        height: 350,
                                        menubar: false,
                                        plugins: [
                                            "advlist",
                                            "autolink",
                                            "lists",
                                            "link",
                                            "image",
                                            "charmap",
                                            "print",
                                            "preview",
                                            "anchor",
                                            "searchreplace",
                                            "visualblocks",
                                            "codesample",
                                            "code",
                                            "fullscreen",
                                            "insertdatetime",
                                            "media",
                                            "table",
                                            "paste",
                                            "code",
                                            "help",
                                            "wordcount",
                                        ],
                                        toolbar:
                                            "undo redo | " +
                                            "codesample | bold italic backcolor | alignleft aligncenter " +
                                            "alignright alignjustify | bullist numlist | " +
                                            "removeformat | help",
                                        content_style:
                                            "body { font-family:Inter; font-size:16px }",
                                        skin:
                                            theme === "dark"
                                                ? "oxide-dark"
                                                : "oxide",
                                    }}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Introduce the problem and expand on what you put
                                in the title. Minimum 20 characters.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Tags
                                <span className="ml-1 text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Fragment>
                                    <Input
                                        placeholder="Add tags..."
                                        className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                                        onKeyDown={(e) => {
                                            handleInputKeyDown(e, field);
                                        }}
                                    />
                                    {/* RENDER THE TAGS ENTERED */}
                                    {field.value.length > 0 && (
                                        <div className="flex-start mt-2.5 gap-2.5">
                                            {field.value.map(
                                                (
                                                    tag: string,
                                                    index: number,
                                                ) => (
                                                    <Badge
                                                        key={`${tag}-${index}`}
                                                        className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                                                        onClick={() =>
                                                            handleTagRemove(
                                                                tag,
                                                                field,
                                                            )
                                                        }
                                                    >
                                                        {tag}
                                                        <Image
                                                            src="/assets/icons/close.svg"
                                                            width={12}
                                                            height={12}
                                                            alt="close icon"
                                                            className="cursor-pointer object-contain invert-0 dark:invert"
                                                        />
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </Fragment>
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Add upto 3 tags to describe what your question
                                is about. You need to enter to add a tag.
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="primary-gradient w-fit !text-light-900"
                >
                    {isSubmitting ? (
                        <Fragment>
                            {type === "edit" ? "Editing" : "Posting..."}
                        </Fragment>
                    ) : (
                        <Fragment>
                            {type === "edit" ? "Edit" : "Ask a Question"}
                        </Fragment>
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default Question;
