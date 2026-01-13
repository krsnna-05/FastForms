"use client";

import { Inbox, Plus } from "lucide-react";
import { useEffect } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import useFormStore from "@/store/FormStore";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar() {
  return (
    <Sidebar className=" pt-20 ">
      <SidebarContent className=" p-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="">
                  <Link href="/dashboard" className="">
                    <Button variant={"default"} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      New Form
                    </Button>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="my-1 bg-muted-foreground" />
        <SidebarGroup>
          <SidebarGroupLabel>Your Forms</SidebarGroupLabel>
          <UserForms />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const UserForms = () => {
  const { forms, setForms } = useFormStore();
  const { userId, token } = useAuth();

  useEffect(() => {
    console.log("Current forms in store:", forms);
  }, [forms]);

  useEffect(() => {
    const fetchForms = async () => {
      if (!userId || !token) return;

      try {
        const response = await fetch(`/api/forms?userId=${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch forms:", response.statusText);
          return;
        }

        const data = await response.json();
        if (data.success && data.forms) {
          setForms(data.forms);
        }

        console.log("Fetched forms:", data.forms);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, [userId, token, setForms]);

  if (forms.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="text-sm text-muted-foreground px-2">
            No forms found
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {forms.map((form) => (
        <UserForm key={form.$id} id={form.$id} title={form.formTitle} />
      ))}
    </SidebarMenu>
  );
};

type UserFormProps = {
  id: string;
  title: string;
};

const UserForm = ({ id, title }: UserFormProps) => {
  console.log("Rendering UserForm with ID:", id, "and title:", title);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/forms/${id}`}>
          <Button variant="ghost" className="w-full justify-start">
            <Inbox className="mr-2 h-4 w-4" />
            {title}
          </Button>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
