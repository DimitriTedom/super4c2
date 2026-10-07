import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export const markdownRemarkPlugins = [remarkGfm, remarkBreaks];
export const markdownRehypePlugins = [rehypeRaw, rehypeSanitize];
