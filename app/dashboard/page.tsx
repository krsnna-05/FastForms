"use client";
import CreateForm from "@/components/dashboard/CreateForm";
import React, { useState } from "react";

const AppPage = () => {
  const [loading, setloading] = useState(true);

  return <CreateForm setLoading={setloading} />;
};

export default AppPage;
