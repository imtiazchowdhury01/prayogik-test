// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Pencil } from "lucide-react";
// import { useEffect, useMemo, useRef, useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Lesson } from "@prisma/client";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { Preview } from "@/components/preview";
// import { Loader } from "lucide-react";
// import JoditEditor, { IJoditEditorProps } from "jodit-react";

// interface LessonDescriptionFormProps {
//   initialData: Lesson;
//   courseId: string;
//   lessonId: string;
// }

// const formSchema = z.object({
//   description: z.string().min(1),
// });

// export const LessonDescriptionForm = ({
//   initialData,
//   courseId,
//   lessonId,
// }: LessonDescriptionFormProps) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [textContent, setTextContent] = useState<string>(
//     initialData.textContent || ""
//   );

//   const editor = useRef(null);

//   const toggleEdit = () => setIsEditing((current) => !current);
//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       description: initialData?.textContent || "",
//     },
//   });

//   const { isSubmitting, isValid } = form.formState;

//   const handleTextContentSubmit = async () => {
//     if (textContent) {
//       setLoading(true);
//       try {
//         const data = {
//           id: lessonId,
//           textContent,
//         };

//         await axios.put(
//           `/api/courses/${courseId}/lessons/${lessonId}/update`,
//           data
//         );
//         router.refresh();
//         toast.success("Content updated successfully");
//         setLoading(false);
//         setIsEditing(false);
//       } catch (error) {
//         console.error("Error updating Content:", error);
//         toast.error("Something went wrong");
//         setLoading(false);
//       }
//     }
//   };
//   // Add custom styles to document head
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = `
//     .jodit-wysiwyg h1 {
//       font-size: 20px !important;
//       font-weight: bold !important;
//       display: block !important;
//     }
//     .jodit-wysiwyg h2 {
//       font-size: 18px !important;
//       font-weight: bold !important;
//       display: block !important;
//     }
//     .jodit-wysiwyg h3 {
//       font-size: 16px !important;
//       font-weight: bold !important;
//       display: block !important;
//     }
//     .jodit-wysiwyg ul {
//       list-style-type: disc !important;
//       margin-left: 1.5em !important;
//       padding-left: 1em !important;
//     }
//     .jodit-wysiwyg ol {
//       list-style-type: decimal !important;
//       margin-left: 1.5em !important;
//       padding-left: 1em !important;
//     }
//     .jodit-wysiwyg li {
//       display: list-item !important;
//       margin-left: 0 !important;
//     }
//     .jodit-wysiwyg ul li {
//       list-style-type: disc !important;
//     }
//     .jodit-wysiwyg ol li {
//       list-style-type: decimal !important;
//     }
//   `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   // Memoize the Jodit config to prevent recreation on every render
//   const joditConfig: IJoditEditorProps["config"] = useMemo(
//     () => ({
//       defaultActionOnPaste: "insert_only_text",
//       removeButtons: ["preview"], // This removes the eye icon
//       askBeforePasteHTML: false,
//       editorStyle: {
//         "font-family": "'Noto Serif Bengali', serif !important",
//       },
//       controls: {
//         font: {
//           list: {
//             "Noto Serif Bengali, serif": "Noto Serif Bengali",
//             "Arial, sans-serif": "Arial",
//             "Times New Roman, serif": "Times New Roman",
//             "Helvetica, sans-serif": "Helvetica",
//             "Georgia, serif": "Georgia",
//             "Verdana, sans-serif": "Verdana",
//           },
//           default: "Noto Serif Bengali",
//         },
//       },
//       style: {
//         fontFamily: "'Noto Serif Bengali', serif",
//         "h1, h2, h3, h4": {
//           display: "block",
//           fontWeight: "bold",
//         },
//         h1: {
//           fontSize: "20px",
//           marginTop: "0.67em",
//           marginBottom: "0.67em",
//         },
//         h2: {
//           fontSize: "18px",
//           marginTop: "0.83em",
//           marginBottom: "0.83em",
//         },
//         h3: {
//           fontSize: "16px",
//           marginTop: "1em",
//           marginBottom: "1em",
//         },
//         h4: {
//           fontSize: "16px",
//           marginTop: "1.33em",
//           marginBottom: "1.33em",
//         },
//         ul: {
//           listStyleType: "disc",
//           marginLeft: "1.5em",
//           paddingLeft: "1em",
//         },
//         ol: {
//           listStyleType: "decimal",
//           marginLeft: "1.5em",
//           paddingLeft: "1em",
//         },
//         li: {
//           display: "list-item",
//         },
//       },
//     }),
//     []
//   );

//   return (
//     <div className="mt-6 border bg-slate-100 rounded-md p-4">
//       <div className="font-medium flex items-center justify-between">
//         <div>Lesson Content</div>
//         <Button onClick={toggleEdit} variant="ghost">
//           {isEditing ? (
//             <>Cancel</>
//           ) : (
//             <>
//               <Pencil className="h-4 w-4 mr-2" />
//               Edit
//             </>
//           )}
//         </Button>
//       </div>
//       {!isEditing && (
//         <div
//           className={cn(
//             "text-sm mt-2",
//             !initialData.textContent && "text-slate-500 italic"
//           )}
//         >
//           {!initialData.textContent && "No Content Found"}
//           {initialData.textContent && (
//             <Preview value={initialData.textContent} />
//           )}
//         </div>
//       )}

//       {isEditing && (
//         <div>
//           <JoditEditor
//             ref={editor}
//             value={textContent}
//             onChange={(value) => setTextContent(value)}
//             config={joditConfig}
//           />
//           <Button
//             disabled={!textContent || isSubmitting || loading}
//             onClick={handleTextContentSubmit}
//             className="mt-2"
//           >
//             {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

