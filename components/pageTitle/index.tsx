"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, LoaderCircle } from "lucide-react";

interface PageTitleProps {
  title: string;
  url?: string;
  redirect?: (url: string) => void;
  loading?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  url,
  redirect,
  loading = false,
}) => {
  const router = useRouter();

  const BackButton = () => {
    if (loading) {
      return (
        <div className="mr-[-6px]">
          <LoaderCircle className="h-3 w-3" />
        </div>
      );
    }

    const buttonClasses =
      "mt-[1px] rounded border-2 border-border bg-white p-[0.9px]";
    const iconClasses = "h-4 w-4 stroke-colorVariant-heading";

    return (
      <div className={buttonClasses}>
        <ChevronLeft className={iconClasses} />
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {url ? (
        redirect ? (
          <div onClick={() => redirect(url)}>
            <BackButton />
          </div>
        ) : (
          <Link
            href={url}
            className="rounded border-2 border-border bg-white p-[0.9px]"
          >
            <ChevronLeft className="h-4 w-4 stroke-colorVariant-heading" />
          </Link>
        )
      ) : url !== undefined ? (
        <div
          onClick={() => router.back()}
          className="rounded border-2 border-border bg-white p-[0.9px]"
        >
          <ChevronLeft className="h-4 w-4 stroke-colorVariant-heading" />
        </div>
      ) : null}

      <h2 className="text-xl font-semibold text-colorVariant-heading">
        {title}
      </h2>
    </div>
  );
};

export default PageTitle;
