"use client";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import SimpleBar from "simplebar-react";
import PdfFullScreen from "./PdfFullScreen";

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

  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="zoom" variant="ghost" className="gap-1.5">
              <Search className="w-4 h-4" />
              {scale * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => {
                setScale(0.5);
              }}
            >
              50%
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setScale(0.75);
              }}
            >
              75%
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setScale(1);
              }}
            >
              100%
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setScale(1.5);
              }}
            >
              150%
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setScale(1.75);
              }}
            >
              175%
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setScale(2);
              }}
            >
              200%
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setScale(2.5);
              }}
            >
              250%
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            aria-label="previous page"
            variant="ghost"
            onClick={() => {
              setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(currPage - 1));
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={numPages === undefined || currPage === numPages}
            aria-label="previous page"
            variant="ghost"
            onClick={() => {
              setCurrPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
              setValue("page", String(currPage + 1));
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <Button
            aria-label="rotate 90 degrees"
            variant="ghost"
            onClick={() => {
              setRotation((prev) => {
                return prev + 90;
              });
            }}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <PdfFullScreen fileUrl={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100ch-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center items-center">
                  <Loader2 className="my-24 w-6 h-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
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
              {isLoading && renderedScale ? (
                <Page
                  key={"@" + renderedScale}
                  pageNumber={currPage}
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                />
              ) : null}
              <Page
                key={"@" + scale}
                pageNumber={currPage}
                width={width ? width : 1}
                scale={scale}
                rotate={rotation}
                className={cn(isLoading ? "hidden" : "")}
                loading={
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
