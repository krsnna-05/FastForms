"use client";

import { Inbox, Plus } from "lucide-react";

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
  const { forms } = useFormStore();

  return (
    <SidebarMenu>
      {forms.map((form) => (
        <UserForm key={form.id} id={form.id} title={form.title} />
      ))}
    </SidebarMenu>
  );
};

type UserFormProps = {
  id: string;
  title: string;
};

const UserForm = ({ id, title }: UserFormProps) => {
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
