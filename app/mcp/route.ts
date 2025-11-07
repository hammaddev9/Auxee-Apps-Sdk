export const runtime = "nodejs";
import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(
    "https://auxee-2-0.vercel.app",
    "/"
  );

  const contentWidget = {
    id: "show_content",
    title: "Show Content",
    templateUri: "ui://widget/content-template.html",
    invoking: "Loading content...",
    invoked: "Content loaded",
    html,
    description: "Displays the homepage content",
    widgetDomain: "https://auxee-2-0.vercel.app",
  };
  server.registerResource(
    "content-widget",
    contentWidget.templateUri,
    {
      title: contentWidget.title,
      description: contentWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": contentWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${contentWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": contentWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": contentWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerTool(
  "list_notebooks",
  {
    title: "List Notebooks",
    description: "Displays all available notebooks inside the iframe widget",
    inputSchema: {},
    _meta: {
      ...widgetMeta(contentWidget),
      "openai/outputTemplate": contentWidget.templateUri,
      "openai/resultCanProduceWidget": true,
    },
  },
  async () => {
    const notebooks = [
      { id: 1, name: "🧠 AI Research Notes", date: "Nov 3, 2025" },
      { id: 2, name: "🎨 UX Design Experiments", date: "Oct 25, 2025" },
      { id: 3, name: "📈 Product Strategy Draft", date: "Oct 14, 2025" },
      { id: 4, name: "🧾 Meeting Summary Logs", date: "Sep 30, 2025" },
    ];

    return {
      content: [],
      structuredContent: { notebooks },
      _meta: {
        ...widgetMeta(contentWidget),
        "openai/outputTemplate": contentWidget.templateUri,
        "openai/resultCanProduceWidget": true,
      },
    };
  }
);
});

export const GET = handler;
export const POST = handler;
