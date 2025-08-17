import React, { Suspense } from "react";

export default function Tag({
  params,
}: {
  params: Promise<{ tagName: string }>;
}) {
  return (
    <div>
      <Suspense>
        <SuspendedPage params={params} />
      </Suspense>
    </div>
  );
}

async function SuspendedPage({
  params,
}: {
  params: Promise<{ tagName: string }>;
}) {
  const { tagName } = await params;

  return <div>tag: {tagName}</div>;
}
