// "use client";

// import { useRef, useState } from "react";
// import { z } from "zod";
// import Image from "next/image";
// import { useTheme } from "next-themes";
// import { useForm } from "react-hook-form";
// import { usePathname } from "next/navigation";
// import { Editor } from "@tinymce/tinymce-react";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { toast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/components/ui/form";

// import { AnswerSchema } from "@/lib/validations";
// import { createAnswer } from "@/lib/actions/answer.action";

// interface AnswerFormProps {
//     question: string;
//     questionId: string;
//     authorId: string;
// }

// const Answer = ({ question, questionId, authorId }: AnswerFormProps) => {
//     const pathname = usePathname();
//     const editorRef = useRef<any>(null);

//     // For editor dark and light mode
//     const { theme } = useTheme();

//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const [isSubmittingAI, setIsSubmittingAI] = useState<boolean>(false);

//     const form = useForm<z.infer<typeof AnswerSchema>>({
//         resolver: zodResolver(AnswerSchema),
//         defaultValues: {
//             answer: "",
//         },
//     });

//     const handleCreateAnswer = async (
//         values: z.infer<typeof AnswerSchema>,
//     ) => {
//         setIsSubmitting(true);

//         try {
//             await createAnswer({
//                 content: values.answer,
//                 author: JSON.parse(authorId),
//             });   
//         } catch (error) {
            
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const generateAIAnswer = async () => {
//         if (!authorId) {
//             return toast({
//                 title: "Please log in",
//                 description: "You must be logged in to perform this action",
//             });
//         }

//         setIsSubmittingAI(true);

//         try {
//             const response = await fetch(
//                 `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
//                 {
//                     method: "POST",
//                     body: JSON.stringify({ question }),
//                 },
//             );

//             const aiAnswer = await response.json();

//             // Convert plain text to HTML format
//             const formattedAnswert = aiAnswer.reply.replace(/\n/g, "<br />");

//             if (editorRef.current) {
//                 const editor = editorRef.current as any;
//                 editor.setContent(formattedAnswert);
//             }

//             // Toast notification
//         } catch (error) {
//             console.error(`❌ ${error} ❌`);
//             throw error;
//         } finally {
//             setIsSubmittingAI(false);
//         }
//     };

//     return (
//         <div className="mt-8">
//             <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
//                 <h4 className="paragraph-semibold text-dark400_light800">
//                     Write your answer here
//                 </h4>

//                 <Button
//                     className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none"
//                     onClick={generateAIAnswer}
//                 >
//                     {isSubmittingAI ? (
//                         <>Generating...</>
//                     ) : (
//                         <>
//                             <Image
//                                 src="/assets/icons/stars.svg"
//                                 alt="star"
//                                 width={12}
//                                 height={12}
//                                 className="object-contain"
//                             />
//                             Generate AI Answer
//                         </>
//                     )}
//                 </Button>
//             </div>
//             <Form {...form}>
//                 <form
//                     className="mt-6 flex w-full flex-col gap-10"
//                     onSubmit={form.handleSubmit(handleCreateAnswer)}
//                 >
//                     <FormField
//                         control={form.control}
//                         name="answer"
//                         render={({ field }) => (
//                             <FormItem className="flex w-full flex-col gap-3">
//                                 {/* Text Editor from https://www.tiny.cloud/ */}
//                                 <FormControl className="mt-3.5">
//                                     <Editor
//                                         apiKey={
//                                             process.env
//                                                 .NEXT_PUBLIC_TINY_EDITOR_API_KEY
//                                         }
//                                         onInit={(evt, editor) => {
//                                             // @ts-ignore
//                                             editorRef.current = editor;
//                                         }}
//                                         onBlur={field.onBlur}
//                                         onEditorChange={(content) =>
//                                             field.onChange(content)
//                                         }
//                                         init={{
//                                             height: 350,
//                                             menubar: false,
//                                             plugins: [
//                                                 "advlist",
//                                                 "autolink",
//                                                 "lists",
//                                                 "link",
//                                                 "image",
//                                                 "charmap",
//                                                 "preview",
//                                                 "anchor",
//                                                 "searchreplace",
//                                                 "visualblocks",
//                                                 "codesample",
//                                                 "fullscreen",
//                                                 "insertdatetime",
//                                                 "media",
//                                                 "table",
//                                             ],
//                                             toolbar:
//                                                 "undo redo | " +
//                                                 "codesample | bold italic forecolor | alignleft aligncenter |" +
//                                                 "alignright alignjustify | bullist numlist",
//                                             content_style:
//                                                 "body { font-family:Inter,sans-serif; font-size:16px }",
//                                             skin:
//                                                 theme === "dark"
//                                                     ? "oxide-dark"
//                                                     : "oxide",
//                                             content_css:
//                                                 theme === "dark" && "dark",
//                                         }}
//                                     />
//                                 </FormControl>
//                                 <FormMessage className="text-red-500" />
//                             </FormItem>
//                         )}
//                     />

//                     <div className="flex justify-end">
//                         <Button
//                             type="submit"
//                             className="primary-gradient w-fit !text-light-900"
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting ? "Submitting..." : "Submit"}
//                         </Button>
//                     </div>
//                 </form>
//             </Form>
//         </div>
//     );
// };

// export default Answer;