//@ts-nocheck
"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";
import { Loader } from "lucide-react";
import JoditEditor, { IJoditEditorProps, Jodit } from "jodit-react";
import { uploadCourseElementToS3 } from "@/actions/upload-aws";

interface LessonDescriptionFormProps {
  initialData: Lesson;
  courseId: string;
  lessonId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const LessonDescriptionForm = ({
  initialData,
  courseId,
  lessonId,
}: LessonDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState<string>(
    initialData.textContent || ""
  );

  const editor = useRef(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.textContent || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleTextContentSubmit = async () => {
    if (textContent) {
      setLoading(true);
      try {
        const data = {
          id: lessonId,
          textContent,
        };

        await axios.put(
          `/api/courses/${courseId}/lessons/${lessonId}/update`,
          data
        );
        router.refresh();
        toast.success("Content updated successfully");
        setLoading(false);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating Content:", error);
        toast.error("Something went wrong");
        setLoading(false);
      }
    }
  };
  // Add custom styles to document head
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .jodit-wysiwyg h1 {
        font-size: 20px !important;
        font-weight: bold !important;
        display: block !important;
      }
      .jodit-wysiwyg h2 {
        font-size: 18px !important;
        font-weight: bold !important;
        display: block !important;
      }
      .jodit-wysiwyg h3 {
        font-size: 16px !important;
        font-weight: bold !important;
        display: block !important;
      }
      .jodit-wysiwyg ul {
        list-style-type: disc !important;
        margin-left: 1.5em !important;
        padding-left: 1em !important;
      }
      .jodit-wysiwyg ol {
        list-style-type: decimal !important;
        margin-left: 1.5em !important;
        padding-left: 1em !important;
      }
      .jodit-wysiwyg li {
        display: list-item !important;
        margin-left: 0 !important;
      }
      .jodit-wysiwyg ul li {
        list-style-type: disc !important;
      }
      .jodit-wysiwyg ol li {
        list-style-type: decimal !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const MAX_FILE_SIZE_BYTES =
    (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

  const uploadFileToS3 = async (file: File, courseId: string) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error("File size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("courseSrc", file);

    // Call the upload function
    const response = await uploadCourseElementToS3(formData, courseId);

    if (!response.success) {
      throw new Error(response.error || "File upload failed");
    }

    return response.url;
  };

  // Configure Jodit upload button
  useEffect(() => {
    Jodit.defaultOptions.controls.uploadImage = {
      name: "Upload image to AWS S3",
      iconURL:
        "https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/683684cb066d7b2001291c4f/avatar/1752637580027-uploadicon.png",
      exec: async (editor) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          // Validate file type
          if (!file.type.match(/image\/(jpeg|png|gif|webp)/)) {
            toast.error("Only JPG, PNG, GIF, and WebP images are allowed");
            return;
          }

          const loadingToast = toast.loading("Uploading image...");

          try {
            const imageUrl = await uploadFileToS3(file, courseId);

            // Insert image into editor
            const img = editor.selection.j.createInside.element("img");
            img.setAttribute("src", imageUrl);
            img.setAttribute("alt", file.name);
            img.setAttribute("style", "max-width: 100%; height: auto;");
            editor.selection.insertNode(img);

            toast.dismiss(loadingToast);
            toast.success("Image uploaded successfully!");
          } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message || "Failed to upload image");
            console.error("Upload error:", error);
          }
        };
      },
    };
  }, [courseId]);

  // Memoize the Jodit config to prevent recreation on every render
  const joditConfig: IJoditEditorProps["config"] = useMemo(
    () => ({
      defaultActionOnPaste: "insert_only_text",
      removeButtons: ["preview"],
      askBeforePasteHTML: false,
      editorStyle: {
        "font-family": "'Noto Serif Bengali', serif !important",
      },
      extraButtons: ["uploadImage"],
      controls: {
        font: {
          list: {
            "Noto Serif Bengali, serif": "Noto Serif Bengali",
            "Arial, sans-serif": "Arial",
            "Times New Roman, serif": "Times New Roman",
            "Helvetica, sans-serif": "Helvetica",
            "Georgia, serif": "Georgia",
            "Verdana, sans-serif": "Verdana",
          },
          default: "Noto Serif Bengali",
        },
      },
      style: {
        fontFamily: "'Noto Serif Bengali', serif",
        "h1, h2, h3, h4": {
          display: "block",
          fontWeight: "bold",
        },
        h1: {
          fontSize: "20px",
          marginTop: "0.67em",
          marginBottom: "0.67em",
        },
        h2: {
          fontSize: "18px",
          marginTop: "0.83em",
          marginBottom: "0.83em",
        },
        h3: {
          fontSize: "16px",
          marginTop: "1em",
          marginBottom: "1em",
        },
        h4: {
          fontSize: "16px",
          marginTop: "1.33em",
          marginBottom: "1.33em",
        },
        ul: {
          listStyleType: "disc",
          marginLeft: "1.5em",
          paddingLeft: "1em",
        },
        ol: {
          listStyleType: "decimal",
          marginLeft: "1.5em",
          paddingLeft: "1em",
        },
        li: {
          display: "list-item",
        },
      },
    }),
    []
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div>Lesson Content</div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.textContent && "text-slate-500 italic"
          )}
        >
          {!initialData.textContent && "No Content Found"}
          {initialData.textContent && (
            <Preview value={initialData.textContent} />
          )}
        </div>
      )}

      {isEditing && (
        <div>
          <JoditEditor
            ref={editor}
            value={textContent}
            onChange={(value) => setTextContent(value)}
            config={joditConfig}
          />
          <Button
            disabled={!textContent || isSubmitting || loading}
            onClick={handleTextContentSubmit}
            className="mt-2"
          >
            {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};
