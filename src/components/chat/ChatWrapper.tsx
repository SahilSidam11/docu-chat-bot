"use client";
import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId: fileId,
    },
    {
      refetchInterval: (data) =>
        data?.state.status === "success" || data?.state.status === "error"
          ? false
          : 500,
    }
  );

  if (isLoading) {
    return (
      <div className="relative min-h-full flex bg-zinc-50 divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="relative min-h-full flex bg-zinc-50 divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            <h3 className="font-semibold text-xl">Processing PDF...</h3>
            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>
      </div>
    );
  }

  if (data?.status === "FAILED") {
    <div className="relative min-h-full flex bg-zinc-50 divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex-1 flex justify-center items-center flex-col mb-28">
        <div className="flex flex-col items-center gap-2">
          <XCircle className="h-8 w-8 text-rose-500" />
          <h3 className="font-semibold text-xl">Too many pages in PDF</h3>
          <p className="text-sm text-zinc-500">
            Your <span className="font-medium">free</span> plan supports up to 5
            pages per PDF.
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "secondary",
              className: "mt-4",
            })}
          >
            <ChevronLeft className="w-3 h-3 mr-1.5" />
            Back
          </Link>
        </div>
      </div>
    </div>;
  }

  return (
    <div className=" relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages />
      </div>
      <ChatInput isDisabled />
    </div>
  );
};

export default ChatWrapper;
