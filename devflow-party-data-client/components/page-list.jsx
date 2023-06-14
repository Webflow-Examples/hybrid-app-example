"use client";

import { useState } from "react";
import PageRow from "./page-row";
import { PageSlideOver } from "./slide-over";

export default function PageList({pages}){
  const [openPageId, setOpenPageId] = useState(null);
  return (
    <div className="mt-4 flow-root">
      {openPageId && <PageSlideOver openPageId={openPageId} setOpenPageId={setOpenPageId} />}
      <ul role="list" className="-my-5 divide-y divide-gray-200">
        {pages.map((page) => (
          <PageRow key={page.id} page={page} setOpenPageId={setOpenPageId} />
        ))}
      </ul>
    </div>
  )
}