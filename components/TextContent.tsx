import React from "react";

interface PreviewProps {
  value: string;
}

const processHTML = (html: string): string => {
  let processedHTML = html;

  // // Replace p tags that only contain br with just br
  // processedHTML = processedHTML.replace(
  //   /<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi,
  //   "<br>"
  // );

  // // Replace p tags that only contain whitespace and br with just br
  // processedHTML = processedHTML.replace(
  //   /<p[^>]*>\s*<br\s*\/?>[\s\u00a0]*<\/p>/gi,
  //   "<br>"
  // );

  // // Replace empty p tags with br
  // processedHTML = processedHTML.replace(/<p[^>]*>\s*<\/p>/gi, "<br>");

  // Replace multiple consecutive br tags with double br (for proper spacing)
  processedHTML = processedHTML.replace(
    /(<br\s*\/?>[\s\u00a0]*){2,}/gi,
    "<br><br>"
  );

  return processedHTML;
};

export const TextContent = ({ value }: PreviewProps) => {
  const processedValue = processHTML(value);

  return (
    <div className="w-full overflow-auto">
      <div
        className="
      [&_h1]:!text-xl [&_h1]:!font-bold [&_h1]:!text-gray-900
      [&_h2]:!text-lg [&_h2]:!font-bold [&_h2]:!text-gray-900
      [&_h3]:!text-base [&_h3]:!font-bold [&_h3]:!text-gray-900
      [&_h4]:!text-base [&_h4]:!font-bold [&_h4]:!text-gray-900
      [&_p]:!text-base [&_p]:!text-[#4B5563] [&_p]:!leading-6
      [&_span]:!text-base [&_span]:!text-[#4B5563] [&_span]:first-letter:!ml-0 [&_span]:before:!content-none
      [&_ul]:!mx-0 [&_ul]:!list-disc  [&_li::marker]:!text-black [&_ul]:!ml-5 
      [&_ol]:!my-1 [&_ol]:!pl-5 [&_ol]:!list-decimal [&_ol]:!ml-5
      [&_li]:!text-base [&_li]:!leading-6 [&_li]:!my-2 [&_li]:!text-[#414B4A] [&_li]:!ml-5
      [&_strong]:!text-black [&_strong]:!font-bold
      [&_em]:!italic [&_em]:!text-gray-700
      [&_hr]:!border-t [&_hr]:!border-gray-200 [&_hr]:!my-4
      [&_blockquote]:!border-l-4 [&_blockquote]:!border-gray-300 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-gray-600 [&_blockquote]:!my-4
      [&_a]:!text-brand [&_a]:!underline [&_a]:!transition-colors [&_a:hover]:!text-brand/80
            [&_iframe]:!max-w-full [&_iframe]:!w-full [&_iframe]:!h-64 sm:[&_iframe]:!h-80 md:[&_iframe]:!h-96 lg:[&_iframe]:!h-[400px] [&_iframe]:!my-6 [&_iframe]:!rounded-[10px] [&_iframe]:!border-0
      [&_figure]:!my-4 [&_figure]:!mx-0
      [&_figure>img]:!rounded-none [&_figure>img]:!border-none
      [&_code]:!block [&_code]:!whitespace-pre-wrap [&_code]:!break-words
    [&_code]:!bg-[#f5f5f5] [&_code]:!p-5 [&_code]:!text-sm [&_code]:!rounded-md
      [&_pre]:!p-0  [&_pre]:!bg-none 
      [&_table]:!border-collapse [&_table]:!w-full [&_table]:!my-4
      [&_th]:!border [&_th]:border-[#4B5563] [&_th]:!px-4 [&_th]:!py-2  [&_th]:!font-bold
      [&_td]:!border [&_td]:border-[#4B5563] [&_td]:!px-4 [&_td]:!py-2 [&_td]:text-[#4B5563]
      [&_tr]:!border [&_tr]:border-[#4B5563]
    "
        dangerouslySetInnerHTML={{ __html: processedValue }}
      />
      <style jsx global>{`
        @media (min-width: 768px) {
          .prose iframe {
            height: 500px !important;
          }
        }
      `}</style>
    </div>
  );
};
