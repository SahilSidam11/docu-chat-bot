"use client";
import { Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();

  const { width, ref } = useResizeDetector();

  return (
    <div className="w-full bg-white rounded-md shadow-sm flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">top bar</div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            loading={
              <div className="flex justify-center items-center">
                <Loader2 className="my-24 w-6 h-6 animate-spin" />
              </div>
            }
            onLoadError={() => {
              toast({
                title: "Unable to load PDF",
                description: "Please try again later",
                variant: "destructive",
              });
            }}
            className="max-h-full"
            file={url}
          >
            <Page pageNumber={1} width={width ? width : 1} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
