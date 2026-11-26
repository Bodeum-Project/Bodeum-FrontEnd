import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type AiMarkdownProps = {
  children: string;
};

const markdownComponents: Components = {
  a: ({ children, href }) => {
    if (!href) return <>{children}</>;

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand underline underline-offset-2"
      >
        {children}
      </a>
    );
  },
  img: ({ alt }) => (alt ? <span>{alt}</span> : null),
};

export default function AiMarkdown({ children }: AiMarkdownProps) {
  return (
    <div
      className="w-full min-w-0 break-words text-h3-onboard text-primary
        [&_p]:whitespace-pre-wrap [&_p:not(:first-child)]:mt-[10px]
        [&_h1]:text-h3-category [&_h2]:text-h3-category-sub
        [&_h3]:text-h3-category-sub [&_h4]:font-medium [&_h5]:font-medium
        [&_h6]:font-medium [&_h1:not(:first-child)]:mt-[14px]
        [&_h2:not(:first-child)]:mt-[14px] [&_h3:not(:first-child)]:mt-[12px]
        [&_h4:not(:first-child)]:mt-[12px] [&_h5:not(:first-child)]:mt-[12px]
        [&_h6:not(:first-child)]:mt-[12px] [&_ul]:my-[8px] [&_ul]:list-disc
        [&_ul]:pl-[22px] [&_ol]:my-[8px] [&_ol]:list-decimal [&_ol]:pl-[22px]
        [&_li+li]:mt-[4px] [&_li>p]:mt-0 [&_blockquote]:my-[10px]
        [&_blockquote]:border-l-[3px] [&_blockquote]:border-brand-muted
        [&_blockquote]:pl-[12px] [&_blockquote]:text-secondary
        [&_code]:rounded-[4px] [&_code]:bg-surface-subtle [&_code]:px-[4px]
        [&_code]:py-[1px] [&_pre]:my-[10px] [&_pre]:overflow-x-auto
        [&_pre]:rounded-sm [&_pre]:bg-surface-subtle [&_pre]:p-[12px]
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_hr]:my-[12px]
        [&_hr]:border-default [&_table]:my-[10px] [&_table]:w-full
        [&_table]:border-collapse [&_th]:border [&_th]:border-default
        [&_th]:bg-surface-subtle [&_th]:px-[8px] [&_th]:py-[6px]
        [&_th]:text-left [&_td]:border [&_td]:border-default
        [&_td]:px-[8px] [&_td]:py-[6px] [&_input]:mr-[6px]"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
        skipHtml
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
